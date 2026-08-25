import { Link } from "react-router-dom";

import { useLanguage } from "../i18n/useLanguage";
import { COMMON } from "../i18n/common";
import { PAGES_CONTENT } from "../i18n/pages";
import "./DeckBuilderMobileNotice.css";

// Le deck builder (grille de cartes + panneau latéral, pensé pour un large
// espace horizontal) n'est pas praticable sur petit écran - affiché à la
// place de /decks, /decks/new, /decks/:deckId sur mobile plutôt que de
// laisser le joueur se débattre avec une mise en page inutilisable.
const DeckBuilderMobileNotice = () => {
	const { language } = useLanguage();
	const t = COMMON[language];
	const playT = PAGES_CONTENT[language].play;

	return (
		<div className="deck-mobile-notice">
			<div className="deck-mobile-notice-panel">
				<h1>{t.deckBuilderMobileTitle}</h1>
				<p>{t.deckBuilderMobileText}</p>
				<Link to="/" className="deck-mobile-notice-back">
					{playT.backHome}
				</Link>
			</div>
		</div>
	);
};

export default DeckBuilderMobileNotice;
