// Catalogue des déclencheurs du jeu (source : TooltipData.TRIGGER_DESCRIPTIONS
// + translations/game.csv côté E:\card-game). Affichés en tooltip au survol
// d'une carte, comme les mots-clés (voir DeckBuilder.tsx), pour expliquer les
// libellés en gras en tête de ligne d'effet ("Dernier souffle : ...").
export type TriggerInfo = {
	name: string;
	description: string;
};

export const TRIGGERS: TriggerInfo[] = [
	{ name: "Arrivée", description: "Déclenché lorsque ce serviteur arrive sur le champ de bataille." },
	{ name: "Dernier souffle", description: "Déclenché quand ce serviteur meurt." },
	{ name: "Assaut", description: "Peut attaquer dès le tour où elle est invoquée." },
	{ name: "Blessure", description: "Déclenché quand ce serviteur reçoit des dégâts." },
	{ name: "Éveil", description: "Déclenché au début de votre tour." },
	{ name: "Déclin", description: "Déclenché au début du tour ennemi." },
	{ name: "Deuil", description: "Déclenché quand un serviteur allié meurt." },
	{ name: "Sortilège", description: "Déclenché quand l'adversaire joue un sort." },
	{
		name: "Sacrifice",
		description: "Sacrifie un ou plusieurs serviteurs en coût supplémentaire.",
	},
	{ name: "Exécution", description: "Déclenché quand ce serviteur tue un ennemi en attaquant." },
	{ name: "Carnage", description: "Déclenché quand un serviteur ennemi meurt." },
	{ name: "Attaque", description: "Déclenché quand ce serviteur attaque." },
	{
		name: "Mort-rage",
		description:
			"Se déclenche une seule fois, quand ce serviteur passe sous 50% de ses HP maximum.",
	},
	{
		name: "Présence",
		description: "Effet passif continu actif tant que l'enchantement est en jeu.",
	},
	{
		name: "Renfort",
		description: "Déclenché chaque fois qu'un serviteur allié arrive sur le champ de bataille.",
	},
	{ name: "Résonance", description: "Déclenché quand un serviteur allié attaque." },
	{
		name: "Sacrifice du sang",
		description: "Déclenché quand ton héros perd des HP à cause d'une de tes propres cartes.",
	},
	{
		name: "Mutation",
		description: "Déclenché quand un serviteur allié Abomination gagne une mutation.",
	},
	{
		name: "Dévoration",
		description: "Déclenché quand n'importe quel serviteur, allié ou ennemi, meurt en jeu.",
	},
];

// Recherche insensible à la casse : le libellé en tête de ligne d'effet
// ("Dernier Souffle : ...") ne respecte pas toujours exactement la casse de
// TRIG_*_NAME ("Dernier souffle") - la carte source fait foi pour l'affichage,
// ce catalogue sert uniquement à retrouver la description associée.
export const TRIGGER_BY_NAME_LOWER = new Map(
	TRIGGERS.map((t) => [t.name.toLowerCase(), t]),
);
