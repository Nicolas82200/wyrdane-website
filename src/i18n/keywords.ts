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
				description: "Absorbs the next source of damage, then the shield is gone.",
			},
			{ id: "moisson", name: "Harvest", description: "Damage dealt heals your hero for the same amount." },
			{ id: "frenesie", name: "Fury", description: "Can attack twice per turn." },
			{
				id: "venin_mortel",
				name: "Deadly Poison",
				description:
					"Any damage dealt by this minion destroys the target, regardless of remaining health.",
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
				description:
					"Immune to racial harmful effects (Infection, Corruption, Terror), silence and mind control.",
			},
			{
				id: "formation",
				name: "Formation",
				description: "While an allied minion is adjacent, this minion gains +1/+1.",
			},
			{
				id: "contre_attaque",
				name: "Counterattack",
				description: "Deals twice its attack damage to the minion that damaged it.",
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
				description: "Cannot be moved, returned to hand or transformed by enemy effects.",
			},
		],
	},
	{
		key: "undead",
		title: "Undead",
		items: [
			{
				id: "morsure",
				name: "Bite",
				description: "BITE X: this card's damage inflicts Infection for X turns.",
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
					"The first time this minion would die, it rises again with 1 HP instead (once per time it's put into play). Also triggers on Sacrifice and FUSION.",
			},
			{
				id: "chair_morte",
				name: "Dead Flesh",
				description: "Immune to racial harmful effects (Infection, Corruption, Terror).",
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
					"This minion's attacks inflict Corruption in addition to damage (the target permanently loses 1 ATK, stackable).",
			},
			{
				id: "terreur",
				name: "Terror",
				description:
					"When this minion deals damage (combat or effect), the target(s) cannot attack during their controller's next turn.",
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
					"Whenever your hero loses HP because of one of your own cards, this minion permanently gains +1/+0.",
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
					"Sacrifice an adjacent allied minion: this minion permanently absorbs its remaining stats AND one of its keywords of your choice.",
			},
			{
				id: "virulent",
				name: "Virulent",
				description:
					"When this minion dies, adjacent allied minions immediately trigger a mutation.",
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
					"This minion cannot be targeted by healing effects, allied or enemy, its flesh is too erratic to stabilize.",
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
			{ id: "assaut", name: "Assaut", description: "Peut attaquer dès le tour où elle est invoquée." },
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
				description:
					"Immunisé aux effets néfastes raciaux (Infection, Corruption, Terreur), au silence et au contrôle mental.",
			},
			{
				id: "formation",
				name: "Formation",
				description: "Tant qu'un serviteur allié est adjacent, ce serviteur gagne +1/+1.",
			},
			{
				id: "contre_attaque",
				name: "Contre-attaque",
				description: "Inflige 2 fois ses dégâts d'attaque au serviteur qui lui a infligé des dégâts.",
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
				id: "morsure",
				name: "Morsure",
				description: "MORSURE X : les dégâts de cette carte infligent Infection pendant X tours.",
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
					"La première fois que ce serviteur devrait mourir, il se relève avec 1 HP à la place (une seule fois par pose sur le plateau). Se déclenche aussi en cas de Sacrifice et de FUSION.",
			},
			{
				id: "chair_morte",
				name: "Chair morte",
				description: "Immunisé aux effets néfastes raciaux (Infection, Corruption, Terreur).",
			},
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
					"Pacte X : vous pouvez payer X points de vie lors du déclenchement de l'effet pour l'améliorer. Redemandé à chaque déclenchement.",
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
				description:
					"Quand ce serviteur inflige des dégâts (combat ou effet), la ou les cibles touchées ne peuvent pas attaquer lors du prochain tour de leur contrôleur.",
			},
			{
				id: "rang_infernal",
				name: "Rang infernal",
				description:
					"Ce serviteur gagne +1/+0 pour chaque tranche de 10 points de vie manquants sur votre héros.",
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
					"Chaque fois que votre héros perd des points de vie à cause d'une de vos propres cartes, ce serviteur gagne +1/+0 de façon permanente.",
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
					"Sacrifice un serviteur adjacent allié : ce serviteur absorbe ses stats restantes ET un de ses mots-clés au choix, de façon permanente.",
			},
			{
				id: "virulent",
				name: "Virulent",
				description:
					"Quand ce serviteur meurt, les serviteurs adjacents alliés déclenchent immédiatement une mutation.",
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
					"Ce serviteur ne peut pas être ciblé par des effets de soin, alliés ou ennemis, sa chair est trop erratique pour être stabilisée.",
			},
		],
	},
];

export const KEYWORD_GROUPS: Record<Language, KeywordGroup[]> = {
	en: EN_GROUPS,
	fr: FR_GROUPS,
};
