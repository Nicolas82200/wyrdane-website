// Catalogue des déclencheurs du jeu (source : TooltipData.TRIGGER_DESCRIPTIONS
// + translations/game.csv côté E:\card-game). Affichés en tooltip au survol
// d'une carte, comme les mots-clés (voir DeckBuilder.tsx), pour expliquer les
// libellés en gras en tête de ligne d'effet ("Dernier souffle : ...").
// Les descriptions sont des copies mot pour mot des clés TRIG_*_DESC : toute
// divergence est un bug, pas une reformulation.
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
	{ name: "Deuil", description: "Déclenché quand un serviteur allié meurt." },
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
		description:
			"Déclenché chaque fois qu'un serviteur allié que vous jouez arrive sur le champ de bataille. Un serviteur invoqué par un effet ne le déclenche pas.",
	},
	{ name: "Résonance", description: "Déclenché quand un serviteur allié attaque." },
	{
		name: "Sacrifice du sang",
		description: "Déclenché quand ton héros perd des HP à cause d'une de tes propres cartes.",
	},
	{
		name: "Mutation",
		description: "Déclenché quand une Abomination alliée gagne une mutation.",
	},
	{
		name: "Dévoration",
		description: "Déclenché quand n'importe quel serviteur, allié ou ennemi, meurt en jeu.",
	},
	{
		name: "Pacte payé",
		description:
			"Déclenché quand vous payez le coût en PV d'un Pacte, sur n'importe laquelle de vos cartes.",
	},
];

// Recherche insensible à la casse : le libellé en tête de ligne d'effet
// ("Dernier Souffle : ...") ne respecte pas toujours exactement la casse de
// TRIG_*_NAME ("Dernier souffle") - la carte source fait foi pour l'affichage,
// ce catalogue sert uniquement à retrouver la description associée.
export const TRIGGER_BY_NAME_LOWER = new Map(
	TRIGGERS.map((t) => [t.name.toLowerCase(), t]),
);
