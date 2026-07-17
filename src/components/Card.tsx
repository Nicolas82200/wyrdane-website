import { API_URL } from "../api";
import type { CardData } from "../types";
import "./Card.css";

type CardProps = {
	card: CardData;
};

export default function Card({ card }: CardProps) {
	return (
		<div className="card-frame">
			<div className="card-inner">
				{card.image_path ? (
					<img
						className="card-art"
						src={`${API_URL}${card.image_path}`}
						alt={`Illustration de la carte ${card.name}`}
					/>
				) : (
					<div className="card-art card-art--empty" aria-hidden="true" />
				)}

				{card.lane && (
					<div
						className="card-lane-icon"
						data-lane={card.lane}
						aria-hidden="true"
					/>
				)}

				<div className="card-cost-badge">{card.cost ?? "-"}</div>

				<div className="card-name-label">
					<h2>{card.name}</h2>
				</div>

				<div className="card-desc-label">
					<p>{card.effect || card.flavor || "Aucun effet."}</p>
				</div>

				<div className="card-type-label">
					{card.rarity ?? "Commune"} · {card.race} · {card.card_type}
				</div>

				<div className="card-attack-badge">{card.attack ?? "-"}</div>
				<div className="card-health-badge">{card.hp ?? "-"}</div>

				{/* <img
					className="card-border-frame"
					src="/assets/borders/demon-border-card.png"
					alt=""
					aria-hidden="true"
				/> */}
			</div>
		</div>
	);
}
