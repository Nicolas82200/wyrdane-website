import { useState } from "react";

import { useLanguage } from "../i18n/useLanguage";
import { EXAMPLE_CARDS } from "../data/exampleCards";
import ExplorerPanel from "./ExplorerPanel";
import GameCard from "./GameCard";
import "./InfoExplorer.css";

export type InfoItem = { id: string; name: string; description: string };
export type InfoGroup = { key: string; title: string; items: InfoItem[] };

// Panneau réutilisé pour les mots-clés et les triggers de la page d'accueil :
// un seul panneau (ExplorerPanel), les onglets de groupe (race, si plusieurs
// groupes) puis les onglets d'entrée en navbar tout en haut, la carte de
// détail (définition + carte d'exemple réelle) en dessous. Voir
// src/data/exampleCards.ts pour la source des cartes d'exemple.
const InfoExplorer = ({ groups }: { groups: InfoGroup[] }) => {
	const { language } = useLanguage();
	const hasGroupTabs = groups.length > 1;
	const [activeGroupKey, setActiveGroupKey] = useState(groups[0].key);
	const activeGroup = groups.find((g) => g.key === activeGroupKey) ?? groups[0];
	const [activeId, setActiveId] = useState<string | undefined>(activeGroup.items[0]?.id);
	// Retombe sur le premier item de l'onglet actif tant que activeId ne lui
	// appartient pas encore (ex. juste après un changement d'onglet de race).
	const activeItem = activeGroup.items.find((i) => i.id === activeId) ?? activeGroup.items[0];
	const example = activeItem ? EXAMPLE_CARDS[activeItem.id] : undefined;

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
					{example && (
						<div className="info-explorer-example">
							<div className="info-explorer-card-wrap info-explorer-fade-in info-explorer-stage-3">
								<GameCard card={example.card} />
							</div>
							<p className="info-explorer-demo info-explorer-fade-in info-explorer-stage-4">
								{example.demo[language]}
							</p>
						</div>
					)}
				</div>
			)}
		</ExplorerPanel>
	);
};

export default InfoExplorer;
