import type { CSSProperties } from "react";

import boardImage from "../assets/site/board.jpg";
import { useLanguage } from "../i18n/useLanguage";
import { BOARD_CONTENT } from "../i18n/board";
import "./BoardDiagram.css";

type ZonePosition = {
	key: string;
	side: "enemy" | "player";
	style: CSSProperties;
};

const ZONES: ZonePosition[] = [
	{ key: "enemy-hero", side: "enemy", style: { left: "46.52%", top: "0%", width: "6.96%", height: "15.44%" } },
	{
		key: "enemy-back",
		side: "enemy",
		style: { left: "19.06%", top: "22.75%", width: "61.88%", height: "12.39%" },
	},
	{
		key: "enemy-front",
		side: "enemy",
		style: { left: "19.06%", top: "36.79%", width: "61.88%", height: "12.38%" },
	},
	{
		key: "enemy-enchantment",
		side: "enemy",
		style: { left: "1.01%", top: "22.75%", width: "17.02%", height: "12.8%" },
	},
	{
		key: "enemy-ritual",
		side: "enemy",
		style: { left: "1.01%", top: "36.38%", width: "17.02%", height: "12.79%" },
	},
	{
		key: "enemy-graveyard",
		side: "enemy",
		style: { left: "84.4%", top: "22.44%", width: "12.18%", height: "13.01%" },
	},
	{
		key: "enemy-deck",
		side: "enemy",
		style: { left: "84.4%", top: "36.48%", width: "12.18%", height: "13.0%" },
	},
	{
		key: "player-front",
		side: "player",
		style: { left: "19.06%", top: "50.83%", width: "61.88%", height: "12.38%" },
	},
	{
		key: "player-back",
		side: "player",
		style: { left: "19.06%", top: "64.86%", width: "61.88%", height: "12.39%" },
	},
	{
		key: "player-hero",
		side: "player",
		style: { left: "46.52%", top: "84.56%", width: "6.96%", height: "15.44%" },
	},
	{
		key: "player-deck",
		side: "player",
		style: { left: "3.42%", top: "50.5%", width: "12.19%", height: "13.01%" },
	},
	{
		key: "player-graveyard",
		side: "player",
		style: { left: "3.42%", top: "64.55%", width: "12.19%", height: "13.0%" },
	},
	{
		key: "player-ritual",
		side: "player",
		style: { left: "81.97%", top: "50.83%", width: "17.03%", height: "12.79%" },
	},
	{
		key: "player-enchantment",
		side: "player",
		style: { left: "81.97%", top: "64.44%", width: "17.03%", height: "12.81%" },
	},
];

const BoardDiagram = () => {
	const { language } = useLanguage();
	const content = BOARD_CONTENT[language];

	return (
		<div className="board-diagram" style={{ backgroundImage: `url(${boardImage})` }}>
			{ZONES.map((zone) => {
				const zoneText = content.zones[zone.key];
				return (
					<div
						key={zone.key}
						className={`board-zone zone-${zone.side}`}
						style={zone.style}
						tabIndex={0}
						role="button"
						aria-label={`${zoneText.label} : ${zoneText.text}`}
					>
						<div className={`board-tooltip v-${zone.side === "enemy" ? "below" : "above"}`}>
							<strong>{zoneText.label}</strong>
							<p>{zoneText.text}</p>
						</div>
					</div>
				);
			})}

			<div className="board-legend">
				<span className="legend-item legend-enemy">{content.legendEnemy}</span>
				<span className="legend-item legend-player">{content.legendPlayer}</span>
			</div>
		</div>
	);
};

export default BoardDiagram;
