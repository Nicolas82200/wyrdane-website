import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";
import "./Admin.css";

type CardStat = {
	card_name: string;
	play_rate: number;
	matches_played: number;
	winrate: number;
};

type CardStatsResponse = {
	total_ranked_matches: number;
	cards: CardStat[];
};

const AdminCardStats = () => {
	const navigate = useNavigate();
	const [data, setData] = useState<CardStatsResponse | null>(null);
	const [error, setError] = useState("");

	useEffect(() => {
		api
			.get<CardStatsResponse>("/api/admin/card-stats")
			.then((res) => setData(res.data))
			.catch((err) => {
				console.error(err);
				setError("Impossible de charger les statistiques de cartes.");
			});
	}, []);

	return (
		<div className="admin">
			<div className="admin-panel">
				<h1>Statistiques des cartes</h1>

				<hr className="admin-sep" />

				{error && <p className="admin-status error">{error}</p>}
				{!data && !error && <p className="admin-status">Chargement...</p>}

				{data && (
					<>
						<p className="admin-status">
							{data.total_ranked_matches} match{data.total_ranked_matches > 1 ? "s" : ""} classé
							{data.total_ranked_matches > 1 ? "s" : ""} cette saison — pas de seuil minimum ici,
							juger le winrate d'une carte à la lumière de son nombre de parties.
						</p>
						{data.cards.length === 0 ? (
							<p className="admin-status">Aucune carte jouée en classé pour l'instant.</p>
						) : (
							<table className="admin-table">
								<thead>
									<tr>
										<th>Carte</th>
										<th>Parties</th>
										<th>Taux de jeu</th>
										<th>Winrate</th>
									</tr>
								</thead>
								<tbody>
									{data.cards.map((card) => (
										<tr key={card.card_name}>
											<td>{card.card_name}</td>
											<td>{card.matches_played}</td>
											<td>{(card.play_rate * 100).toFixed(1)}%</td>
											<td>{(card.winrate * 100).toFixed(1)}%</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</>
				)}

				<hr className="admin-sep" />

				<button type="button" className="btn" onClick={() => navigate("/admin")}>
					← Retour
				</button>
			</div>
		</div>
	);
};

export default AdminCardStats;
