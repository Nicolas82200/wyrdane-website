import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";
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
	const [decks, setDecks] = useState<DeckWithCards[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		api
			.get<DeckWithCards[]>("/api/decks")
			.then((res) => {
				console.log(res.data);
				console.log(Array.isArray(res.data));
				setDecks(res.data);
			})
			.catch((err) => {
				console.error(err);
				setError("Impossible de charger vos decks");
			})
			.finally(() => setLoading(false));
	}, []);

	const totalCards = (deck: DeckWithCards) =>
		deck.cards.reduce((sum, c) => sum + c.quantity, 0);

	async function removeFromDeckList(deckId: number) {
		try {
			await api.delete(`/api/decks/${deckId}`);
			setDecks((prev) => prev.filter((deck) => deck.id !== deckId));
		} catch (err) {
			console.error(err);
			setError("Impossible de supprimer ce deck");
		}
	}

	return (
		<div className="decklist">
			<div className="decklist-panel">
				<h1>Mes Decks</h1>
				<p className="decklist-subtitle">
					Choisis le deck qui t'accompagnera au combat
				</p>

				<hr className="decklist-sep" />

				<div className="decklist-scroll">
					{loading && <p className="decklist-status">Chargement...</p>}
					{!loading && error && (
						<p className="decklist-status error">{error}</p>
					)}
					{!loading && !error && decks.length === 0 && (
						<p className="decklist-status">
							Aucun deck pour l'instant. Crée ton premier deck !
						</p>
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
										{totalCards(deck)} cartes
									</span>
								</button>
								<button
									type="button"
									className="btn btn-icon"
									onClick={() => removeFromDeckList(deck.id)}
									title={`Retirer ${deck.name}`}
								>
									🗑
								</button>
							</div>
						))}
				</div>

				<hr className="decklist-sep" />

				<div className="decklist-buttons">
					<button type="button" className="btn" onClick={() => navigate("/")}>
						← Retour
					</button>
					<button
						type="button"
						className="btn btn-primary"
						onClick={() => navigate("/decks/new")}
					>
						+ Nouveau Deck
					</button>
					<button
						type="button"
						className="btn"
						onClick={() => navigate("/decks/import")}
					>
						Importer
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeckList;
