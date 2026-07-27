import type { Language } from "./language";

export type KeywordEntry = { name: string; description: string };
export type KeywordGroup = { key: string; title: string; items: KeywordEntry[] };

const EN_GROUPS: KeywordGroup[] = [
	{
		key: "generic",
		title: "Generic",
		items: [
			{ name: "Rampart", description: "Must be attacked first by enemy minions." },
			{ name: "Charge", description: "Can attack the turn it is summoned." },
			{
				name: "Aegis",
				description: "Absorbs the next instance of damage. The shield then disappears.",
			},
			{ name: "Harvest", description: "Damage dealt heals your hero by the same amount." },
			{ name: "Frenzy", description: "Can attack twice per turn." },
			{
				name: "Deadly Venom",
				description:
					"Any damage this minion deals destroys the target, regardless of its remaining health.",
			},
			{
				name: "Rampage",
				description: "Excess damage is dealt directly to the enemy hero.",
			},
			{
				name: "Infiltrate",
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
				name: "Discipline",
				description: "Immune to enemy silence, mind control, and fear effects.",
			},
			{
				name: "Formation",
				description: "While an allied minion is adjacent, this minion gains +1/+1.",
			},
			{
				name: "Counterattack",
				description: "Wound: if this minion survives, it deals its ATK back to the attacker.",
			},
			{
				name: "Command",
				description:
					"Allied Human minions summoned after it permanently gain +1/+0.",
			},
			{
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
				name: "Plagued",
				description: "This minion's attacks inflict Infection in addition to damage.",
			},
			{
				name: "Necrophage",
				description: "When an allied minion dies, this minion permanently gains +1/+1.",
			},
			{
				name: "Horde",
				description: "While you control 3 or more Undead, this minion gains +1/+0.",
			},
			{
				name: "Revenant",
				description:
					"The first time this minion would die, it rises with 1 HP instead (once per game).",
			},
			{
				name: "Deadflesh",
				description: "Immune to Infection, poison, and fear effects.",
			},
		],
	},
	{
		key: "demon",
		title: "Demon",
		items: [
			{
				name: "Pact",
				description:
					"When this minion enters play, your hero loses HP equal to its mana cost. It gains Charge.",
			},
			{
				name: "Corruption",
				description:
					"This minion's attacks inflict Corruption in addition to damage (the target permanently loses 1 ATK, stacking).",
			},
			{
				name: "Terror",
				description: "When this minion attacks, the target cannot attack on the next enemy turn.",
			},
			{
				name: "Infernal Rank",
				description: "This minion gains +1/+0 for every 10 HP missing from your hero.",
			},
			{
				name: "Sulfur Flesh",
				description: "Immune to Corruption, fear, and mind control effects.",
			},
			{
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
				name: "Mutation",
				description:
					"This minion mutates (see Mutation Table) whenever it survives a wound. Effects are permanent and stack.",
			},
			{
				name: "Fusion",
				description:
					"Sacrifice an adjacent allied minion: this minion permanently absorbs its remaining stats AND one keyword of your choice.",
			},
			{
				name: "Virulent",
				description:
					"Deathrattle: the adjacent allied minion immediately triggers a mutation.",
			},
			{
				name: "Adaptive Flesh",
				description:
					"Arrival: permanently copies a keyword of your choice from an adjacent minion (allied or enemy).",
			},
			{
				name: "Assimilation",
				description:
					"Devour: this minion can absorb the remains to permanently gain +1/+1 (once per death).",
			},
			{
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
			{ name: "Rempart", description: "Doit être attaqué en priorité par les serviteurs ennemis." },
			{ name: "Assaut", description: "Peut attaquer dès le tour où il est invoqué." },
			{
				name: "Égide",
				description: "Absorbe la prochaine source de dégâts. Le bouclier disparaît ensuite.",
			},
			{ name: "Moisson", description: "Les dégâts infligés soignent votre héros d'autant." },
			{ name: "Frénésie", description: "Peut attaquer deux fois par tour." },
			{
				name: "Venin mortel",
				description:
					"Toute blessure infligée par ce serviteur détruit la cible, quelle que soit sa vie restante.",
			},
			{
				name: "Ravage",
				description: "Les dégâts excédentaires sont infligés directement au héros adverse.",
			},
			{
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
				name: "Discipline",
				description: "Immunisé aux effets de silence, contrôle mental et peur ennemis.",
			},
			{
				name: "Formation",
				description: "Tant qu'un serviteur allié est adjacent, ce serviteur gagne +1/+1.",
			},
			{
				name: "Contre-attaque",
				description: "Blessure : si ce serviteur survit, inflige son ATK en retour à l'attaquant.",
			},
			{
				name: "Commandement",
				description:
					"Les serviteurs Humains alliés invoqués après lui gagnent +1/+0 de façon permanente.",
			},
			{
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
				name: "Pestiféré",
				description: "Les attaques de ce serviteur infligent Infection en plus des dégâts.",
			},
			{
				name: "Nécrophage",
				description: "Quand un serviteur allié meurt, ce serviteur gagne +1/+1 de façon permanente.",
			},
			{
				name: "Horde",
				description: "Tant que tu contrôles 3 Morts-Vivants ou plus, ce serviteur gagne +1/+0.",
			},
			{
				name: "Revenant",
				description:
					"La première fois que ce serviteur devrait mourir, il se relève avec 1 HP à la place (une seule fois par partie).",
			},
			{ name: "Chair morte", description: "Immunisé à l'Infection, au poison et aux effets de peur." },
		],
	},
	{
		key: "demon",
		title: "Démon",
		items: [
			{
				name: "Pacte",
				description:
					"Quand ce serviteur entre en jeu, ton héros perd un nombre de HP égal à son coût en mana. Il gagne Assaut.",
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
				description: "Ce serviteur gagne +1/+0 pour chaque tranche de 10 HP manquants sur ton héros.",
			},
			{
				name: "Chair de soufre",
				description: "Immunisé à Corruption, à la peur et aux effets de contrôle mental.",
			},
			{
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
				name: "Mutation",
				description:
					"Ce serviteur mute (voir Table de Mutation) chaque fois qu'il survit à une blessure. Les effets sont permanents et cumulables.",
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
					"Dévoration : ce serviteur peut absorber les restes pour gagner +1/+1 de façon permanente (une fois par mort).",
			},
			{
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
