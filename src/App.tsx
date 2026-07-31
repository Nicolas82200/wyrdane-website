import { Outlet } from "react-router-dom";
import "./App.css";
import mainMenu from "./assets/mainMemu.mp4";
import mobileBackground from "./assets/site/menu-bg-mobile.jpg";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import SiteFooter from "./components/SiteFooter";
import { useIsMobile } from "./hooks/useIsMobile";
function App() {
	const isMobile = useIsMobile();

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

			<SiteFooter />
		</div>
	);
}

export default App;
