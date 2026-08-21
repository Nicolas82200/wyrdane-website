import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import mainMenu from "./assets/mainMemu.mp4";
import mobileBackground from "./assets/site/menu-bg-mobile.jpg";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import SiteFooter from "./components/SiteFooter";
import { useIsMobile } from "./hooks/useIsMobile";
function App() {
	const isMobile = useIsMobile();
	// Le deck builder (/decks/new, /decks/:deckId) est une mise en page fixe
	// plein écran (100vh, son propre défilement interne pour la grille/la
	// sidebar) — le footer n'y a jamais sa place, il faudrait défiler pour
	// l'atteindre en dessous d'un écran déjà plein.
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
			<Navbar />

			<main className="page-content">
				<Outlet />
			</main>

			{!isDeckBuilder && <SiteFooter />}
		</div>
	);
}

export default App;
