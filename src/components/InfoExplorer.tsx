import { useState } from "react";

import { cardsByEntry } from "../data/cardFilters";
import CardCarousel from "./CardCarousel";
import ExplorerPanel from "./ExplorerPanel";
import "./InfoExplorer.css";

export type InfoItem = { id: string; name: string; description: string };
export type InfoGroup = { key: string; title: string; items: InfoItem[] };

// Panneau réutilisé pour les mots-clés et les triggers de la page d'accueil :
// un seul panneau (ExplorerPanel), les onglets de groupe (race, si plusieurs
// groupes) puis les onglets d'entrée en navbar tout en haut, la définition et
// le carrousel de toutes les cartes qui portent l'entrée en dessous. Voir
// src/data/cardFilters.ts pour la sélection des cartes.
const InfoExplorer = ({ groups }: { groups: InfoGroup[] }) => {
	const hasGroupTabs = groups.length > 1;
	const [activeGroupKey, setActiveGroupKey] = useState(groups[0].key);
	const activeGroup = groups.find((g) => g.key === activeGroupKey) ?? groups[0];
	const [activeId, setActiveId] = useState<string | undefined>(activeGroup.items[0]?.id);
	// Retombe sur le premier item de l'onglet actif tant que activeId ne lui
	// appartient pas encore (ex. juste après un changement d'onglet de race).
	const activeItem = activeGroup.items.find((i) => i.id === activeId) ?? activeGroup.items[0];
	const cards = activeItem ? cardsByEntry(activeItem.id) : [];

	const selectGroup = (key: string) => {
		setActiveGroupKey(key);
		const group = groups.find((g) => g.key === key);
		setActiveId(group?.items[0]?.id);
	};

	const groupTabs = groups.map((group) => (
		<button
			type="button"
			key={group.key}
			className={`explorer-panel-tab ${group.key === activeGroupKey ? "active" : ""}`}
			onClick={() => selectGroup(group.key)}
		>
			{group.title}
		</button>
	));

	const itemTabs = activeGroup.items.map((item) => (
		<button
			type="button"
			key={item.id}
			className={`explorer-panel-tab ${item.id === activeItem?.id ? "active" : ""}`}
			onClick={() => setActiveId(item.id)}
		>
			{item.name}
		</button>
	));

	return (
		<ExplorerPanel navRows={hasGroupTabs ? [groupTabs, itemTabs] : [itemTabs]}>
			{activeItem && (
				// La clé force un remontage à chaque sélection, ce qui relance les
				// animations d'apparition en cascade ci-dessous (CSS pur, voir
				// InfoExplorer.css) : sans ça, les keyframes ne jouent qu'au tout
				// premier rendu du composant, jamais aux sélections suivantes.
				<div className="info-explorer-detail" key={activeItem.id}>
					<h3 className="info-explorer-fade-in info-explorer-stage-1">{activeItem.name}</h3>
					<p className="info-explorer-description info-explorer-fade-in info-explorer-stage-2">
						{activeItem.description}
					</p>
					<div className="info-explorer-example info-explorer-fade-in info-explorer-stage-3">
						<CardCarousel cards={cards} />
					</div>
				</div>
			)}
		</ExplorerPanel>
	);
};

export default InfoExplorer;
