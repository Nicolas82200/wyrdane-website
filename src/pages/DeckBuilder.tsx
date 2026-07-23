import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import type { CardData } from "../types";
import GameCard from "../components/GameCard";
import { CARD_WIDTH, CARD_HEIGHT } from "../components/cardMetrics";
import gameCards from "../data/gameCards.json";
import { KEYWORDS, KEYWORD_BY_NAME } from "../data/keywords";
import "./DeckBuilder.css";

// Mêmes règles que le deck builder du jeu (scripts/deck/DeckBuilder.gd) :
// pas de plafond de taille, minimums séparés cartes jouables / ressources,
// max 4 copies (sauf ressources), le tout borné par la collection possédée.
const MIN_CARDS = 40;
const MIN_RESOURCE_CARDS = 10;
const MAX_COPIES = 4;

// L'échelle 0.9 de la grille (DeckBuilder.GRID_CARD_SCALE côté jeu) est
// appliquée en CSS (.db-card-scale) ; la preview au survol reprend le 1.15 du jeu.
const PREVIEW_SCALE = 1.15;

const RARITY_ORDER = ["Commune", "Rare", "Épique", "Légendaire"];
const TYPE_ORDER = ["Serviteur", "Incantation", "Rituel", "Enchantement", "Ressource"];
const COST_FILTERS = [-1, 0, 1, 2, 3, 4, 5, 6, 7];

// CurrencyManager.card_price côté jeu / collectionModel.CARD_PRICE_BY_RARITY côté backend
const CARD_PRICE_BY_RARITY: Record<string, number> = {
	Commune: 100,
	Rare: 150,
	Épique: 200,
	Légendaire: 250,
};

type GameCardInfo = { path: string; keywords: string[] };
const GAME_CARDS = gameCards as Record<string, GameCardInfo>;
const NAME_BY_PATH = new Map(Object.entries(GAME_CARDS).map(([name, info]) => [info.path, name]));

type SortMode = "" | "cost" | "name" | "rarity";
type HoverState = { card: CardData; rect: DOMRect; maxed: boolean; locked: boolean };

function cardKeywords(card: CardData): string[] {
	return GAME_CARDS[card.name]?.keywords ?? [];
}

function utf8ToBase64(text: string): string {
	const bytes = new TextEncoder().encode(text);
	let binary = "";
	bytes.forEach((b) => {
		binary += String.fromCharCode(b);
	});
	return btoa(binary);
}

function base64ToUtf8(code: string): string | null {
	try {
		const binary = atob(code.trim());
		const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
		return new TextDecoder().decode(bytes);
	} catch {
		return null;
	}
}

