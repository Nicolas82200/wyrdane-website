import { Outlet } from "react-router-dom";
import "./App.css";
import mainMenu from "./assets/mainMemu.mp4";
import Navbar from "./components/Navbar";
function App() {
	return (
		<div className="app">
			<video className="background-video" autoPlay loop muted playsInline>
				<source src={mainMenu} type="video/mp4" />
			</video>
			<div className="background-overlay" />

			<Navbar />

			<main className="page-content">
				<Outlet />
			</main>
		</div>
	);
}

export default App;
