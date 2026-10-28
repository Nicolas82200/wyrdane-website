import { useRef, useState } from "react";

import { CARD_TYPE_EXAMPLES } from "../data/exampleCards";
import { useLanguage } from "../i18n/useLanguage";
import { useCommon } from "../i18n/common";
import ExplorerPanel from "./ExplorerPanel";
import GameCard from "./GameCard";
import "./CardTypeExplorer.css";

export type CardTypeItem = { id: string; name: string; description: string };

// Section "types de cartes" de la page d'accueil : un seul panneau
// (ExplorerPanel), les types en navbar tout en haut, la description du type
// actif puis la grille de cartes réelles qui l'illustrent en dessous. Voir
// src/data/exampleCards.ts (CARD_TYPE_EXAMPLES) pour la source des cartes.
//
// Les 4 cartes tiennent sur une rangée au-delà de ~1180px de large ; en
// dessous, la rangée devient un carrousel à défilement magnétique (une carte
// par cran) avec deux flèches, au lieu de déborder du cadre et d'être coupée
// par l'overflow-x: hidden global (voir index.css).
const CardTypeExplorer = ({ types }: { types: CardTypeItem[] }) => {
	const { language } = useLanguage();
	const common = useCommon(language);
	const [activeId, setActiveId] = useState(types[0]?.id);
	const trackRef = useRef<HTMLDivElement>(null);
	const activeType = types.find((t) => t.id === activeId) ?? types[0];
	const cards = activeType ? (CARD_TYPE_EXAMPLES[activeType.id] ?? []) : [];

	// Défilement d'une carte : le scroll-snap recale ensuite sur la carte la
	// plus proche, donc un pas approximatif (largeur de carte + gap) suffit.
	const scrollByCard = (direction: 1 | -1) => {
		const track = trackRef.current;
		if (!track) return;
		const card = track.firstElementChild as HTMLElement | null;
		const step = (card?.offsetWidth ?? track.clientWidth) + 20;
		track.scrollBy({ left: direction * step, behavior: "smooth" });
	};

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
					<div className="card-type-carousel">
						{cards.length > 1 && (
							<button
								type="button"
								className="card-type-arrow card-type-arrow-prev"
								aria-label={common.carouselPrev}
								onClick={() => scrollByCard(-1)}
							>
								‹
							</button>
						)}
						<div className="card-type-grid" ref={trackRef}>
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
						{cards.length > 1 && (
							<button
								type="button"
								className="card-type-arrow card-type-arrow-next"
								aria-label={common.carouselNext}
								onClick={() => scrollByCard(1)}
							>
								›
							</button>
						)}
					</div>
				</div>
			)}
		</ExplorerPanel>
	);
};

export default CardTypeExplorer;
