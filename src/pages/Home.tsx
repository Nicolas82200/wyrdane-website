import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";
import AuthPanel from "../components/AuthPanel";
import "./Home.css";

type View = "home" | "auth";
type Phase = "idle" | "out" | "in";

const Home = () => {
	const navigate = useNavigate();
	const [authenticated, setAuthenticated] = useState<boolean | null>(null);
	const [view, setView] = useState<View>("home");
	const [pendingView, setPendingView] = useState<View | null>(null);
	const [phase, setPhase] = useState<Phase>("idle");

	useEffect(() => {
		api
			.get("/api/auth/authVerif")
			.then(() => {
				setAuthenticated(true);
				// Idempotent côté backend : ne fait rien si déjà réclamé.
				// Sans ce site, seul le tutoriel du jeu Godot déclenchait ce grant,
				// donc un joueur inscrit uniquement via le site n'avait ni cartes
				// ni decks de départ.
				api.post("/api/collection/claim-starter").catch((err) => {
					console.error(err);
				});
			})
			.catch(() => setAuthenticated(false));
	}, []);

	const handleLogout = async () => {
		try {
			await api.get("/api/auth/logout");
			setAuthenticated(false);
		} catch (err) {
			console.error(err);
		}
	};

	const goTo = (next: View) => {
		if (phase !== "idle" || next === view) return;
		setPendingView(next);
		setPhase("out");
	};

	const handleAnimationEnd = () => {
		if (phase === "out" && pendingView) {
			setView(pendingView);
			setPendingView(null);
			setPhase("in");
		} else if (phase === "in") {
			setPhase("idle");
		}
	};

	const handleDecksClick = () => {
		if (authenticated) {
			navigate("/decks");
		} else {
			goTo("auth");
		}
	};

	return (
		<div className="home">
			<div
				className={`home-stage ${phase !== "idle" ? `anim-${phase}` : ""}`}
				onAnimationEnd={handleAnimationEnd}
			>
				{view === "home" && (
					<div className="home-view">
						<h1>WYRDANE DECK BUILDER</h1>
						<p>Crée vos decks</p>
						<nav className="home-nav">
							<button
								type="button"
								className="btn btn-primary"
								onClick={handleDecksClick}
							>
								Voir vos decks
							</button>
							{authenticated && (
								<button type="button" className="btn" onClick={handleLogout}>
									Deconnexion
								</button>
							)}
						</nav>
					</div>
				)}

				{view === "auth" && <AuthPanel onCancel={() => goTo("home")} />}
			</div>
		</div>
	);
};

export default Home;
