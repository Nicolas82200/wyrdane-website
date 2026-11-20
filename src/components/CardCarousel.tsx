import { useMemo } from "react";

import type { CardData } from "../types";
import GameCard from "./GameCard";
import "./CardCarousel.css";

// Carrousel de présentation : toutes les cartes concernées par l'entrée
// affichée (type, mot-clé, déclencheur) défilent en boucle sans fin, en noir
// et blanc, et reprennent leurs couleurs au survol. Le défilement se met en
// pause tant qu'une carte est survolée, sinon la carte colorée s'échappe du
// curseur avant d'être lisible.
//
// Boucle sans couture : la piste contient deux fois la même liste et glisse de
// -50%, ce qui la ramène pile sur le début de la seconde copie. L'écart entre
// les cartes est donc un `margin-right` et non un `gap` : avec un `gap`, les
// deux moitiés ne font pas exactement la même largeur (une gouttière de moins)
// et la boucle saute d'un demi-écart à chaque tour.
const MIN_ITEMS = 5; // 4 cartes visibles : en dessous, la piste laisse un trou
// Plafond volontaire : la piste est rendue en double, et GameCard mesure son
// texte en deux passes de layout par carte au montage. Sans plafond, l'onglet
// "Serviteur" (156 cartes) monte 312 cartes d'un coup et bloque le thread
// principal — pour une boucle de 10 minutes que personne ne regarde en entier.
// 24 couvre entièrement 28 des 30 mots-clés et 9 des 10 déclencheurs.
const MAX_ITEMS = 24;
const SECONDS_PER_CARD = 4;

const CardCarousel = ({ cards }: { cards: CardData[] }) => {
	const loop = useMemo(() => {
		if (cards.length === 0) return [];
		const items = cards.slice(0, MAX_ITEMS);
		while (items.length < MIN_ITEMS) items.push(...cards.slice(0, MAX_ITEMS));
		return items;
	}, [cards]);

	if (loop.length === 0) return null;

	return (
		<div className="card-carousel">
			<div
				className="card-carousel-track"
				style={{ animationDuration: `${loop.length * SECONDS_PER_CARD}s` }}
			>
				{[...loop, ...loop].map((card, index) => (
					<div className="card-carousel-item" key={`${card.name}-${index}`} aria-hidden={index >= loop.length}>
						<GameCard card={card} />
					</div>
				))}
			</div>
		</div>
	);
};

export default CardCarousel;
