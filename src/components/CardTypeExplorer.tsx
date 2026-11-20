import { useState } from "react";

import { cardsByType } from "../data/cardFilters";
import CardCarousel from "./CardCarousel";
import ExplorerPanel from "./ExplorerPanel";
import "./CardTypeExplorer.css";

export type CardTypeItem = { id: string; name: string; description: string };

// Section "types de cartes" de la page d'accueil : un seul panneau
// (ExplorerPanel), les types en navbar tout en haut, la description du type
// actif puis le carrousel de toutes les cartes de ce type en dessous (voir
// src/data/cardFilters.ts pour la sélection et CardCarousel pour la boucle).
const CardTypeExplorer = ({ types }: { types: CardTypeItem[] }) => {
	const [activeId, setActiveId] = useState(types[0]?.id);
	const activeType = types.find((t) => t.id === activeId) ?? types[0];
	const cards = activeType ? cardsByType(activeType.id) : [];

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
					<CardCarousel cards={cards} />
				</div>
			)}
		</ExplorerPanel>
	);
};

export default CardTypeExplorer;
