// Catalogue des mots-clés du jeu (source : scripts/data/Keyword*.gd et
// translations/game.csv côté E:\card-game). Même ordre que le dropdown du
// deck builder du jeu : génériques, puis Humain, Mort-Vivant, Démon, Abomination.
export type KeywordInfo = {
	name: string;
	description: string;
};

export const KEYWORDS: KeywordInfo[] = [
	// Génériques
	{ name: "Rempart", description: "Doit être attaqué en priorité par les serviteurs ennemis." },
	{ name: "Assaut", description: "Peut attaquer dès le tour où elle est invoquée." },
	{ name: "Égide", description: "Absorbe la prochaine source de dégâts. Le bouclier disparaît ensuite." },
	{ name: "Moisson", description: "Les dégâts infligés soignent votre héros d'autant." },
	{ name: "Frénésie", description: "Peut attaquer deux fois par tour." },
	{
		name: "Venin mortel",
		description:
			"Toute blessure infligée par ce serviteur détruit la cible, quelle que soit sa vie restante.",
	},
	{ name: "Ravage", description: "Les dégâts excédentaires sont infligés directement au héros adverse." },
	{
		name: "Infiltration",
		description:
			"Ignore la rangée Avant ennemie ; peut cibler directement la rangée Arrière ou le héros.",
	},
	// Humain
	{ name: "Discipline", description: "Immunisé aux effets de silence, contrôle mental et peur ennemis." },
	{ name: "Formation", description: "Tant qu'un serviteur allié est adjacent, ce serviteur gagne +1/+1." },
	{
		name: "Contre-attaque",
		description: "Blessure : si ce serviteur survit, inflige son ATK en retour à l'attaquant.",
	},
	{
		name: "Commandement",
		description: "Les serviteurs Humains alliés invoqués après lui gagnent +1/+0 de façon permanente.",
	},
	{
		name: "Fortification",
		description: "Ne peut pas être déplacé, renvoyé en main ou transformé par des effets ennemis.",
	},
	// Mort-Vivant
	{ name: "Pestiféré", description: "Les attaques de ce serviteur infligent Infection en plus des dégâts." },
	{
		name: "Nécrophage",
		description: "Quand un serviteur allié meurt, ce serviteur gagne +1/+1 de façon permanente.",
	},
	{ name: "Horde", description: "Tant que tu contrôles 3 Morts-Vivants ou plus, ce serviteur gagne +1/+0." },
	{
		name: "Revenant",
		description:
			"La première fois que ce serviteur devrait mourir, il se relève avec 1 HP à la place (une seule fois par partie).",
	},
	{ name: "Chair morte", description: "Immunisé à l'Infection, au poison et aux effets de peur." },
	// Démon
	{
		name: "Pacte",
		description:
			"Pacte X : vous pouvez payer X points de vie lors du déclenchement de l'effet pour l'améliorer. Redemandé à chaque déclenchement.",
	},
	{
		name: "Corruption",
		description:
			"Les attaques de ce serviteur infligent Corruption en plus des dégâts (la cible perd 1 ATK de façon permanente, cumulable).",
	},
	{
		name: "Terreur",
		description: "Quand ce serviteur attaque, la cible ne peut pas attaquer lors du prochain tour adverse.",
	},
	{
		name: "Rang infernal",
		description: "Ce serviteur gagne +1/+0 pour chaque tranche de 10 points de vie manquants sur votre héros.",
	},
	{ name: "Chair de soufre", description: "Immunisé à Corruption, à la peur et aux effets de contrôle mental." },
	{
		name: "Sang noir",
		description:
			"Chaque fois que votre héros perd des points de vie à cause d'une de vos propres cartes, ce serviteur gagne +1/+0 de façon permanente.",
	},
	// Abomination
	{
		name: "Mutation",
		description:
			"Ce serviteur mute chaque fois qu'il survit à une blessure. Effets permanents et cumulables.\n\nTable de Mutation :\n40% Croissance : +2 ATQ\n40% Renforcement : +2 PV\n20% Dégénérescence : -1 ATQ / -1 PV",
	},
	{
		name: "Fusion",
		description:
			"Sacrifice un serviteur allié adjacent : ce serviteur absorbe ses stats restantes ET un de ses mots-clés au choix, de façon permanente.",
	},
	{
		name: "Virulent",
		description: "Dernier Souffle : le serviteur allié adjacent déclenche immédiatement une mutation.",
	},
	{
		name: "Chair adaptative",
		description:
			"Arrivée : copie un mot-clé au choix présent sur un serviteur adjacent (allié ou ennemi), de façon permanente.",
	},
	{
		name: "Assimilation",
		description:
			"Dévoration : ce serviteur peut absorber les restes pour gagner +1/+1 jusqu'au début du prochain tour (une fois par mort).",
	},
	{
		name: "Instable",
		description:
			"Ce serviteur ne peut pas être ciblé par des effets de soin, alliés ou ennemis : sa chair est trop erratique pour être stabilisée.",
	},
];

export const KEYWORD_BY_NAME = new Map(KEYWORDS.map((k) => [k.name, k]));
