import type { Language } from "./language";

// `id` est une clé stable (indépendante de la langue) utilisée pour retrouver
// la carte d'exemple associée dans `src/data/exampleCards.ts` (KeywordsExplorer).
export type KeywordEntry = { id: string; name: string; description: string };
export type KeywordGroup = { key: string; title: string; items: KeywordEntry[] };

const EN_GROUPS: KeywordGroup[] = [
	{
		key: "generic",
		title: "Generic",
		items: [
			{ id: "rempart", name: "Taunt", description: "Must be attacked first by enemy minions." },
			{ id: "assaut", name: "Charge", description: "Can attack the turn it is summoned." },
			{
				id: "egide",
				name: "Aegis",
				description: "Absorbs the next instance of damage. The shield then disappears.",
			},
			{ id: "moisson", name: "Harvest", description: "Damage dealt heals your hero by the same amount." },
			{ id: "frenesie", name: "Fury", description: "Can attack twice per turn." },
			{
				id: "venin_mortel",
				name: "Deadly Poison",
				description:
					"Any damage this minion deals destroys the target, regardless of its remaining health.",
			},
			{
				id: "ravage",
				name: "Ravage",
				description: "Excess damage is dealt directly to the enemy hero.",
			},
			{
				id: "infiltration",
				name: "Infiltration",
				description:
					"Ignores the enemy Front row; can target the Back row or the hero directly.",
			},
		],
	},
	{
		key: "human",
		title: "Human",
		items: [
			{
				id: "discipline",
				name: "Discipline",
				description: "Immune to enemy silence, mind control, and fear effects.",
			},
			{
				id: "formation",
				name: "Formation",
				description: "While an allied minion is adjacent, this minion gains +1/+1.",
			},
			{
				id: "contre_attaque",
				name: "Counterattack",
				description: "Wound: if this minion survives, it deals its ATK back to the attacker.",
			},
			{
				id: "commandement",
				name: "Command",
				description:
					"Allied Human minions summoned after it permanently gain +1/+0.",
			},
			{
				id: "fortification",
				name: "Fortification",
				description: "Cannot be moved, bounced to hand, or transformed by enemy effects.",
			},
		],
	},
	{
		key: "undead",
		title: "Undead",
		items: [
			{
				id: "pestifere",
				name: "Plaguebearer",
				description: "This minion's attacks inflict Infection in addition to damage.",
			},
			{
				id: "necrophage",
				name: "Necrophage",
				description: "When an allied minion dies, this minion permanently gains +1/+1.",
			},
			{
				id: "horde",
				name: "Horde",
				description: "While you control 3 or more Undead, this minion gains +1/+0.",
			},
			{
				id: "revenant",
				name: "Revenant",
				description:
					"The first time this minion would die, it rises with 1 HP instead (once per game).",
			},
			{
				id: "chair_morte",
				name: "Dead Flesh",
				description: "Immune to Infection, poison, and fear effects.",
			},
		],
	},
	{
		key: "demon",
		title: "Demon",
		items: [
			{
				id: "pacte",
				name: "Pact",
				description:
					"Pact X: you may pay X HP when the effect triggers to improve it. Asked again on every trigger.",
			},
			{
				id: "corruption",
				name: "Corruption",
				description:
					"This minion's attacks inflict Corruption in addition to damage (the target permanently loses 1 ATK, stacking).",
			},
			{
				id: "terreur",
				name: "Terror",
				description: "When this minion attacks, the target cannot attack on the next enemy turn.",
			},
			{
				id: "rang_infernal",
				name: "Infernal Rank",
				description: "This minion gains +1/+0 for every 10 HP missing from your hero.",
			},
			{
				id: "chair_de_soufre",
				name: "Sulfur Flesh",
				description: "Immune to Corruption, fear, and mind control effects.",
			},
			{
				id: "sang_noir",
				name: "Black Blood",
				description:
					"Whenever your hero loses HP from one of your own cards, this minion permanently gains +1/+0.",
			},
		],
	},
	{
		key: "abomination",
		title: "Abomination",
		items: [
			{
				id: "mutation",
				name: "Mutation",
				description:
					"This minion mutates each time it survives damage. Effects are permanent and stackable.\n\nMutation Table:\n40% Growth: +2 ATK\n40% Reinforcement: +2 HP\n20% Degeneration: -1 ATK / -1 HP",
			},
			{
				id: "fusion",
				name: "Fusion",
				description:
					"Sacrifice an adjacent allied minion: this minion permanently absorbs its remaining stats AND one keyword of your choice.",
			},
			{
				id: "virulent",
				name: "Virulent",
				description:
					"Deathrattle: the adjacent allied minion immediately triggers a mutation.",
			},
			{
				id: "chair_adaptative",
				name: "Adaptive Flesh",
				description:
					"Arrival: permanently copies a keyword of your choice from a minion in play (allied or enemy).",
			},
			{
				id: "assimilation",
				name: "Assimilation",
				description:
					"Devour: this minion can absorb the remains to gain +1/+1 until the start of the next turn (once per death).",
			},
			{
				id: "instable",
				name: "Unstable",
				description:
					"This minion cannot be targeted by healing effects, allied or enemy: its flesh is too erratic to stabilize.",
			},
		],
	},
];

