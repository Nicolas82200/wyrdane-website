import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { API_URL } from "../api";
import type { CardData } from "../types";
import "./DeckBuilder.css";

type DeckEntry = {
	card: CardData;
	quantity: number;
};

type SortField = "name" | "cost" | "attack" | "rarity";
type SortDirection = "asc" | "desc";

const MIN_DECK_SIZE = 40;
const MAX_DECK_SIZE = 60;
const MAX_COPIES_PER_CARD = 4;

const RARITY_ORDER: Record<string, number> = {
	Commune: 0,
	Rare: 1,
	Épique: 2,
	Légendaire: 3,
};

export default function DeckBuilder() {
	const navigate = useNavigate();
	const { deckId } = useParams<{ deckId: string }>();
	const isEditing = Boolean(deckId);

	const [cards, setCards] = useState<CardData[]>([]);
	const [loading, setLoading] = useState(true);
	const [fetchError, setFetchError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);

	const [search, setSearch] = useState("");
	const [raceFilter, setRaceFilter] = useState("");
	const [typeFilter, setTypeFilter] = useState("");
	const [costFilter, setCostFilter] = useState("");
	const [rarityFilter, setRarityFilter] = useState("");
	const [sortField, setSortField] = useState<SortField>("name");
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const [deckName, setDeckName] = useState("");
	const [deck, setDeck] = useState<Map<number, number>>(new Map());
	const [openStat, setOpenStat] = useState<"mana" | "types" | "rarity" | null>(
		null,
	);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setLoading(true);
			setFetchError(null);
			try {
				const cardsRes = await api.get<CardData[]>("/api/cards");
				if (cancelled) return;
				setCards(cardsRes.data);

				if (deckId) {
					const deckRes = await api.get(`/api/decks/${deckId}`);
					if (cancelled) return;
					setDeckName(deckRes.data.name);
					const map = new Map<number, number>();
					deckRes.data.cards.forEach(
						(c: { card_id: number; quantity: number }) => {
							map.set(c.card_id, c.quantity);
						},
					);
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

	const races = useMemo(() => uniqueSorted(cards.map((c) => c.race)), [cards]);
	const types = useMemo(
		() => uniqueSorted(cards.map((c) => c.card_type)),
		[cards],
	);
	const costs = useMemo(
		() =>
			Array.from(new Set(cards.map((c) => c.cost).filter((v) => v != null)))
				.map((v) => Number(v))
				.sort((a, b) => a - b),
		[cards],
	);
	const rarities = useMemo(
		() =>
			uniqueSorted(cards.map((c) => c.rarity).filter((v): v is string => !!v)),
		[cards],
	);

	const filteredCards = useMemo(() => {
		const term = search.trim().toLowerCase();
		let result = cards.filter((card) => {
			if (term && !card.name.toLowerCase().includes(term)) return false;
			if (raceFilter && card.race !== raceFilter) return false;
			if (typeFilter && card.card_type !== typeFilter) return false;
			if (costFilter && String(card.cost ?? "") !== costFilter) return false;
			if (rarityFilter && (card.rarity ?? "") !== rarityFilter) return false;
			return true;
		});

		result = [...result].sort((a, b) => {
			let diff = 0;
			if (sortField === "name") diff = a.name.localeCompare(b.name);
			else if (sortField === "cost")
				diff = Number(a.cost ?? 0) - Number(b.cost ?? 0);
			else if (sortField === "attack")
				diff = Number(a.attack ?? 0) - Number(b.attack ?? 0);
			else if (sortField === "rarity")
				diff =
					(RARITY_ORDER[a.rarity ?? ""] ?? 0) -
					(RARITY_ORDER[b.rarity ?? ""] ?? 0);
			return sortDirection === "asc" ? diff : -diff;
		});

		return result;
	}, [
		cards,
		search,
		raceFilter,
		typeFilter,
		costFilter,
		rarityFilter,
		sortField,
		sortDirection,
	]);

	const deckEntries: DeckEntry[] = useMemo(() => {
		return Array.from(deck.entries())
			.map(([id, quantity]) => {
				const card = cards.find((c) => c.id === id);
				return card ? { card, quantity } : null;
			})
			.filter((entry): entry is DeckEntry => entry !== null)
			.sort((a, b) => a.card.name.localeCompare(b.card.name));
	}, [deck, cards]);

	const totalCards = useMemo(
		() => deckEntries.reduce((sum, e) => sum + e.quantity, 0),
		[deckEntries],
	);

	const manaCurve = useMemo(() => {
		const curve = new Map<number, number>();
		deckEntries.forEach(({ card, quantity }) => {
			const cost = Number(card.cost ?? 0);
			curve.set(cost, (curve.get(cost) ?? 0) + quantity);
		});
		return Array.from(curve.entries()).sort((a, b) => a[0] - b[0]);
	}, [deckEntries]);

	const typeRepartition = useMemo(
		() => repartitionOf(deckEntries, (c) => c.card_type),
		[deckEntries],
	);
	const rarityRepartition = useMemo(
		() => repartitionOf(deckEntries, (c) => c.rarity ?? "Commune"),
		[deckEntries],
	);

	function addToDeck(card: CardData) {
		setDeck((prev) => {
			const next = new Map(prev);
			const current = next.get(card.id) ?? 0;
			if (current >= MAX_COPIES_PER_CARD || totalCards >= MAX_DECK_SIZE)
				return prev;
			next.set(card.id, current + 1);
			return next;
		});
	}

	function removeFromDeck(cardId: number) {
		setDeck((prev) => {
			const next = new Map(prev);
			next.delete(cardId);
			return next;
		});
	}

	function resetFilters() {
		setSearch("");
		setRaceFilter("");
		setTypeFilter("");
		setCostFilter("");
		setRarityFilter("");
	}

	function toggleSortDirection() {
		setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
	}

	function handleExport() {
		const payload = {
			name: deckName || "Deck sans nom",
			cards: deckEntries.map((e) => ({
				id: e.card.id,
				name: e.card.name,
				quantity: e.quantity,
			})),
		};
		const blob = new Blob([JSON.stringify(payload, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${(deckName || "deck").replace(/\s+/g, "_").toLowerCase()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleImportClick() {
		fileInputRef.current?.click();
	}

	function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const parsed = JSON.parse(String(reader.result));
				const next = new Map<number, number>();
				(parsed.cards ?? []).forEach(
					(entry: { id: number; quantity: number }) => {
						if (cards.some((c) => c.id === entry.id)) {
							next.set(entry.id, Math.min(entry.quantity, MAX_COPIES_PER_CARD));
						}
					},
				);
				setDeck(next);
				if (parsed.name) setDeckName(parsed.name);
			} catch {
				alert("Fichier de deck invalide.");
			}
		};
		reader.readAsText(file);
		e.target.value = "";
	}

	async function handleSave() {
		if (!deckName.trim()) {
			setSaveError("Merci de nommer votre deck.");
			return;
		}
		if (totalCards < MIN_DECK_SIZE) {
			setSaveError(`Le deck doit contenir au moins ${MIN_DECK_SIZE} cartes.`);
			return;
		}

		setSaving(true);
		setSaveError(null);
		try {
			const payload = {
				name: deckName,
				entries: deckEntries.map((e) => ({
					cardId: e.card.id,
					quantity: e.quantity,
				})),
			};

			if (isEditing) {
				await api.put(`/api/decks/${deckId}`, payload);
			} else {
				await api.post("/api/decks", payload);
			}

			navigate("/decks");
		} catch (err) {
			console.error(err);
			setSaveError("Erreur lors de la sauvegarde du deck.");
		} finally {
			setSaving(false);
		}
	}

	function handleBack() {
		navigate("/decks");
	}

	if (loading) {
		return (
			<div className="deckbuilder">
				<header className="deckbuilder-header">
					<button type="button" className="btn btn-ghost" onClick={handleBack}>
						<span aria-hidden="true">←</span> Retour
					</button>
					<h1>Constructeur de Deck</h1>
					<div aria-hidden="true" className="deckbuilder-header-spacer" />
				</header>
				<div className="deckbuilder-loading">Chargement des cartes...</div>
			</div>
		);
	}

	if (fetchError) {
		return (
			<div className="deckbuilder">
				<header className="deckbuilder-header">
					<button type="button" className="btn btn-ghost" onClick={handleBack}>
						<span aria-hidden="true">←</span> Retour
					</button>
					<h1>Constructeur de Deck</h1>
					<div aria-hidden="true" className="deckbuilder-header-spacer" />
				</header>
				<div className="deckbuilder-loading deckbuilder-error">
					{fetchError}
				</div>
			</div>
		);
	}

	return (
		<div className="deckbuilder">
			<header className="deckbuilder-header">
				<button type="button" className="btn btn-ghost" onClick={handleBack}>
					<span aria-hidden="true">←</span> Retour
				</button>
				<h1>{isEditing ? "Modifier le Deck" : "Constructeur de Deck"}</h1>
				<div aria-hidden="true" className="deckbuilder-header-spacer" />
			</header>

			<div className="deckbuilder-body">
				<section className="deckbuilder-catalog">
					<div className="catalog-search">
						<span aria-hidden="true">🔍</span>
						<input
							type="text"
							placeholder="Rechercher une carte..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<section className="all-filters">
						<div className="catalog-filters">
							<select
								value={raceFilter}
								onChange={(e) => setRaceFilter(e.target.value)}
							>
								<option value="">Race</option>
								{races.map((r) => (
									<option key={r} value={r}>
										{r}
									</option>
								))}
							</select>
							<select
								value={typeFilter}
								onChange={(e) => setTypeFilter(e.target.value)}
							>
								<option value="">Type</option>
								{types.map((t) => (
									<option key={t} value={t}>
										{t}
									</option>
								))}
							</select>
							<select
								value={costFilter}
								onChange={(e) => setCostFilter(e.target.value)}
							>
								<option value="">Coût</option>
								{costs.map((c) => (
									<option key={c} value={c}>
										{c}
									</option>
								))}
							</select>
							<select
								value={rarityFilter}
								onChange={(e) => setRarityFilter(e.target.value)}
							>
								<option value="">Rareté</option>
								{rarities.map((r) => (
									<option key={r} value={r}>
										{r}
									</option>
								))}
							</select>
							<button
								type="button"
								className="btn btn-icon"
								onClick={resetFilters}
								title="Réinitialiser les filtres"
							>
								↻
							</button>
						</div>

						<div className="catalog-sort">
							<span>Trier par :</span>
							<select
								value={sortField}
								onChange={(e) => setSortField(e.target.value as SortField)}
							>
								<option value="cost">Coût</option>
								<option value="name">Nom</option>
								<option value="attack">Attaque</option>
								<option value="rarity">Rareté</option>
							</select>
							<button
								type="button"
								className="btn btn-icon"
								onClick={toggleSortDirection}
								title="Inverser l'ordre de tri"
							>
								{sortDirection === "asc" ? "↑↓" : "↓↑"}
							</button>
						</div>
					</section>

					<div className="catalog-grid">
						{filteredCards.map((card) => (
							<button
								type="button"
								key={card.id}
								className="mini-card"
								onClick={() => addToDeck(card)}
								title={`Ajouter ${card.name} au deck`}
							>
								<span className="mini-card-cost">{card.cost ?? "-"}</span>
								<div className="mini-card-art">
									{card.image_path ? (
										<img
											src={`${API_URL}${card.image_path}`}
											alt=""
										/>
									) : (
										<span
											className="mini-card-art-placeholder"
											aria-hidden="true"
										/>
									)}
								</div>
								<div className="mini-card-name">{card.name}</div>
								<div className="mini-card-sub">
									{card.card_type} / {card.race}
								</div>
								<div className="mini-card-stats">
									<span title="Attaque">⚔ {card.attack ?? "-"}</span>
									<span title="Coût">◈ {card.cost ?? "-"}</span>
									<span title="Points de vie">♡ {card.hp ?? "-"}</span>
								</div>
								{deck.has(card.id) && (
									<span className="mini-card-qty">×{deck.get(card.id)}</span>
								)}
							</button>
						))}
						{filteredCards.length === 0 && (
							<p className="catalog-empty">
								Aucune carte ne correspond à ces filtres.
							</p>
						)}
					</div>
				</section>

				<aside className="deckbuilder-sidebar">
					<div className="sidebar-panel">
						<div className="deck-name-row">
							<input
								type="text"
								placeholder="Nom du deck..."
								value={deckName}
								onChange={(e) => setDeckName(e.target.value)}
							/>
							<div className="deck-count">
								<strong>
									{totalCards} / {MAX_DECK_SIZE}
								</strong>
								<span>(min {MIN_DECK_SIZE})</span>
							</div>
						</div>

						<h2>Liste du deck</h2>
						<div className="deck-list">
							{deckEntries.length === 0 && (
								<p className="deck-list-empty">Aucune carte ajoutée.</p>
							)}
							{deckEntries.map((entry) => (
								<div className="deck-list-row" key={entry.card.id}>
									<div className="deck-list-thumb">
										{entry.card.image_path ? (
											<img
												src={`${API_URL}${entry.card.image_path}`}
												alt=""
											/>
										) : (
											<span aria-hidden="true" />
										)}
									</div>
									<span className="deck-list-label">
										{entry.quantity} × {entry.card.name}
									</span>
									<button
										type="button"
										className="btn btn-icon"
										onClick={() => removeFromDeck(entry.card.id)}
										title={`Retirer ${entry.card.name}`}
									>
										🗑
									</button>
								</div>
							))}
						</div>
					</div>

					<div className="sidebar-panel">
						<h2>Statistiques</h2>
						<ul className="stats-list">
							<li>
								<span aria-hidden="true">▤</span> Nombre de cartes :{" "}
								{totalCards} / {MAX_DECK_SIZE} (min {MIN_DECK_SIZE})
							</li>
							<li>
								<button
									type="button"
									onClick={() =>
										setOpenStat(openStat === "mana" ? null : "mana")
									}
								>
									<span aria-hidden="true">📊</span> Courbe de mana
								</button>
								{openStat === "mana" && (
									<div className="stats-breakdown">
										{manaCurve.length === 0 && <span>—</span>}
										{manaCurve.map(([cost, count]) => (
											<div className="stats-bar-row" key={cost}>
												<span>{cost}</span>
												<div
													className="stats-bar"
													style={{ width: `${count * 12}px` }}
												/>
												<span>{count}</span>
											</div>
										))}
									</div>
								)}
							</li>
							<li>
								<button
									type="button"
									onClick={() =>
										setOpenStat(openStat === "types" ? null : "types")
									}
								>
									<span aria-hidden="true">◐</span> Répartition des types
								</button>
								{openStat === "types" && (
									<StatBreakdown data={typeRepartition} />
								)}
							</li>
							<li>
								<button
									type="button"
									onClick={() =>
										setOpenStat(openStat === "rarity" ? null : "rarity")
									}
								>
									<span aria-hidden="true">☆</span> Répartition des raretés
								</button>
								{openStat === "rarity" && (
									<StatBreakdown data={rarityRepartition} />
								)}
							</li>
						</ul>
					</div>

					<div className="sidebar-actions">
						<button
							type="button"
							className="btn btn-outline"
							onClick={handleExport}
						>
							<span aria-hidden="true">⇧</span> Exporter
						</button>
						<button
							type="button"
							className="btn btn-outline"
							onClick={handleImportClick}
						>
							<span aria-hidden="true">⇩</span> Importer
						</button>
						<input
							ref={fileInputRef}
							type="file"
							accept="application/json"
							hidden
							onChange={handleImportFile}
						/>
					</div>

					{saveError && <p className="deckbuilder-save-error">{saveError}</p>}

					<button
						type="button"
						className="btn btn-primary"
						onClick={handleSave}
						disabled={saving}
					>
						<span aria-hidden="true">💾</span>{" "}
						{saving ? "Sauvegarde..." : "Sauvegarder le deck"}
					</button>
				</aside>
			</div>
		</div>
	);
}

function StatBreakdown({ data }: { data: [string, number][] }) {
	if (data.length === 0) return <div className="stats-breakdown">—</div>;
	return (
		<div className="stats-breakdown">
			{data.map(([label, count]) => (
				<div className="stats-bar-row" key={label}>
					<span>{label}</span>
					<div className="stats-bar" style={{ width: `${count * 12}px` }} />
					<span>{count}</span>
				</div>
			))}
		</div>
	);
}

function uniqueSorted(values: string[]): string[] {
	return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function repartitionOf(
	entries: DeckEntry[],
	getKey: (card: CardData) => string,
): [string, number][] {
	const map = new Map<string, number>();
	entries.forEach(({ card, quantity }) => {
		const key = getKey(card);
		map.set(key, (map.get(key) ?? 0) + quantity);
	});
	return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}
