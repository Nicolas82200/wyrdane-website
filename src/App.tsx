import { Outlet } from "react-router-dom";
import "./App.css";
import mainMenu from "./assets/mainMemu.mp4";
function App() {
	return (
		<div className="app">
			<video className="background-video" autoPlay loop muted playsInline>
				<source src={mainMenu} type="video/mp4" />
			</video>

			<main className="page-content">
				<Outlet />
			</main>
		</div>
	);
}

export default App;
