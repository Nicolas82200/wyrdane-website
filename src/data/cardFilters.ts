// Sélection des cartes réelles qui illustrent une entrée de la page d'accueil
// (type de carte, mot-clé, déclencheur) : les carrousels de CardTypeExplorer
// et InfoExplorer montrent TOUTES les cartes concernées, plus une seule carte
// d'exemple écrite à la main.
//
// Source : src/data/devAllCards.json, écrit par
// `node scripts/generate-game-cards.mjs` — les 304 cartes du jeu avec leurs
// stats, leur art, leurs mots-clés et leurs déclencheurs. À régénérer après
// tout changement de carte côté card-game.
import type { CardData } from "../types";
import allCards from "./devAllCards.json";

type CardEntry = CardData & { keywords: string[]; triggers: string[] };

// devAllCards.json n'a pas d'id (il ne vient pas de la base) : GameCard en a
// besoin comme clé, un index suffit.
const ALL_CARDS: CardEntry[] = (allCards as unknown as Omit<CardEntry, "id">[]).map((card, i) => ({
	...card,
	id: i + 1,
}));

// "Venin mortel" -> "venin_mortel", "Égide" -> "egide" : les ids des entrées
// de src/i18n/keywords.ts et src/i18n/home.ts sont exactement le slug du nom
// français, donc aucune table à maintenir pour les mots-clés et les types.
const slug = (value: string) =>
	value
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_");

// Les déclencheurs, eux, portent un id préfixé côté i18n et un nom d'enum côté
// jeu (TriggerType.gd) : la table est inévitable. Tout id listé ici doit avoir
// sa valeur dans TriggerType.Type — un déclencheur retiré du jeu doit quitter
// src/i18n/home.ts et cette table, pas y rester avec un carrousel vide.
const TRIGGER_ENUM_BY_ID: Record<string, string> = {
	t_arrival: "ONPLAY",
	t_reinforcement: "OnSummon",
	t_deathrattle: "DEATHRATTLE",
	t_wound: "OnDamaged",
	t_awaken: "OnAwaken",
	t_attack: "OnAttack",
	t_resonance: "OnResonance",
	t_grief: "OnGrief",
	t_sacrifice: "OnSacrifice",
	t_execution: "OnExecution",
	t_carnage: "OnCarnage",
	t_death_rage: "OnDeathRage",
};

export const cardsByType = (typeId: string): CardData[] =>
	ALL_CARDS.filter((card) => slug(card.card_type) === typeId);

// Mots-clés et déclencheurs partagent InfoExplorer : les ids de déclencheur
// sont préfixés `t_`, donc aucune collision avec un id de mot-clé.
export const cardsByEntry = (entryId: string): CardData[] => {
	const trigger = TRIGGER_ENUM_BY_ID[entryId];
	if (trigger) return ALL_CARDS.filter((card) => card.triggers.includes(trigger));
	return ALL_CARDS.filter((card) => card.keywords.some((keyword) => slug(keyword) === entryId));
};