export default function DeckBuilder() {
	const navigate = useNavigate();
	const { deckId } = useParams<{ deckId: string }>();
	const isEditing = Boolean(deckId);

	const [cards, setCards] = useState<CardData[]>([]);
	const [owned, setOwned] = useState<Map<number, number>>(new Map());
	const [balance, setBalance] = useState<number>(0);
	const [loading, setLoading] = useState(true);
	const [fetchError, setFetchError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);

	const [search, setSearch] = useState("");
	const [raceFilter, setRaceFilter] = useState("");
	const [typeFilter, setTypeFilter] = useState("");
	const [rarityFilter, setRarityFilter] = useState("");
	const [costFilter, setCostFilter] = useState(-1);
	const [keywordFilter, setKeywordFilter] = useState("");
	const [hideLocked, setHideLocked] = useState(true);
	const [sortMode, setSortMode] = useState<SortMode>("");

	const [deckName, setDeckName] = useState("");
	const [deck, setDeck] = useState<Map<number, number>>(new Map());

	const [hover, setHover] = useState<HoverState | null>(null);
	const [buyingId, setBuyingId] = useState<number | null>(null);
	const [buyError, setBuyError] = useState<number | null>(null);

	const [exportCode, setExportCode] = useState<string | null>(null);
	const [importOpen, setImportOpen] = useState(false);
	const [importText, setImportText] = useState("");
	const [importError, setImportError] = useState(false);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setLoading(true);
			setFetchError(null);
			try {
				const [cardsRes, collectionRes, balanceRes] = await Promise.all([
					api.get<CardData[]>("/api/cards"),
					api.get<(CardData & { quantity: number })[]>("/api/collection"),
					api.get<{ balance: number }>("/api/currency/balance"),
				]);
				if (cancelled) return;
				setCards(cardsRes.data);
				setOwned(new Map(collectionRes.data.map((c) => [c.id, c.quantity])));
				setBalance(balanceRes.data.balance);

				if (deckId) {
					const deckRes = await api.get(`/api/decks/${deckId}`);
					if (cancelled) return;
					setDeckName(deckRes.data.name);
					const map = new Map<number, number>();
					deckRes.data.cards.forEach((c: { card_id: number; quantity: number }) => {
						map.set(c.card_id, c.quantity);
					});
					setDeck(map);
				}
			} catch (err) {
				console.error(err);
				if (!cancelled) {
					setFetchError(
						deckId
							? "Impossible de charger ce deck."
							: "Impossible de charger les cartes depuis la base Wyrdane.",
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, [deckId]);

	// ─── Règles de possession / copies (DeckManager.can_add_card) ───────────

	function ownedQty(card: CardData): number {
		return owned.get(card.id) ?? 0;
	}

	function isLocked(card: CardData): boolean {
		return card.card_type !== "Ressource" && ownedQty(card) <= 0;
	}

	function maxCopiesOf(card: CardData): number {
		if (card.card_type === "Ressource") return ownedQty(card);
		return Math.min(MAX_COPIES, ownedQty(card));
	}

	function isMaxed(card: CardData): boolean {
		return (deck.get(card.id) ?? 0) >= maxCopiesOf(card);
	}

	// ─── Filtres / tri (DeckBuilder._match_filters / _sort_cards) ───────────

	const races = useMemo(
		() => Array.from(new Set(cards.map((c) => c.race))).sort((a, b) => a.localeCompare(b)),
		[cards],
	);

	const filteredCards = useMemo(() => {
		const needle = search.trim().toLowerCase();
		let result = cards.filter((card) => {
			if (
				needle &&
				!card.name.toLowerCase().includes(needle) &&
				!(card.effect ?? "").toLowerCase().includes(needle)
			)
				return false;
			if (raceFilter && card.race !== raceFilter) return false;
			if (typeFilter && card.card_type !== typeFilter) return false;
			if (rarityFilter && (card.rarity ?? "") !== rarityFilter) return false;
			const cost = Number(card.cost ?? 0);
			if (costFilter === 7 && cost < 7) return false;
			if (costFilter >= 0 && costFilter < 7 && cost !== costFilter) return false;
			if (keywordFilter && !cardKeywords(card).includes(keywordFilter)) return false;
			if (hideLocked && isLocked(card)) return false;
			return true;
		});

		if (sortMode !== "") {
			result = [...result].sort((a, b) => {
				if (sortMode === "cost") {
					const diff = Number(a.cost ?? 0) - Number(b.cost ?? 0);
					return diff !== 0 ? diff : a.name.localeCompare(b.name);
				}
				if (sortMode === "rarity") {
					const diff =
						RARITY_ORDER.indexOf(a.rarity ?? "") - RARITY_ORDER.indexOf(b.rarity ?? "");
					return diff !== 0 ? diff : a.name.localeCompare(b.name);
				}
				return a.name.localeCompare(b.name);
			});
		}
		return result;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cards, owned, search, raceFilter, typeFilter, rarityFilter, costFilter, keywordFilter, hideLocked, sortMode]);

	// ─── Contenu du deck ─────────────────────────────────────────────────────

	const deckEntries = useMemo(() => {
		return Array.from(deck.entries())
			.map(([id, quantity]) => {
				const card = cards.find((c) => c.id === id);
				return card ? { card, quantity } : null;
			})
			.filter((e): e is { card: CardData; quantity: number } => e !== null);
	}, [deck, cards]);

	const playableCount = deckEntries
		.filter((e) => e.card.card_type !== "Ressource")
		.reduce((sum, e) => sum + e.quantity, 0);
	const resourceCount = deckEntries
		.filter((e) => e.card.card_type === "Ressource")
		.reduce((sum, e) => sum + e.quantity, 0);
	const countsOk = playableCount >= MIN_CARDS && resourceCount >= MIN_RESOURCE_CARDS;

	// Courbe de mana : coûts 0..6 puis 7+ regroupés (DeckBuilder.CURVE_BUCKETS)
	const stats = useMemo(() => {
		const curve = new Array(8).fill(0) as number[];
		const typeCounts = new Map<string, number>();
		const raceCounts = new Map<string, number>();
		let totalCost = 0;
		let total = 0;
		deckEntries.forEach(({ card, quantity }) => {
			const cost = Number(card.cost ?? 0);
			curve[Math.min(cost, 7)] += quantity;
			totalCost += cost * quantity;
			total += quantity;
			typeCounts.set(card.card_type, (typeCounts.get(card.card_type) ?? 0) + quantity);
			raceCounts.set(card.race, (raceCounts.get(card.race) ?? 0) + quantity);
		});
		return { curve, typeCounts, raceCounts, avg: total > 0 ? totalCost / total : 0, total };
	}, [deckEntries]);

	// ─── Actions ─────────────────────────────────────────────────────────────

	function addToDeck(card: CardData) {
		if (isMaxed(card)) return;
		setDeck((prev) => {
			const next = new Map(prev);
			next.set(card.id, (next.get(card.id) ?? 0) + 1);
			return next;
		});
	}

	function removeOne(cardId: number) {
		setDeck((prev) => {
			const next = new Map(prev);
			const current = next.get(cardId) ?? 0;
			if (current <= 1) next.delete(cardId);
			else next.set(cardId, current - 1);
			return next;
		});
	}

	async function buyCard(card: CardData) {
		setBuyingId(card.id);
		setBuyError(null);
		try {
			const res = await api.post<{ balance: number; quantity: number }>(
				"/api/collection/buy-card",
				{ cardId: card.id },
			);
			setOwned((prev) => new Map(prev).set(card.id, res.data.quantity));
			setBalance(res.data.balance);
		} catch (err) {
			console.error(err);
			setBuyError(card.id);
			setTimeout(() => setBuyError(null), 2000);
		} finally {
			setBuyingId(null);
		}
	}

	async function handleSave() {
		if (!deckName.trim()) {
			setSaveError("Merci de nommer votre deck.");
			return;
		}
		if (!countsOk) {
			setSaveError(
				`Le deck doit contenir au moins ${MIN_CARDS} cartes jouables et ${MIN_RESOURCE_CARDS} cartes-ressource.`,
			);
			return;
		}
		setSaving(true);
		setSaveError(null);
		try {
			const payload = {
				name: deckName,
				entries: deckEntries.map((e) => ({ cardId: e.card.id, quantity: e.quantity })),
			};
			if (isEditing) await api.put(`/api/decks/${deckId}`, payload);
			else await api.post("/api/decks", payload);
			navigate("/decks");
		} catch (err) {
			console.error(err);
			setSaveError("Erreur lors de la sauvegarde du deck.");
		} finally {
			setSaving(false);
		}
	}

	// ─── Export / Import : même code base64 que DeckData.to_code/from_code ──

	function handleExport() {
		const lines = [deckName || "Nouveau Deck"];
		deckEntries.forEach(({ card, quantity }) => {
			const path = GAME_CARDS[card.name]?.path;
			if (!path) return;
			for (let i = 0; i < quantity; i++) lines.push(path);
		});
		const code = utf8ToBase64(lines.join("\n"));
		navigator.clipboard?.writeText(code).catch(() => {});
		setExportCode(code);
	}

	function handleImport() {
		const raw = base64ToUtf8(importText);
		if (!raw) {
			setImportError(true);
			return;
		}
		const lines = raw.split("\n");
		const next = new Map<number, number>();
		for (let i = 1; i < lines.length; i++) {
			const name = NAME_BY_PATH.get(lines[i]);
			if (!name) continue;
			const card = cards.find((c) => c.name === name);
			if (!card) continue;
			const current = next.get(card.id) ?? 0;
			if (card.card_type !== "Ressource" && current >= MAX_COPIES) continue;
			next.set(card.id, current + 1);
		}
		if (next.size === 0) {
			setImportError(true);
			return;
		}
		setDeck(next);
		if (lines[0]) setDeckName(lines[0]);
		setImportOpen(false);
		setImportText("");
		setImportError(false);
	}

	// ─── Preview au survol (façon DeckBuilder._on_card_wrapper_entered) ─────

	function previewPosition(rect: DOMRect) {
		const pw = CARD_WIDTH * PREVIEW_SCALE;
		const ph = CARD_HEIGHT * PREVIEW_SCALE;
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		let x = rect.right + 12;
		if (x + pw > vw - 4) x = rect.left - pw - 12;
		x = Math.min(Math.max(x, 4), vw - pw - 4);
		const y = Math.min(Math.max(rect.top + rect.height / 2 - ph / 2, 4), vh - ph - 4);
		return { x, y, pw, ph };
	}

	// ─── Rendu ───────────────────────────────────────────────────────────────

	if (loading || fetchError) {
		return (
			<div className="deckbuilder">
				<header className="deckbuilder-header">
					<button type="button" className="db-btn" onClick={() => navigate("/decks")}>
						← Retour
					</button>
					<h1>Constructeur de Deck</h1>
					<div className="deckbuilder-header-spacer" />
				</header>
				<div className={`deckbuilder-loading${fetchError ? " deckbuilder-error" : ""}`}>
					{fetchError ?? "Chargement des cartes..."}
				</div>
			</div>
		);
	}

	const hoverKeywords = hover
		? cardKeywords(hover.card)
				.map((name) => KEYWORD_BY_NAME.get(name))
				.filter((k): k is NonNullable<typeof k> => Boolean(k))
		: [];

	return (
		<div className="deckbuilder">
			<header className="deckbuilder-header">
				<button type="button" className="db-btn" onClick={() => navigate("/decks")}>
					← Retour
				</button>
				<h1>{isEditing ? "Modifier le Deck" : "Constructeur de Deck"}</h1>
				<div className="deckbuilder-balance" title="Solde">
					◈ {balance}
				</div>
			</header>

			<div className="deckbuilder-body">
				<section className="deckbuilder-catalog">
					<input
						className="db-search"
						type="text"
						placeholder="🔍  Rechercher une carte..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>

					<div className="db-filter-bar">
						<span className="db-filter-label">Race :</span>
						<div className="db-filter-group">
							<FilterButton active={raceFilter === ""} onClick={() => setRaceFilter("")}>
								Tous
							</FilterButton>
							{races.map((r) => (
								<FilterButton key={r} active={raceFilter === r} onClick={() => setRaceFilter(r)}>
									{r === "Demon" ? "Démon" : r}
								</FilterButton>
							))}
						</div>

						<span className="db-filter-label">Type :</span>
						<div className="db-filter-group">
							<FilterButton active={typeFilter === ""} onClick={() => setTypeFilter("")}>
								Tous
							</FilterButton>
							{TYPE_ORDER.map((t) => (
								<FilterButton key={t} active={typeFilter === t} onClick={() => setTypeFilter(t)}>
									{t}
								</FilterButton>
							))}
						</div>

						<span className="db-filter-label">Rareté :</span>
						<div className="db-filter-group">
							<FilterButton active={rarityFilter === ""} onClick={() => setRarityFilter("")}>
								Tous
							</FilterButton>
							{RARITY_ORDER.map((r) => (
								<FilterButton
									key={r}
									active={rarityFilter === r}
									onClick={() => setRarityFilter(r)}
								>
									{r}
								</FilterButton>
							))}
						</div>

						<span className="db-filter-label">Coût :</span>
						<div className="db-filter-group">
							{COST_FILTERS.map((c) => (
								<FilterButton key={c} active={costFilter === c} onClick={() => setCostFilter(c)}>
									{c === -1 ? "Tous" : c === 7 ? "7+" : String(c)}
								</FilterButton>
							))}
						</div>

						<FilterButton active={hideLocked} onClick={() => setHideLocked(!hideLocked)}>
							Cacher les cartes non débloquées
						</FilterButton>
					</div>

					<div className="db-sort-bar">
						<span className="db-filter-label">Mot-clé :</span>
						<select
							className="db-select"
							value={keywordFilter}
							onChange={(e) => setKeywordFilter(e.target.value)}
						>
							<option value="">Tous</option>
							{KEYWORDS.map((k) => (
								<option key={k.name} value={k.name}>
									{k.name}
								</option>
							))}
						</select>

						<span className="db-filter-label db-sort-label">Trier :</span>
						<div className="db-filter-group">
							{(
								[
									["", "Par défaut"],
									["cost", "Coût"],
									["name", "Nom"],
									["rarity", "Rareté"],
								] as [SortMode, string][]
							).map(([mode, label]) => (
								<FilterButton key={mode} active={sortMode === mode} onClick={() => setSortMode(mode)}>
									{label}
								</FilterButton>
							))}
						</div>
					</div>

					<div className="db-card-grid">
						{filteredCards.map((card) => {
							const maxed = isMaxed(card);
							const locked = isLocked(card);
							const price = CARD_PRICE_BY_RARITY[card.rarity ?? ""] ?? 0;
							return (
								<div
									key={card.id}
									className="db-card-wrapper"
									onClick={() => addToDeck(card)}
									onMouseEnter={(e) =>
										setHover({
											card,
											rect: e.currentTarget.getBoundingClientRect(),
											maxed,
											locked,
										})
									}
									onMouseLeave={() => setHover(null)}
								>
									<div
										className="db-card-scale"
										style={{ filter: maxed ? "brightness(0.38)" : undefined }}
									>
										<GameCard card={card} />
									</div>
									{locked && card.card_type !== "Ressource" && price > 0 && (
										<button
											type="button"
											className="db-buy-btn"
											disabled={buyingId === card.id}
											onClick={(e) => {
												e.stopPropagation();
												buyCard(card);
											}}
										>
											{buyError === card.id
												? "Achat impossible (solde insuffisant ou erreur réseau)."
												: `Acheter (${price})`}
										</button>
									)}
								</div>
							);
						})}
						{filteredCards.length === 0 && (
							<p className="db-catalog-empty">Aucune carte ne correspond à ces filtres.</p>
						)}
					</div>
				</section>

				<aside className="deckbuilder-sidebar">
					<input
						className="db-deck-name"
						type="text"
						placeholder="Nom du deck..."
						value={deckName}
						onChange={(e) => setDeckName(e.target.value)}
					/>

					<div className={`db-count-label${countsOk ? " ok" : " ko"}`}>
						<div>
							{playableCount} cartes jouables (min {MIN_CARDS})
						</div>
						<div>
							{resourceCount} cartes-ressource (min {MIN_RESOURCE_CARDS})
						</div>
					</div>

					<div className="db-deck-list">
						{deckEntries.length === 0 && <p className="db-deck-empty">Aucune carte ajoutée.</p>}
						{deckEntries.map(({ card, quantity }) => (
							<div
								className="db-deck-row"
								key={card.id}
								onMouseEnter={(e) =>
									setHover({
										card,
										rect: e.currentTarget.getBoundingClientRect(),
										maxed: false,
										locked: false,
									})
								}
								onMouseLeave={() => setHover(null)}
							>
								<span className="db-deck-row-cost">{card.cost ?? 0}</span>
								<span className="db-deck-row-name">{card.name}</span>
								<span className="db-deck-row-qty">{quantity}</span>
								<button
									type="button"
									className="db-deck-row-del"
									onClick={() => removeOne(card.id)}
									title={`Retirer ${card.name}`}
								>
									✕
								</button>
							</div>
						))}
					</div>

					{stats.total > 0 && (
						<div className="db-stats">
							<div className="db-stats-title">Courbe de mana</div>
							<div className="db-curve">
								{stats.curve.map((count, i) => {
									const max = Math.max(1, ...stats.curve);
									return (
										<div className="db-curve-col" key={i}>
											<span className="db-curve-count">{count > 0 ? count : ""}</span>
											<div
												className={`db-curve-bar${count > 0 ? "" : " empty"}`}
												style={{ height: `${Math.max(4, (count / max) * 60)}px` }}
											/>
											<span className="db-curve-cost">{i < 7 ? i : "7+"}</span>
										</div>
									);
								})}
							</div>
							<div className="db-stats-avg">Coût moyen : {stats.avg.toFixed(1)}</div>
							<div className="db-stats-title">Répartition</div>
							<div className="db-chips">
								{TYPE_ORDER.filter((t) => stats.typeCounts.has(t)).map((t) => (
									<span className="db-chip" key={t}>
										{t} : {stats.typeCounts.get(t)}
									</span>
								))}
							</div>
							<div className="db-chips">
								{Array.from(stats.raceCounts.entries()).map(([race, count]) => (
									<span className="db-chip" key={race}>
										{race === "Demon" ? "Démon" : race} : {count}
									</span>
								))}
							</div>
						</div>
					)}

					<div className="db-sidebar-actions">
						<button type="button" className="db-btn" onClick={handleExport}>
							Exporter
						</button>
						<button
							type="button"
							className="db-btn"
							onClick={() => {
								setImportOpen(true);
								setImportError(false);
							}}
						>
							Importer
						</button>
					</div>

					{saveError && <p className="db-save-error">{saveError}</p>}

					<button
						type="button"
						className="db-btn db-btn-save"
						onClick={handleSave}
						disabled={saving || !countsOk}
					>
						{saving ? "Sauvegarde..." : "Sauvegarder le deck"}
					</button>
				</aside>
			</div>

			{hover &&
				(() => {
					const { x, y, pw, ph } = previewPosition(hover.rect);
					const tooltipLeft = x + pw + 12 + 260 > window.innerWidth;
					return (
						<div className="db-preview-layer">
							<div className="db-preview" style={{ left: x, top: y }}>
								<GameCard card={hover.card} />
							</div>
							{(hover.maxed || hover.locked) && (
								<div
									className="db-max-tooltip"
									style={{
										left: hover.rect.left + hover.rect.width / 2,
										top: hover.rect.top + hover.rect.height / 2,
									}}
								>
									{hover.locked
										? "Carte non débloquée"
										: "Nombre maximum de copies dans ce deck atteint"}
								</div>
							)}
							{hoverKeywords.length > 0 && (
								<div
									className="db-keyword-tooltips"
									style={{
										left: tooltipLeft ? x - 262 : x + pw + 12,
										top: y,
									}}
								>
									{hoverKeywords.map((k) => (
										<div className="db-keyword-tooltip" key={k.name}>
											<strong>{k.name}</strong>
											<span>{k.description}</span>
										</div>
									))}
								</div>
							)}
							<div
								className="db-race-tooltip"
								style={{ left: x + pw / 2, top: Math.min(y + ph + 4, window.innerHeight - 30) }}
							>
								{hover.card.race === "Demon" ? "Démon" : hover.card.race}
							</div>
						</div>
					);
				})()}

			{exportCode !== null && (
				<div className="db-dialog-backdrop" onClick={() => setExportCode(null)}>
					<div className="db-dialog" onClick={(e) => e.stopPropagation()}>
						<h2>Code du deck</h2>
						<p>
							Code copié dans le presse-papiers. Partage-le pour que quelqu'un d'autre importe ce
							deck (site web ou jeu).
						</p>
						<textarea readOnly value={exportCode} rows={5} />
						<button type="button" className="db-btn" onClick={() => setExportCode(null)}>
							OK
						</button>
					</div>
				</div>
			)}

			{importOpen && (
				<div className="db-dialog-backdrop" onClick={() => setImportOpen(false)}>
					<div className="db-dialog" onClick={(e) => e.stopPropagation()}>
						<h2>Importer un deck</h2>
						<p>Colle un code de deck ci-dessous.</p>
						<textarea
							value={importText}
							onChange={(e) => setImportText(e.target.value)}
							rows={5}
						/>
						{importError && <p className="db-save-error">Code de deck invalide.</p>}
						<div className="db-dialog-actions">
							<button type="button" className="db-btn" onClick={() => setImportOpen(false)}>
								Annuler
							</button>
							<button type="button" className="db-btn db-btn-save" onClick={handleImport}>
								Importer
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

function FilterButton({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: ReactNode;
}) {
	return (
		<button type="button" className={`db-filter-btn${active ? " active" : ""}`} onClick={onClick}>
			{children}
		</button>
	);
}
