import { useState } from "react";

import { useLanguage } from "../i18n/useLanguage";
import { EXAMPLE_CARDS } from "../data/exampleCards";
import GameCard from "./GameCard";
import "./InfoExplorer.css";

export type InfoItem = { id: string; name: string; description: string };
export type InfoGroup = { key: string; title: string; items: InfoItem[] };

// Panneau à deux volets réutilisé pour les types de carte, les mots-clés et
// les triggers de la page d'accueil : liste des entrées à gauche (1/3),
// détail (définition + carte d'exemple réelle + démonstration) à droite (2/3).
// Voir src/data/exampleCards.ts pour la source des cartes d'exemple.
const InfoExplorer = ({ groups }: { groups: InfoGroup[] }) => {
	const { language } = useLanguage();
	const hasTabs = groups.length > 1;
	const [activeGroupKey, setActiveGroupKey] = useState(groups[0].key);
	const activeGroup = groups.find((g) => g.key === activeGroupKey) ?? groups[0];
	const [activeId, setActiveId] = useState(activeGroup.items[0]?.id);
	// Retombe sur le premier item de l'onglet actif tant que activeId ne lui
	// appartient pas encore (ex. juste après un changement d'onglet de race).
	const activeItem = activeGroup.items.find((i) => i.id === activeId) ?? activeGroup.items[0];
	const example = activeItem ? EXAMPLE_CARDS[activeItem.id] : undefined;

	return (
		<div className="info-explorer">
			{hasTabs && (
				<div className="info-explorer-tabs">
					{groups.map((group) => (
						<button
							type="button"
							key={group.key}
							className={`info-explorer-tab ${group.key === activeGroupKey ? "active" : ""}`}
							onClick={() => setActiveGroupKey(group.key)}
						>
							{group.title}
						</button>
					))}
				</div>
			)}
			<div className="info-explorer-body">
				<div className="info-explorer-list">
					{activeGroup.items.map((item) => (
						<button
							type="button"
							key={item.id}
							className={`info-explorer-item ${item.id === activeItem?.id ? "active" : ""}`}
							onClick={() => setActiveId(item.id)}
						>
							{item.name}
						</button>
					))}
				</div>
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
			</div>
		</div>
	);
};

export default InfoExplorer;
