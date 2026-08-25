import { Fragment, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { API_URL } from "../api";
import type { CardData } from "../types";
import { useLanguage } from "../i18n/useLanguage";
import { translateCardText } from "../i18n/cardText";
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
	"Mort-Vivant": "rgba(10, 8, 6, 0.839)",
	Abomination: "rgba(2, 10, 0, 0.839)",
	Humain: "rgba(40, 32, 12, 0.839)",
	Demon: "rgba(30, 3, 8, 0.839)",
};

// Card.gd RACE_ICON_COLORS — teinte du filigrane central (LaneIcon/TypeIcon)
const RACE_ICON_COLORS: Record<string, string> = {
	"Mort-Vivant": "#bebebe",
	Abomination: "#9bd76e",
	Humain: "#e8c56d",
	Demon: "#e87587",
};

// Card.gd RARITY_COLORS — couleur de fond du bandeau de type (clés = valeurs FR de la BDD)
const RARITY_COLORS: Record<string, string> = {
	Commune: "#808080",
	Rare: "#3498db",
	Épique: "#9b59b6",
	Légendaire: "#f39c12",
};

// _type_style.border_color (Card.gd _ready/_apply_type_style) : bordure dorée
// fixe, indépendante de la rareté (seul le fond du bandeau varie).
const TYPE_LABEL_BORDER_COLOR = "rgba(168, 122, 52, 0.9)";

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

// Port de Card.gd bold_keywords_and_triggers/_bold_caps_words : met en gras
// le déclencheur en tête de ligne ("Dernier Souffle : ...") et toute suite de
// mots en MAJUSCULES d'au moins 4 lettres (espaces/tirets internes tolérés,
// ex. "VENIN MORTEL", "RANG INFERNAL") — même rendu que la carte en jeu,
// jusque-là simple texte brut sur le site (retours à la ligne compris, voir
// white-space: pre-line sur .gamecard-effect).
const TRIGGER_LINE_RE = /^([^:]{2,40}):\s*(.*)$/;
const CAPS_WORDS_RE = /[À-ÝA-Z][À-ÝA-Z-]*(?: [À-ÝA-Z][À-ÝA-Z-]*)*/g;

function boldCapsWords(line: string, keyPrefix: string): ReactNode[] {
	const nodes: ReactNode[] = [];
	let pos = 0;
	let i = 0;
	for (const m of line.matchAll(CAPS_WORDS_RE)) {
		const matched = m[0];
		const start = m.index ?? 0;
		if (start > pos) nodes.push(line.slice(pos, start));
		const lettersOnly = matched.replace(/[ -]/g, "");
		if (lettersOnly.length >= 4) {
			nodes.push(<strong key={`${keyPrefix}-${i++}`}>{matched}</strong>);
		} else {
			nodes.push(matched);
		}
		pos = start + matched.length;
	}
	if (pos < line.length) nodes.push(line.slice(pos));
	return nodes;
}

function formatEffectText(text: string): ReactNode[] {
	const lines = text.split("\n");
	const nodes: ReactNode[] = [];
	lines.forEach((line, i) => {
		if (i > 0) nodes.push("\n");
		const m = line.match(TRIGGER_LINE_RE);
		if (m) {
			nodes.push(
				<Fragment key={`line-${i}`}>
					<strong>{m[1]}</strong>: {boldCapsWords(m[2], `line-${i}`)}
				</Fragment>,
			);
		} else {
			nodes.push(<Fragment key={`line-${i}`}>{boldCapsWords(line, `line-${i}`)}</Fragment>);
		}
	});
	return nodes;
}

// NameLabel/DescLabel (Card.gd _fit_name_label/_fit_desc_label) : le nom
// grandit vers le BAS (offset_top fixe) quand il deborde de sa case par
// defaut, plafonne a NAME_LABEL_MAX_GROWTH ; DescLabel juste en-dessous est
// decale d'autant pour garder le meme espacement entre les deux.
const NAME_LABEL_DEFAULT_HEIGHT = 25; // 183 - 158
const NAME_LABEL_MAX_GROWTH = 34;
const DESC_LABEL_DEFAULT_TOP = 186;
const DESC_LABEL_DEFAULT_BOTTOM = 328.5; // hauteur minimum 142.5

