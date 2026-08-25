import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useBlocker, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import type { CardData } from "../types";
import GameCard from "../components/GameCard";
import { CARD_WIDTH, CARD_HEIGHT } from "../components/cardMetrics";
import gameCards from "../data/gameCards.json";
import { KEYWORDS, KEYWORD_BY_NAME } from "../data/keywords";
import { computeRaceCost } from "../helper/costSystem";
import { makeUniqueDeckName } from "../helper/deckNames";
import { useAuth } from "../auth/useAuth";
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
type HoverState = {
	card: CardData;
	rect: DOMRect;
	panelRect: DOMRect;
	maxed: boolean;
	locked: boolean;
};

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
	const { refreshBalance } = useAuth();

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
	// true dès que le deck a été modifié depuis le dernier chargement/sauvegarde
	// (voir DeckBuilder.gd _dirty côté jeu) — commande le bouton Sauvegarder et
	// la confirmation de sortie sans sauvegarde.
	const [dirty, setDirty] = useState(false);
	// Noms des autres decks du joueur (hors celui en cours d'édition), pour
	// dédoublonner automatiquement le nom au moment de sauvegarder.
	const [existingDeckNames, setExistingDeckNames] = useState<string[]>([]);

	const catalogRef = useRef<HTMLDivElement>(null);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const [hover, setHover] = useState<HoverState | null>(null);

	// Facteur d'échelle de la page (voir .deckbuilder-scale-outer/.deckbuilder
	// dans DeckBuilder.css, même formule clamp(0.55, 100vw / 1920, 1)) — la
	// preview/les tooltips au survol vivent hors du bloc transformé (ce sont
	// des position: fixed, positionnés par rapport au vrai viewport), donc
	// leur propre géométrie (previewPosition ci-dessous) doit compenser ce
	// même facteur pour rester cohérente avec la taille visuelle réduite.
	const [pageScale, setPageScale] = useState(() =>
		Math.min(1, Math.max(0.55, window.innerWidth / 1920)),
	);
	useEffect(() => {
		function onResize() {
			setPageScale(Math.min(1, Math.max(0.55, window.innerWidth / 1920)));
		}
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);
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
				const [cardsRes, collectionRes, balanceRes, decksRes] = await Promise.all([
					api.get<CardData[]>("/api/cards"),
					api.get<(CardData & { quantity: number })[]>("/api/collection"),
					api.get<{ balance: number }>("/api/currency/balance"),
					api.get<{ id: number; name: string }[]>("/api/decks"),
				]);
				if (cancelled) return;
				setCards(cardsRes.data);
				setOwned(new Map(collectionRes.data.map((c) => [c.id, c.quantity])));
				setBalance(balanceRes.data.balance);
				setExistingDeckNames(
					decksRes.data.filter((d) => !deckId || d.id !== Number(deckId)).map((d) => d.name),
				);

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
		if (card.card_type === "Ressource") return Infinity;
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

	// ─── Avertissements ressources de race (DeckBuilder._race_warnings côté jeu) ─
	// Deux cas : une race jouée dans le deck sans assez de cartes-ressource de
	// cette race pour couvrir le race_cost de sa carte la plus chère ; ou des
	// cartes-ressource d'une race sans aucune carte jouable de cette race.
	const raceWarnings = useMemo(() => {
		const maxRaceCost = new Map<string, number>();
		const playableRacePresent = new Set<string>();
		const resourceRacePresent = new Set<string>();
		const resourceCounts = new Map<string, number>();

		deckEntries.forEach(({ card, quantity }) => {
			if (card.card_type === "Ressource") {
				resourceRacePresent.add(card.race);
				resourceCounts.set(card.race, (resourceCounts.get(card.race) ?? 0) + quantity);
			} else {
				playableRacePresent.add(card.race);
				const raceCost = computeRaceCost(Number(card.cost ?? 0), card.rarity);
				maxRaceCost.set(card.race, Math.max(maxRaceCost.get(card.race) ?? 0, raceCost));
			}
		});

		const warnings: string[] = [];
		maxRaceCost.forEach((needed, race) => {
			const have = resourceCounts.get(race) ?? 0;
			if (have < needed) {
				const label = race === "Demon" ? "Démon" : race;
				warnings.push(
					`Il manque des cartes-ressource : ajoutez au moins ${needed} carte(s)-ressource de ${label} pour pouvoir jouer vos cartes de cette race.`,
				);
			}
		});
		resourceRacePresent.forEach((race) => {
			if (!playableRacePresent.has(race)) {
				const label = race === "Demon" ? "Démon" : race;
				warnings.push(
					`Vous avez des cartes-ressource de ${label} mais aucune carte de cette race dans le deck.`,
				);
			}
		});
		return warnings;
	}, [deckEntries]);

	const canSave = countsOk && raceWarnings.length === 0;

	// ─── Blocage de navigation avec modifications non sauvegardées ─────────────
	const blocker = useBlocker(
		({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname,
	);

	useEffect(() => {
		function handleBeforeUnload(e: BeforeUnloadEvent) {
			if (!dirty) return;
			e.preventDefault();
			e.returnValue = "";
		}
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [dirty]);

	// ─── Actions ─────────────────────────────────────────────────────────────

	function addToDeck(card: CardData) {
		if (isMaxed(card)) return;
		setDeck((prev) => {
			const next = new Map(prev);
			next.set(card.id, (next.get(card.id) ?? 0) + 1);
			return next;
		});
		setDirty(true);
	}

	function removeOne(cardId: number) {
		setDeck((prev) => {
			const next = new Map(prev);
			const current = next.get(cardId) ?? 0;
			if (current <= 1) next.delete(cardId);
			else next.set(cardId, current - 1);
			return next;
		});
		setDirty(true);
	}

	function removeAll(cardId: number) {
		setDeck((prev) => {
			const next = new Map(prev);
			next.delete(cardId);
			return next;
		});
		setDirty(true);
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
			// Garde le solde affiché dans la navbar synchronisé plutôt que de le
			// laisser se périmer jusqu'au prochain rechargement de page.
			refreshBalance();
		} catch (err) {
			console.error(err);
			setBuyError(card.id);
			setTimeout(() => setBuyError(null), 2000);
		} finally {
			setBuyingId(null);
		}
	}

	// skipNavigate : appelé depuis la popup de confirmation de sortie, où la
	// navigation déjà en attente (blocker) doit reprendre via blocker.proceed()
	// plutôt qu'un nouvel appel à navigate().
	async function handleSave(opts: { skipNavigate?: boolean } = {}): Promise<boolean> {
		if (!deckName.trim()) {
			setSaveError("Merci de nommer votre deck.");
			return false;
		}
		if (!countsOk) {
			setSaveError(
				`Le deck doit contenir au moins ${MIN_CARDS} cartes jouables et ${MIN_RESOURCE_CARDS} cartes-ressource.`,
			);
			return false;
		}
		if (raceWarnings.length > 0) {
			setSaveError("Corrigez les avertissements de ressources de race avant de sauvegarder.");
			return false;
		}
		setSaving(true);
		setSaveError(null);
		try {
			const finalName = makeUniqueDeckName(deckName.trim(), existingDeckNames);
			const payload = {
				name: finalName,
				entries: deckEntries.map((e) => ({ cardId: e.card.id, quantity: e.quantity })),
			};
			if (isEditing) await api.put(`/api/decks/${deckId}`, payload);
			else await api.post("/api/decks", payload);
			setDeckName(finalName);
			setDirty(false);
			if (!opts.skipNavigate) navigate("/decks");
			return true;
		} catch (err) {
			console.error(err);
			setSaveError("Erreur lors de la sauvegarde du deck.");
			return false;
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
		setDirty(true);
		setImportOpen(false);
		setImportText("");
		setImportError(false);
	}

	// ─── Preview au survol (façon DeckBuilder._on_card_wrapper_entered /
	// _position_hover_tooltips) : par défaut à droite de la carte, repliée à
	// gauche seulement si ça déborderait du panneau réel (catalogue ou liste du
	// deck) plutôt que de tout l'écran — ne recouvre jamais le panneau voisin.
	// Verticalement alignée sur le haut de la carte, bornée au sommet du
	// panneau pour ne jamais chevaucher la barre de filtres au-dessus.
	function previewPosition(rect: DOMRect, panelRect: DOMRect) {
		const pw = CARD_WIDTH * PREVIEW_SCALE * pageScale;
		const ph = CARD_HEIGHT * PREVIEW_SCALE * pageScale;
		const gap = 12 * pageScale;
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		let x = rect.right + gap;
		let onLeft = false;
		if (x + pw > panelRect.right - 4) {
			x = rect.left - pw - gap;
			onLeft = true;
		}
		x = Math.min(Math.max(x, 4), vw - pw - 4);
		const y = Math.min(Math.max(rect.top, panelRect.top), vh - ph - 4);
		return { x, y, pw, ph, onLeft };
	}

	// ─── Rendu ───────────────────────────────────────────────────────────────

	if (loading || fetchError) {
		return (
			<div className="deckbuilder-scale-outer">
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
			</div>
		);
	}

	const hoverKeywords = hover
		? cardKeywords(hover.card)
				.map((name) => KEYWORD_BY_NAME.get(name))
				.filter((k): k is NonNullable<typeof k> => Boolean(k))
		: [];

	return (
		<div className="deckbuilder-scale-outer">
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
						<div className="db-filter-item">
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
						</div>

						<div className="db-filter-item">
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
						</div>

						<div className="db-filter-item">
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
						</div>

						<div className="db-filter-item">
							<span className="db-filter-label">Coût :</span>
							<div className="db-filter-group">
								{COST_FILTERS.map((c) => (
									<FilterButton key={c} active={costFilter === c} onClick={() => setCostFilter(c)}>
										{c === -1 ? "Tous" : c === 7 ? "7+" : String(c)}
									</FilterButton>
								))}
							</div>
						</div>

						<FilterButton active={hideLocked} onClick={() => setHideLocked(!hideLocked)}>
							Cacher les cartes non débloquées
						</FilterButton>
					</div>

					<div className="db-sort-bar">
						<div className="db-filter-item">
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
						</div>

						<div className="db-filter-item">
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
					</div>

					<div className="db-card-grid" ref={catalogRef}>
						{filteredCards.map((card) => {
							const maxed = isMaxed(card);
							const locked = isLocked(card);
							const price = CARD_PRICE_BY_RARITY[card.rarity ?? ""] ?? 0;
							// Achetable tant qu'on n'a pas les 4 exemplaires, pas seulement
							// quand on n'en a aucun (`locked`) : sinon le bouton disparaissait
							// après le tout premier achat, bloquant l'achat des copies 2 a 4.
							const canBuy =
								card.card_type !== "Ressource" && price > 0 && ownedQty(card) < MAX_COPIES;
							return (
								<div
									key={card.id}
									className="db-card-wrapper"
									onClick={() => addToDeck(card)}
									onMouseEnter={(e) =>
										setHover({
											card,
											rect: e.currentTarget.getBoundingClientRect(),
											panelRect:
												catalogRef.current?.getBoundingClientRect() ??
												e.currentTarget.getBoundingClientRect(),
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
									<span className="db-card-owned-badge">
										{(deck.get(card.id) ?? 0)}/{ownedQty(card)}
									</span>
									{canBuy && (
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

				<aside className="deckbuilder-sidebar" ref={sidebarRef}>
					<input
						className="db-deck-name"
						type="text"
						placeholder="Nom du deck..."
						value={deckName}
						onChange={(e) => {
							setDeckName(e.target.value);
							setDirty(true);
						}}
					/>

					<div className={`db-count-label${countsOk ? " ok" : " ko"}`}>
						<div>
							{playableCount} cartes jouables (min {MIN_CARDS})
						</div>
						<div>
							{resourceCount} cartes-ressource (min {MIN_RESOURCE_CARDS})
						</div>
					</div>

					{raceWarnings.length > 0 && (
						<div className="db-race-warnings">
							{raceWarnings.map((w, i) => (
								<p key={i}>{w}</p>
							))}
						</div>
					)}

					<div className="db-deck-list">
						{deckEntries.length === 0 && <p className="db-deck-empty">Aucune carte ajoutée.</p>}
						{deckEntries.map(({ card, quantity }) => (
							<div
								className="db-deck-row"
								key={card.id}
								onClick={() => removeOne(card.id)}
								onMouseEnter={(e) =>
									setHover({
										card,
										rect: e.currentTarget.getBoundingClientRect(),
										panelRect:
											sidebarRef.current?.getBoundingClientRect() ??
											e.currentTarget.getBoundingClientRect(),
										maxed: false,
										locked: false,
									})
								}
								onMouseLeave={() => setHover(null)}
							>
								<span className="db-deck-row-cost">{card.cost ?? 0}</span>
								<span className="db-deck-row-name">{card.name}</span>
								<span className="db-deck-row-qty">x{quantity}</span>
								<button
									type="button"
									className="db-deck-row-del"
									onClick={(e) => {
										e.stopPropagation();
										removeAll(card.id);
									}}
									title={`Retirer toutes les copies de ${card.name}`}
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
						onClick={() => handleSave()}
						disabled={saving || !dirty || !canSave}
					>
						{saving ? "Sauvegarde..." : "Sauvegarder le deck"}
					</button>
				</aside>
			</div>
			</div>

			{hover &&
				(() => {
					const { x, y, pw, ph, onLeft } = previewPosition(hover.rect, hover.panelRect);
					// Les tooltips de mots-clés suivent toujours le côté choisi par la
					// preview (jamais entre la preview et la carte survolée, sinon ils
					// la recouvrent) — voir DeckBuilder.gd _position_hover_tooltips.
					const tooltipsLeft = onLeft ? x - 262 * pageScale : x + pw + 12 * pageScale;
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
										: "Nombre d'exemplaires maximum atteint"}
								</div>
							)}
							{hoverKeywords.length > 0 && (
								<div
									className="db-keyword-tooltips"
									style={{
										left: tooltipsLeft,
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

			{blocker.state === "blocked" && (
				<div className="db-dialog-backdrop" onClick={() => blocker.reset?.()}>
					<div className="db-dialog" onClick={(e) => e.stopPropagation()}>
						<h2>Modifications non sauvegardées</h2>
						<p>
							Vous quittez le constructeur de deck mais vous n'avez pas sauvegardé. Voulez-vous
							sauvegarder ?
						</p>
						{saveError && <p className="db-save-error">{saveError}</p>}
						<div className="db-dialog-actions">
							<button type="button" className="db-btn" onClick={() => blocker.proceed?.()}>
								Quitter sans sauvegarder
							</button>
							<button
								type="button"
								className="db-btn db-btn-save"
								onClick={async () => {
									const ok = await handleSave({ skipNavigate: true });
									if (ok) blocker.proceed?.();
									else blocker.reset?.();
								}}
							>
								Sauvegarder
							</button>
						</div>
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