const FR_GROUPS: KeywordGroup[] = [
	{
		key: "generic",
		title: "Génériques",
		items: [
			{ id: "rempart", name: "Rempart", description: "Doit être attaqué en priorité par les serviteurs ennemis." },
			{ id: "assaut", name: "Assaut", description: "Peut attaquer dès le tour où il est invoqué." },
			{
				id: "egide",
				name: "Égide",
				description: "Absorbe la prochaine source de dégâts. Le bouclier disparaît ensuite.",
			},
			{ id: "moisson", name: "Moisson", description: "Les dégâts infligés soignent votre héros d'autant." },
			{ id: "frenesie", name: "Frénésie", description: "Peut attaquer deux fois par tour." },
			{
				id: "venin_mortel",
				name: "Venin mortel",
				description:
					"Toute blessure infligée par ce serviteur détruit la cible, quelle que soit sa vie restante.",
			},
			{
				id: "ravage",
				name: "Ravage",
				description: "Les dégâts excédentaires sont infligés directement au héros adverse.",
			},
			{
				id: "infiltration",
				name: "Infiltration",
				description:
					"Ignore la rangée Avant ennemie ; peut cibler directement la rangée Arrière ou le héros.",
			},
		],
	},
	{
		key: "human",
		title: "Humain",
		items: [
			{
				id: "discipline",
				name: "Discipline",
				description: "Immunisé aux effets de silence, contrôle mental et peur ennemis.",
			},
			{
				id: "formation",
				name: "Formation",
				description: "Tant qu'un serviteur allié est adjacent, ce serviteur gagne +1/+1.",
			},
			{
				id: "contre_attaque",
				name: "Contre-attaque",
				description: "Blessure : si ce serviteur survit, inflige son ATK en retour à l'attaquant.",
			},
			{
				id: "commandement",
				name: "Commandement",
				description:
					"Les serviteurs Humains alliés invoqués après lui gagnent +1/+0 de façon permanente.",
			},
			{
				id: "fortification",
				name: "Fortification",
				description: "Ne peut pas être déplacé, renvoyé en main ou transformé par des effets ennemis.",
			},
		],
	},
	{
		key: "undead",
		title: "Mort-Vivant",
		items: [
			{
				id: "pestifere",
				name: "Pestiféré",
				description: "Les attaques de ce serviteur infligent Infection en plus des dégâts.",
			},
			{
				id: "necrophage",
				name: "Nécrophage",
				description: "Quand un serviteur allié meurt, ce serviteur gagne +1/+1 de façon permanente.",
			},
			{
				id: "horde",
				name: "Horde",
				description: "Tant que tu contrôles 3 Morts-Vivants ou plus, ce serviteur gagne +1/+0.",
			},
			{
				id: "revenant",
				name: "Revenant",
				description:
					"La première fois que ce serviteur devrait mourir, il se relève avec 1 HP à la place (une seule fois par partie).",
			},
			{ id: "chair_morte", name: "Chair morte", description: "Immunisé à l'Infection, au poison et aux effets de peur." },
		],
	},
	{
		key: "demon",
		title: "Démon",
		items: [
			{
				id: "pacte",
				name: "Pacte",
				description:
					"Pacte X : tu peux payer X points de vie lors du déclenchement de l'effet pour l'améliorer. Redemandé à chaque déclenchement.",
			},
			{
				id: "corruption",
				name: "Corruption",
				description:
					"Les attaques de ce serviteur infligent Corruption en plus des dégâts (la cible perd 1 ATK de façon permanente, cumulable).",
			},
			{
				id: "terreur",
				name: "Terreur",
				description: "Quand ce serviteur attaque, la cible ne peut pas attaquer lors du prochain tour adverse.",
			},
			{
				id: "rang_infernal",
				name: "Rang infernal",
				description: "Ce serviteur gagne +1/+0 pour chaque tranche de 10 HP manquants sur ton héros.",
			},
			{
				id: "chair_de_soufre",
				name: "Chair de soufre",
				description: "Immunisé à Corruption, à la peur et aux effets de contrôle mental.",
			},
			{
				id: "sang_noir",
				name: "Sang noir",
				description:
					"Chaque fois que ton héros perd des HP à cause d'une de tes propres cartes, ce serviteur gagne +1/+0 de façon permanente.",
			},
		],
	},
	{
		key: "abomination",
		title: "Abomination",
		items: [
			{
				id: "mutation",
				name: "Mutation",
				description:
					"Ce serviteur mute chaque fois qu'il survit à une blessure. Effets permanents et cumulables.\n\nTable de Mutation :\n40% Croissance : +2 ATQ\n40% Renforcement : +2 PV\n20% Dégénérescence : -1 ATQ / -1 PV",
			},
			{
				id: "fusion",
				name: "Fusion",
				description:
					"Sacrifice un serviteur allié adjacent : ce serviteur absorbe ses stats restantes ET un de ses mots-clés au choix, de façon permanente.",
			},
			{
				id: "virulent",
				name: "Virulent",
				description: "Dernier Souffle : le serviteur allié adjacent déclenche immédiatement une mutation.",
			},
			{
				id: "chair_adaptative",
				name: "Chair adaptative",
				description:
					"Arrivée : copie un mot-clé au choix présent sur un serviteur en jeu (allié ou ennemi), de façon permanente.",
			},
			{
				id: "assimilation",
				name: "Assimilation",
				description:
					"Dévoration : ce serviteur peut absorber les restes pour gagner +1/+1 jusqu'au début du prochain tour (une fois par mort).",
			},
			{
				id: "instable",
				name: "Instable",
				description:
					"Ce serviteur ne peut pas être ciblé par des effets de soin, alliés ou ennemis : sa chair est trop erratique pour être stabilisée.",
			},
		],
	},
];

export const KEYWORD_GROUPS: Record<Language, KeywordGroup[]> = {
	en: EN_GROUPS,
	fr: FR_GROUPS,
};
