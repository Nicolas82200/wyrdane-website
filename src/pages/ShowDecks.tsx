import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";
import { useLanguage } from "../i18n/useLanguage";
import { DECKBUILDER_CONTENT } from "../i18n/deckbuilder";
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

const DeckList = () => {
	const navigate = useNavigate();
	const { language } = useLanguage();
	const t = DECKBUILDER_CONTENT[language];
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

					{!loading &&
						!error &&
						decks.map((deck) => (
							<div className="deck" key={deck.id}>
								<button
									type="button"
									key={deck.id}
									className="deck-item"
									onClick={() => navigate(`/decks/${deck.id}`)}
								>
									<span className="deck-item-name">{deck.name}</span>
									<span className="deck-item-count">
										{t.cardsCount.replace("{n}", String(totalCards(deck)))}
									</span>
								</button>
								<button
									type="button"
									className="btn btn-icon"
									onClick={() => removeFromDeckList(deck.id)}
									title={t.removeDeckTitle.replace("{name}", deck.name)}
								>
									🗑
								</button>
							</div>
						))}
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
						onClick={() => navigate("/decks/import")}
					>
						{t.importBtn}
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeckList;