// TypeLabel (Card.gd TYPE_LABEL_*) : largeur ajustee au texte affiche, entre
// ces deux bornes, toujours centree sur TYPE_LABEL_CENTER_X.
const TYPE_LABEL_MIN_WIDTH = 55;
const TYPE_LABEL_MAX_WIDTH = 200;
const TYPE_LABEL_PADDING = 16;
const TYPE_LABEL_CENTER_X = 125;
const TYPE_LABEL_FONT = '700 11px "CinzelCard", serif';

let typeLabelCanvas: HTMLCanvasElement | null = null;
function measureTypeLabelWidth(text: string): number {
	if (typeof document === "undefined") return TYPE_LABEL_MIN_WIDTH;
	if (!typeLabelCanvas) typeLabelCanvas = document.createElement("canvas");
	const ctx = typeLabelCanvas.getContext("2d");
	if (!ctx) return TYPE_LABEL_MIN_WIDTH;
	ctx.font = TYPE_LABEL_FONT;
	return ctx.measureText(text).width;
}

export default function GameCard({ card }: { card: CardData }) {
	const { language } = useLanguage();
	const cost = Number(card.cost ?? 0);
	const raceCost = computeRaceCost(cost, card.rarity);
	const genericCost = cost - raceCost;
	const isMinion = card.card_type === "Serviteur";

	const raceColor = RACE_COLORS[card.race] ?? "rgba(0, 0, 0, 0.75)";
	const raceIconColor = RACE_ICON_COLORS[card.race] ?? "#bebebe";
	const rarityColor = RARITY_COLORS[card.rarity ?? ""] ?? "#808080";
	const borderTexture = BORDER_TEXTURES[card.race];
	const watermark = isMinion ? LANE_ICONS[card.lane ?? ""] : TYPE_ICONS[card.card_type];

	// Card.gd _apply_type_style : le bandeau affiche le type, plus les charges des Rituels
	let typeText = translateCardText(card.card_type, language);
	if (card.card_type === "Rituel" && card.charges != null) {
		if (card.charges > 0) typeText += ` • ${card.charges} charge${card.charges > 1 ? "s" : ""}`;
		else if (card.charges === -1) typeText += " • Permanent";
	}

	// Croissance de NameLabel vers le bas (mesure DOM réelle, pas d'estimation
	// canvas : le retour à la ligne dépend de la police/largeur réelles).
	const nameRef = useRef<HTMLDivElement>(null);
	const [nameGrowth, setNameGrowth] = useState(0);
	useLayoutEffect(() => {
		const el = nameRef.current;
		if (!el) return;
		el.style.height = `${NAME_LABEL_DEFAULT_HEIGHT}px`;
		const needed = el.scrollHeight;
		const growth = Math.min(Math.max(needed - NAME_LABEL_DEFAULT_HEIGHT, 0), NAME_LABEL_MAX_GROWTH);
		setNameGrowth(growth);
	}, [card.name]);

	const descTop = DESC_LABEL_DEFAULT_TOP + nameGrowth;
	const descHeight = DESC_LABEL_DEFAULT_BOTTOM - descTop;

	const typeWidth = Math.min(
		Math.max(measureTypeLabelWidth(typeText) + TYPE_LABEL_PADDING, TYPE_LABEL_MIN_WIDTH),
		TYPE_LABEL_MAX_WIDTH,
	);

	return (
		<div className="gamecard">
			<div className="gamecard-black-frame" />
			{card.image_path && (
				<img className="gamecard-art" src={`${API_URL}${card.image_path}`} alt="" draggable={false} />
			)}
			{watermark && (
				<div
					className="gamecard-watermark"
					style={{
						backgroundColor: raceIconColor,
						WebkitMaskImage: `url(${watermark})`,
						maskImage: `url(${watermark})`,
					}}
				/>
			)}
			<div
				ref={nameRef}
				className="gamecard-name"
				style={{ background: raceColor, height: NAME_LABEL_DEFAULT_HEIGHT + nameGrowth }}
			>
				{translateCardText(card.name, language)}
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
			<div
				className="gamecard-desc"
				style={{ background: raceColor, top: descTop, height: descHeight }}
			>
				{card.effect && (
					<div className="gamecard-effect">
						{formatEffectText(translateCardText(card.effect, language))}
					</div>
				)}
				{card.flavor && (
					<div className="gamecard-flavor">{translateCardText(card.flavor, language)}</div>
				)}
			</div>
			<div
				className="gamecard-type"
				style={{
					background: withAlpha(hexToRgba(rarityColor), 0.85),
					borderColor: TYPE_LABEL_BORDER_COLOR,
					left: TYPE_LABEL_CENTER_X - typeWidth / 2,
					width: typeWidth,
				}}
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
