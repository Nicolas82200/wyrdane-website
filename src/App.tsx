import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import mainMenu from "./assets/mainMemu.mp4";
import mobileBackground from "./assets/site/menu-bg-mobile.jpg";
import FirstLoginRewardPopup from "./components/FirstLoginRewardPopup";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import SiteFooter from "./components/SiteFooter";
import { useIsMobile } from "./hooks/useIsMobile";
import { usePageviewTracking } from "./hooks/usePageviewTracking";
function App() {
	const isMobile = useIsMobile();
	usePageviewTracking();
	// Le deck builder (/decks/new, /decks/:deckId) est une mise en page fixe
	// plein écran (100vh, son propre défilement interne pour la grille/la
	// sidebar) — ni le footer ni la navbar n'y ont leur place (retour
	// joueur explicite pour la navbar : gardée sur /decks, la liste des
	// decks, mais pas dans l'éditeur). DeckBuilder.css suppose maintenant
	// qu'aucune navbar n'occupe de hauteur au-dessus de lui sur ces routes.
	const { pathname } = useLocation();
	const isDeckBuilder = /^\/decks\/(new|\d+)$/.test(pathname);

	return (
		<div className="app">
			{isMobile ? (
				<img className="background-image" src={mobileBackground} alt="" />
			) : (
				<video className="background-video" autoPlay loop muted playsInline>
					<source src={mainMenu} type="video/mp4" />
				</video>
			)}
			<div className="background-overlay" />

			<ScrollToTop />
			{!isDeckBuilder && <Navbar />}
			<FirstLoginRewardPopup />

			<main className="page-content">
				<Outlet />
			</main>

			{!isDeckBuilder && <SiteFooter />}
		</div>
	);
}

export default App;
