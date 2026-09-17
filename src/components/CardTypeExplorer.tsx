import { useState } from "react";

import { CARD_TYPE_EXAMPLES } from "../data/exampleCards";
import ExplorerPanel from "./ExplorerPanel";
import GameCard from "./GameCard";
import "./CardTypeExplorer.css";

export type CardTypeItem = { id: string; name: string; description: string };

// Section "types de cartes" de la page d'accueil : un seul panneau
// (ExplorerPanel), les types en navbar tout en haut, la description du type
// actif puis la grille de cartes réelles qui l'illustrent en dessous. Voir
// src/data/exampleCards.ts (CARD_TYPE_EXAMPLES) pour la source des cartes.
const CardTypeExplorer = ({ types }: { types: CardTypeItem[] }) => {
	const [activeId, setActiveId] = useState(types[0]?.id);
	const activeType = types.find((t) => t.id === activeId) ?? types[0];
	const cards = activeType ? (CARD_TYPE_EXAMPLES[activeType.id] ?? []) : [];

	const typeTabs = types.map((type) => (
		<button
			type="button"
			key={type.id}
			className={`explorer-panel-tab ${type.id === activeType?.id ? "active" : ""}`}
			onClick={() => setActiveId(type.id)}
		>
			{type.name}
		</button>
	));

	return (
		<ExplorerPanel navRows={[typeTabs]}>
			{activeType && (
				<div className="card-type-content" key={activeType.id}>
					<p className="card-type-description">{activeType.description}</p>
					<div className="card-type-grid">
						{cards.map((card, index) => (
							<div
								className="card-type-grid-item"
								key={card.name}
								style={{ animationDelay: `${index * 0.08}s` }}
							>
								<GameCard card={card} />
							</div>
						))}
					</div>
				</div>
			)}
		</ExplorerPanel>
	);
};

export default CardTypeExplorer;
