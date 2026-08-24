import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";
import "./Admin.css";

type Stats = {
	totalVisits: number;
	uniqueVisitors: number;
	siteLogins: number;
	gameLogins: number;
	uniqueLoginUsers: number;
	wishlistCount: number;
};

const Admin = () => {
	const navigate = useNavigate();
	const [stats, setStats] = useState<Stats | null>(null);
	const [error, setError] = useState("");
	const [wishlistInput, setWishlistInput] = useState("");
	const [savingWishlist, setSavingWishlist] = useState(false);

	function load() {
		api
			.get<Stats>("/api/admin/stats")
			.then((res) => {
				setStats(res.data);
				setWishlistInput(String(res.data.wishlistCount));
			})
			.catch((err) => {
				console.error(err);
				setError("Impossible de charger les statistiques.");
			});
	}

	useEffect(load, []);

	async function saveWishlist() {
		const count = Number(wishlistInput);
		if (!Number.isFinite(count) || count < 0) return;
		setSavingWishlist(true);
		try {
			await api.put("/api/admin/wishlist", { count });
			load();
		} catch (err) {
			console.error(err);
			setError("Impossible de mettre à jour le nombre de wishlists.");
		} finally {
			setSavingWishlist(false);
		}
	}

	return (
		<div className="admin">
			<div className="admin-panel">
				<h1>Tableau de bord</h1>

				<hr className="admin-sep" />

				{error && <p className="admin-status error">{error}</p>}
				{!stats && !error && <p className="admin-status">Chargement...</p>}

				{stats && (
					<div className="admin-grid">
						<div className="admin-card">
							<span className="admin-card-value">{stats.totalVisits}</span>
							<span className="admin-card-label">Visites totales du site</span>
						</div>
						<div className="admin-card">
							<span className="admin-card-value">{stats.uniqueVisitors}</span>
							<span className="admin-card-label">Visiteurs uniques (approx.)</span>
						</div>
						<div className="admin-card">
							<span className="admin-card-value">{stats.siteLogins}</span>
							<span className="admin-card-label">Connexions Steam depuis le site</span>
						</div>
						<div className="admin-card">
							<span className="admin-card-value">{stats.gameLogins}</span>
							<span className="admin-card-label">Connexions Steam depuis le jeu</span>
						</div>
						<div className="admin-card">
							<span className="admin-card-value">{stats.uniqueLoginUsers}</span>
							<span className="admin-card-label">Joueurs distincts connectés</span>
						</div>
						<div className="admin-card admin-card-editable">
							<span className="admin-card-value">{stats.wishlistCount}</span>
							<span className="admin-card-label">Wishlists Steam</span>
							<div className="admin-wishlist-edit">
								<input
									type="number"
									min={0}
									value={wishlistInput}
									onChange={(e) => setWishlistInput(e.target.value)}
								/>
								<button type="button" className="btn" onClick={saveWishlist} disabled={savingWishlist}>
									{savingWishlist ? "..." : "Mettre à jour"}
								</button>
							</div>
						</div>
					</div>
				)}

				<p className="admin-note">
					La wishlist Steam n'a pas d'API publique fiable (visible uniquement dans le dashboard
					Steamworks partenaire) : reporte le chiffre ici manuellement.
				</p>

				<hr className="admin-sep" />

				<button type="button" className="btn" onClick={() => navigate("/")}>
					← Retour
				</button>
			</div>
		</div>
	);
};

export default Admin;
