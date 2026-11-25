import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api, { API_URL } from "../api";
import { useLanguage } from "../i18n/useLanguage";
import { DECKBUILDER_CONTENT } from "../i18n/deckbuilder";
import { translateCardText } from "../i18n/cardText";
import { usePageTitle } from "../hooks/usePageTitle";
import "./ShowDecks.css";

type DeckCard = {
	deck_id: number;
	card_id: number;
	quantity: number;
	name: string;
	race: string;
	card_type: string;
	lane: string | null;
	cost: number;
	attack: number | null;
	hp: number | null;
	rarity: string;
	charges: number | null;
	effect: string | null;
	flavor: string | null;
	image_path: string;
};

type DeckWithCards = {
	id: number;
	user_id: number;
	name: string;
	created_at: string;
	cards: DeckCard[];
};

// DeckList.gd RACE_ACCENTS / NEUTRAL_ACCENT : couleur du liseré de la tuile,
// prise sur la race dominante du deck — repère visuel immédiat dans la grille.
// Clés = valeurs FR de la BDD (comme partout ailleurs sur le site).
const RACE_ACCENTS: Record<string, string> = {
	"Mort-Vivant": "rgb(89, 158, 82)",
	Humain: "rgb(217, 173, 77)",
	Demon: "rgb(199, 56, 64)",
	Elfe: "rgb(77, 166, 140)",
	Nain: "rgb(158, 107, 61)",
	Abomination: "rgb(140, 89, 184)",
};
const NEUTRAL_ACCENT = "rgb(102, 89, 64)";

// DeckList.gd MAX_BANNER_IMAGES, et MIN_TOTAL_CARDS côté DeckManager
// (MIN_PLAYABLE_CARDS 40 + MIN_RESOURCE_CARDS 10).
const MAX_BANNER_IMAGES = 3;
const MIN_TOTAL_CARDS = 50;

// DeckList._dominant_race_color : la race la plus représentée du deck, chaque
// EXEMPLAIRE compté (le jeu itère deck.get_cards(), pas les cartes distinctes).
function dominantRaceAccent(deck: DeckWithCards): string {
	const counts = new Map<string, number>();
	for (const c of deck.cards) {
		counts.set(c.race, (counts.get(c.race) ?? 0) + c.quantity);
	}
	let best = "";
	let bestCount = 0;
	for (const [race, n] of counts) {
		if (n > bestCount) {
			best = race;
			bestCount = n;
		}
	}
	return RACE_ACCENTS[best] ?? NEUTRAL_ACCENT;
}

// DeckList._resource_textures : les illustrations des cartes-ressource du deck,
// une par race, dans l'ordre de première apparition. Pas d'équivalent de
// DeckData.art_path ici — l'illustration choisie à la main vit dans un
// `user://deck_art.cfg` local au jeu, jamais envoyé au backend.
function bannerArts(deck: DeckWithCards): string[] {
	const out: string[] = [];
	for (const c of deck.cards) {
		if (c.card_type !== "Ressource" || !c.image_path) continue;
		if (out.includes(c.image_path)) continue;
		out.push(c.image_path);
		if (out.length >= MAX_BANNER_IMAGES) break;
	}
	return out;
}

const DeckList = () => {
	const navigate = useNavigate();
	const { language } = useLanguage();
	const t = DECKBUILDER_CONTENT[language];
	usePageTitle(t.decksTitle);
	const [decks, setDecks] = useState<DeckWithCards[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		api
			.get<DeckWithCards[]>("/api/decks")
			.then((res) => {
				setDecks(res.data);
			})
			.catch((err) => {
				console.error(err);
				setError(t.loadDecksError);
			})
			.finally(() => setLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const totalCards = (deck: DeckWithCards) =>
		deck.cards.reduce((sum, c) => sum + c.quantity, 0);

	async function removeFromDeckList(deckId: number) {
		try {
			await api.delete(`/api/decks/${deckId}`);
			setDecks((prev) => prev.filter((deck) => deck.id !== deckId));
		} catch (err) {
			console.error(err);
			setError(t.deleteDeckError);
		}
	}

	return (
		<div className="decklist">
			<div className="decklist-panel">
				<h1>{t.decksTitle}</h1>
				<p className="decklist-subtitle">{t.decksSubtitle}</p>

				<hr className="decklist-sep" />

				<div className="decklist-scroll">
					{loading && <p className="decklist-status">{t.loading}</p>}
					{!loading && error && (
						<p className="decklist-status error">{error}</p>
					)}
					{!loading && !error && decks.length === 0 && (
						<p className="decklist-status">{t.emptyState}</p>
					)}

					{!loading && !error && decks.length > 0 && (
						<div className="decklist-grid">
							{decks.map((deck) => {
								const accent = dominantRaceAccent(deck);
								const arts = bannerArts(deck);
								const total = totalCards(deck);
								const deckName = translateCardText(deck.name, language);
								return (
									<div
										className="deck-tile"
										key={deck.id}
										style={{ borderColor: accent }}
										onClick={() => navigate(`/decks/${deck.id}`)}
									>
										<div className="deck-tile-banner">
											{arts.length === 0 ? (
												// Deck sans carte-ressource (incomplet) : aplat de la race
												// dominante, assombri comme le .darkened(0.4) du jeu.
												<span
													className="deck-tile-banner-flat"
													style={{ background: accent }}
												/>
											) : (
												arts.map((art) => (
													<img key={art} src={`${API_URL}${art}`} alt="" draggable={false} />
												))
											)}
										</div>

										<div className="deck-tile-head">
											<span className="deck-tile-name">{deckName}</span>
											<span
												className={`deck-tile-count${total >= MIN_TOTAL_CARDS ? " ok" : " ko"}`}
											>
												{total}/{MIN_TOTAL_CARDS}
											</span>
										</div>

										<div className="deck-tile-actions">
											<button
												type="button"
												className="deck-tile-btn"
												onClick={(e) => {
													e.stopPropagation();
													navigate(`/decks/${deck.id}`);
												}}
											>
												{t.editDeck}
											</button>
											<button
												type="button"
												className="deck-tile-del"
												onClick={(e) => {
													e.stopPropagation();
													removeFromDeckList(deck.id);
												}}
												title={t.removeDeckTitle.replace("{name}", deckName)}
											>
												✕
											</button>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>

				<hr className="decklist-sep" />

				<div className="decklist-buttons">
					<button type="button" className="btn" onClick={() => navigate("/")}>
						{t.back}
					</button>
					<button
						type="button"
						className="btn btn-primary"
						onClick={() => navigate("/decks/new")}
					>
						{t.newDeck}
					</button>
					<button
						type="button"
						className="btn"
						// /decks/import n'est pas une route : elle matchait par erreur
						// /decks/:deckId avec deckId="import" et plantait au chargement.
						// Le deck builder a déjà sa propre boîte d'import (DeckBuilder.tsx,
						// state importOpen) - on l'ouvre directement en arrivant via un
						// state de navigation plutôt que d'inventer une route dédiée.
						onClick={() => navigate("/decks/new", { state: { openImport: true } })}
					>
						{t.importBtn}
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeckList;
