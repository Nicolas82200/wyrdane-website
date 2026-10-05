import { Fragment, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { API_URL } from "../api";
import type { CardData } from "../types";
import { useLanguage } from "../i18n/useLanguage";
import { translateCardText } from "../i18n/cardText";
import { RACE_ICON_COLORS } from "../data/raceColors";
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
// Plafond relevé au-delà de la valeur du jeu (34, voir Card.gd) : une fois
// la police agrandie côté site (voir GameCard.css), un nom sur 2-3 lignes a
// besoin de plus de place pour ne jamais recouper la description.
const NAME_LABEL_MAX_GROWTH = 44;
const DESC_LABEL_DEFAULT_TOP = 186;
const DESC_LABEL_DEFAULT_BOTTOM = 328.5; // hauteur minimum 142.5
// Card.gd _fit_desc_label : si le texte débordé malgré la croissance vers
// le bas (plafonnée ici), on réduit plutôt la police (Typography.BODY - 1
// → Typography.MICRO - 1) pour ne jamais recouper le texte de règle.
const DESC_LABEL_MAX_GROWTH = 3;
const DESC_LABEL_DEFAULT_FONT_SIZE = 18;
const DESC_LABEL_SHRUNK_FONT_SIZE = 14;
const STATS_LABEL_DEFAULT_TOP = 330;
// Card.gd DESC_FLAVOUR_HIDE_THRESHOLD : au-delà de ce nombre de caractères,
// le texte d'effet seul remplit déjà la case — le flavour text est masqué
// plutôt que d'aggraver le débordement.
const DESC_FLAVOUR_HIDE_THRESHOLD = 120;

// Card.gd LANE_ICON_DEFAULT_TOP/BOTTOM (filigrane central) : hauteur fixe de
// 140, recentrée sur la zone de texte par _center_lane_icon (voir plus bas).
const LANE_ICON_DEFAULT_TOP = 176;
const LANE_ICON_DEFAULT_BOTTOM = 316;

// TypeLabel (Card.gd TYPE_LABEL_*) : largeur ajustee au texte affiche.
// Mesurée par le navigateur via CSS (width: max-content, voir GameCard.css)
// plutôt qu'au canvas : une mesure JS figée au premier rendu (avant que la
// police CinzelCard ait fini de charger, voir le même problème sur
// NameLabel ci-dessus) tombait sur la police de repli du navigateur,
// produisait une largeur trop étroite, et restait juste — coupant des mots
// entiers ("Enchantement", "Rituel • N charges") derrière overflow: hidden
// sans jamais se corriger une fois la vraie police chargée.

export default function GameCard({ card }: { card: CardData }) {
	const { language } = useLanguage();
	const cost = Number(card.cost ?? 0);
	const raceCost = computeRaceCost(cost, card.rarity);
	const genericCost = cost - raceCost;
	const isMinion = card.card_type === "Serviteur";
	const isResource = card.card_type === "Ressource";

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
		let cancelled = false;
		const measure = () => {
			if (cancelled) return;
			el.style.height = `${NAME_LABEL_DEFAULT_HEIGHT}px`;
			const needed = el.scrollHeight;
			// .gamecard-name a box-sizing: border-box avec une bordure de 1px
			// (haut+bas = 2px) : scrollHeight mesure le contenu + le padding
			// mais PAS cette bordure, alors que NAME_LABEL_DEFAULT_HEIGHT
			// l'inclut — sans ce correctif, la croissance calculée était
			// systématiquement sous-évaluée de 2px.
			const NAME_LABEL_BORDER = 2;
			const growth = Math.min(
				Math.max(needed + NAME_LABEL_BORDER - NAME_LABEL_DEFAULT_HEIGHT, 0),
				NAME_LABEL_MAX_GROWTH,
			);
			// Remet immédiatement la vraie hauteur sur le DOM, sans attendre le
			// commit React : si cette mesure retrouve la même croissance qu'une
			// mesure précédente (voir document.fonts.ready ci-dessous), passer
			// par setNameGrowth seul ne déclencherait aucun re-render (état
			// inchangé) et le style.height forcé à NAME_LABEL_DEFAULT_HEIGHT
			// juste au-dessus, pour la mesure, resterait collé sur l'élément —
			// bug observé en conditions réelles (nom qui recoupe le cadre de la
			// description malgré une croissance correctement calculée).
			el.style.height = `${NAME_LABEL_DEFAULT_HEIGHT + growth}px`;
			setNameGrowth(growth);
		};
		measure();
		// Les polices (@font-face CinzelCard) ne sont pas forcément chargées
		// au premier rendu : la mesure ci-dessus tombe alors sur la police de
		// repli du navigateur, souvent plus étroite, qui peut tenir sur une
		// ligne de moins que la vraie police une fois chargée — sans
		// remesurer après coup, un nom qui finit par passer sur 2 lignes
		// restait figé à sa hauteur par défaut et venait recouper le cadre de
		// la description juste en-dessous (bug observé en conditions réelles).
		document.fonts?.ready?.then(measure);
		return () => {
			cancelled = true;
		};
	}, [card.name]);

	const descTop = DESC_LABEL_DEFAULT_TOP + nameGrowth;
	const descAvailableHeight = DESC_LABEL_DEFAULT_BOTTOM - descTop;

	// Masque le flavour text si le texte d'effet seul remplit déjà la case
	// (Card.gd DESC_FLAVOUR_HIDE_THRESHOLD).
	const effectText = card.effect ? translateCardText(card.effect, language) : "";
	const showFlavor = !!card.flavor && effectText.length < DESC_FLAVOUR_HIDE_THRESHOLD;

	// Port de Card.gd _fit_desc_label : grandit vers le bas (plafonné à
	// DESC_LABEL_MAX_GROWTH) puis, si ça ne suffit toujours pas, réduit la
	// police plutôt que de laisser le texte déborder/se faire rogner.
	const descRef = useRef<HTMLDivElement>(null);
	const [descFontSize, setDescFontSize] = useState(DESC_LABEL_DEFAULT_FONT_SIZE);
	const [descGrowth, setDescGrowth] = useState(0);
	useLayoutEffect(() => {
		const el = descRef.current;
		if (!el) return;
		let cancelled = false;
		const measure = () => {
			if (cancelled) return;
			el.style.fontSize = `${DESC_LABEL_DEFAULT_FONT_SIZE}px`;
			el.style.height = `${descAvailableHeight}px`;
			let overflow = el.scrollHeight - descAvailableHeight;
			let fontSize = DESC_LABEL_DEFAULT_FONT_SIZE;
			if (overflow > DESC_LABEL_MAX_GROWTH) {
				fontSize = DESC_LABEL_SHRUNK_FONT_SIZE;
				el.style.fontSize = `${fontSize}px`;
				overflow = el.scrollHeight - descAvailableHeight;
			}
			const growth = Math.min(Math.max(overflow, 0), DESC_LABEL_MAX_GROWTH);
			// Même bug que NameLabel (voir ci-dessus) : remet explicitement la
			// hauteur finale sur le DOM, sans compter uniquement sur le commit
			// React, qui n'a rien à faire si cette mesure (après chargement des
			// polices) retombe sur les mêmes valeurs que la précédente.
			el.style.height = `${descAvailableHeight + growth}px`;
			setDescFontSize(fontSize);
			setDescGrowth(growth);
		};
		measure();
		document.fonts?.ready?.then(measure);
		return () => {
			cancelled = true;
		};
	}, [effectText, card.flavor, showFlavor, descAvailableHeight, language]);

	const descHeight = descAvailableHeight + descGrowth;
	const statsTop = STATS_LABEL_DEFAULT_TOP + descGrowth;

	// Card.gd _center_lane_icon : le filigrane garde une hauteur fixe, seul
	// son centre suit celui de la zone de texte (qui descend avec la
	// croissance du nom) - jusqu'ici fixé en dur en CSS (top: 176px), donc
	// jamais recentré sur les cartes au nom assez long pour agrandir
	// NameLabel, ce qui pouvait le pousser hors de la zone visible/sous le
	// bandeau de type sur certaines cartes (Incantation/Rituel/Enchantement
	// ont souvent des noms plus longs).
	const watermarkHeight = LANE_ICON_DEFAULT_BOTTOM - LANE_ICON_DEFAULT_TOP;
	const watermarkTop = descTop + descHeight / 2 - watermarkHeight / 2;

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
						top: watermarkTop,
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
			{!isResource && genericCost > 0 && (
				<div className="gamecard-generic-cost">{genericCost}</div>
			)}
			{!isResource && (
				<div
					className="gamecard-cost"
					style={{
						background: withAlpha(raceColor, 0.9),
						borderColor: withAlpha(raceColor, 0.9),
					}}
				>
					{raceCost}
				</div>
			)}
			<div
				ref={descRef}
				className="gamecard-desc"
				style={{
					background: raceColor,
					top: descTop,
					height: descHeight,
					fontSize: descFontSize,
				}}
			>
				{effectText && <div className="gamecard-effect">{formatEffectText(effectText)}</div>}
				{showFlavor && card.flavor && (
					<div className="gamecard-flavor">{translateCardText(card.flavor, language)}</div>
				)}
			</div>
			<div
				className="gamecard-type"
				style={{
					background: withAlpha(hexToRgba(rarityColor), 0.85),
					borderColor: TYPE_LABEL_BORDER_COLOR,
				}}
			>
				{typeText}
			</div>
			{isMinion && (
				<div className="gamecard-attack" style={{ top: statsTop }}>
					{card.attack ?? 0}
				</div>
			)}
			{isMinion && (
				<div className="gamecard-health" style={{ top: statsTop }}>
					{card.hp ?? 0}
				</div>
			)}
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
