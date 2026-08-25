import cardTranslations from "../data/cardTranslations.json";
import type { Language } from "./language";

// Table FR -> EN générée depuis translations/game.csv du jeu (repo séparé
// card-game) : clé = texte FR affiché (noms/effets/flavour de carte, mais
// aussi labels d'enum type/race/rareté et noms/descriptions de mots-clés, qui
// partagent le même fichier). Régénérée avec un simple script Python
// (csv.DictReader sur translations/game.csv, colonnes fr->en, dump JSON) —
// à refaire à chaque changement de carte/mot-clé côté jeu, même logique que
// gameCards.json/keywords.ts (copies statiques qui se désynchronisent
// silencieusement, voir CLAUDE.md du site).
// Noms des 4 decks de départ (backend/src/data/starterDecks.ts, "Deck de
// départ — <Race>") : jamais dans game.csv puisqu'ils n'existent que côté
// backend, pas dans le jeu lui-même. Ajoutés à la main plutôt que par la
// régénération automatique - à tenir à jour si une race de deck de départ
// est ajoutée/renommée côté backend.
// Deux effets de carte Démon (Banshee des Abysses, Cercle de Corruption)
// n'ont pas de correspondance dans game.csv à cause d'une casse différente
// entre le texte réel de la carte ("Inflige"/"Éveil : Inflige") et l'entrée
// du CSV ("inflige"/"éveil : inflige", en minuscule) : la table est une
// correspondance exacte, donc la recherche échouait silencieusement pour ces
// deux-là. Ajoutées à la main avec la casse réelle de la carte.
const EXTRA_TRANSLATIONS: Record<string, string> = {
	"Deck de départ — Mort-Vivant": "Starter Deck — Undead",
	"Deck de départ — Humain": "Starter Deck — Human",
	"Deck de départ — Démon": "Starter Deck — Demon",
	"Deck de départ — Abomination": "Starter Deck — Abomination",
	"Arrivée : Inflige Corruption à un serviteur ennemi ciblé.":
		"Arrival: Inflict Corruption on target enemy minion.",
	"Éveil : Inflige Corruption à un serviteur ennemi aléatoire.":
		"Awakening: Inflict Corruption on a random enemy minion.",
};

const TRANSLATIONS: Record<string, string> = {
	...(cardTranslations as Record<string, string>),
	...EXTRA_TRANSLATIONS,
};

// Traduit un texte de carte (nom, effet, flavour) ou un label d'enum
// (type/race/rareté/mot-clé) affiché tel quel. Ne touche jamais aux valeurs
// FR utilisées comme clé de lookup (card.race, card.card_type...) - seulement
// au texte réellement montré au joueur. Retombe sur le texte FR d'origine si
// la table n'a pas d'entrée (carte ajoutée après la dernière régénération).
export function translateCardText(text: string, language: Language): string {
	if (language === "fr") return text;
	return TRANSLATIONS[text] ?? text;
}
