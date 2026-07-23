import { API_URL } from "../api";
import type { CardData } from "../types";
import "./GameCard.css";

import undeadBorder from "../assets/game/borders/undead-border-card.png";
import humanBorder from "../assets/game/borders/human-border-card.png";
import demonBorder from "../assets/game/borders/demon-border-card.png";
import abominationBorder from "../assets/game/borders/abomination-border-card.png";
import frontLane from "../assets/game/icons/front_lane.png";
import backLane from "../assets/game/icons/back_lane.png";
import hybridLane from "../assets/game/icons/hibrid_lane.png";
import instantIcon from "../assets/game/icons/instant.png";
import ritualIcon from "../assets/game/icons/ritual.png";
import enchantmentIcon from "../assets/game/icons/enchantment.png";

// Réplique de scenes/card/Card.tscn + scripts/card/Card.gd du jeu (E:\card-game),
// à partir des données servies par wyrdane-backend (valeurs en français).

const BORDER_TEXTURES: Record<string, string> = {
	"Mort-Vivant": undeadBorder,
	Humain: humanBorder,
	Demon: demonBorder,
	Abomination: abominationBorder,
};

// Card.gd RACE_COLORS — fond du nom, de la description et du badge de coût race
const RACE_COLORS: Record<string, string> = {
	"Mort-Vivant": "rgba(13, 11, 9, 0.71)",
	Abomination: "rgba(4, 15, 0, 0.71)",
	Humain: "rgba(58, 44, 18, 0.75)",
	Demon: "rgba(42, 10, 16, 0.75)",
};

// Card.gd RARITY_COLORS — couleur du bandeau de type (clés = valeurs FR de la BDD)
const RARITY_COLORS: Record<string, string> = {
	Commune: "#808080",
	Rare: "#3498db",
	Épique: "#9b59b6",
	Légendaire: "#f39c12",
};

const LANE_ICONS: Record<string, string> = {
	Avant: frontLane,
	Arrière: backLane,
	Hybride: hybridLane,
};

const TYPE_ICONS: Record<string, string> = {
	Incantation: instantIcon,
	Rituel: ritualIcon,
	Enchantement: enchantmentIcon,
};

// CostSystem.RACE_LOCK_PCT — % du coût verrouillé sur le pool de race, par rareté
const RACE_LOCK_PCT: Record<string, number> = {
	Commune: 0.25,
	Rare: 0.4,
	Épique: 0.55,
	Légendaire: 0.65,
};

// CostSystem.compute_race_cost (aucune carte n'utilise race_cost_override)
function computeRaceCost(cost: number, rarity: string | null): number {
	if (cost <= 0) return 0;
	const pct = RACE_LOCK_PCT[rarity ?? ""] ?? 0.4;
	return Math.min(Math.max(Math.round(cost * pct), 1), cost);
}

function withAlpha(rgba: string, alpha: number): string {
	return rgba.replace(/[\d.]+\)$/, `${alpha})`);
}

export default function GameCard({ card }: { card: CardData }) {
	const cost = Number(card.cost ?? 0);
	const raceCost = computeRaceCost(cost, card.rarity);
	const genericCost = cost - raceCost;
	const isMinion = card.card_type === "Serviteur";

	const raceColor = RACE_COLORS[card.race] ?? "rgba(0, 0, 0, 0.7)";
	const rarityColor = RARITY_COLORS[card.rarity ?? ""] ?? "#808080";
	const borderTexture = BORDER_TEXTURES[card.race];
	const watermark = isMinion ? LANE_ICONS[card.lane ?? ""] : TYPE_ICONS[card.card_type];

	// Card.gd _apply_type_style : le bandeau affiche le type, plus les charges des Rituels
	let typeText = card.card_type;
	if (card.card_type === "Rituel" && card.charges != null) {
		if (card.charges > 0) typeText += ` • ${card.charges} charge${card.charges > 1 ? "s" : ""}`;
		else if (card.charges === -1) typeText += " • Permanent";
	}

	return (
		<div className="gamecard">
			<div className="gamecard-black-frame" />
			{card.image_path && (
				<img className="gamecard-art" src={`${API_URL}${card.image_path}`} alt="" draggable={false} />
			)}
			{watermark && <img className="gamecard-watermark" src={watermark} alt="" draggable={false} />}
			<div className="gamecard-name" style={{ background: raceColor }}>
				{card.name}
			</div>
			{genericCost > 0 && <div className="gamecard-generic-cost">{genericCost}</div>}
			<div
				className="gamecard-cost"
				style={{
					background: withAlpha(raceColor, 0.9),
					borderColor: withAlpha(raceColor, 0.9),
				}}
			>
				{raceCost}
			</div>
			<div className="gamecard-desc" style={{ background: raceColor }}>
				{card.effect && <div className="gamecard-effect">{card.effect}</div>}
				{card.flavor && <div className="gamecard-flavor">{card.flavor}</div>}
			</div>
			<div
				className="gamecard-type"
				style={{ background: withAlpha(hexToRgba(rarityColor), 0.85), borderColor: rarityColor }}
			>
				{typeText}
			</div>
			{isMinion && <div className="gamecard-attack">{card.attack ?? 0}</div>}
			{isMinion && <div className="gamecard-health">{card.hp ?? 0}</div>}
			{borderTexture && (
				<img className="gamecard-border" src={borderTexture} alt="" draggable={false} />
			)}
		</div>
	);
}

function hexToRgba(hex: string): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, 1)`;
}
