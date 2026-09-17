import type { Language } from "./language";

// `id` est une clé stable (indépendante de la langue) utilisée pour retrouver
// la carte d'exemple associée dans `src/data/exampleCards.ts`.
export type SimpleItem = { id: string; name: string; text: string };
export type LaneItem = { key: "front" | "back" | "hybrid"; name: string; text: string };
export type RaceItem = { key: string; name: string; text: string };
export type SectionNavItem = { id: string; label: string };

export type HomeContent = {
	heroTagline: string;
	heroNewsCta: string;
	heroDecksCta: string;
	heroWishlistCta: string;
	gameTitle: string;
	gameText: string;
	lanesTitle: string;
	lanes: LaneItem[];
	boardTitle: string;
	boardLead: string;
	cardTypesTitle: string;
	cardTypes: SimpleItem[];
	racesTitle: string;
	races: RaceItem[];
	keywordsTitle: string;
	keywordsLead: string;
	triggersTitle: string;
	triggersLead: string;
	triggers: SimpleItem[];
	devTitle: string;
	devText: string;
	sectionNav: SectionNavItem[];
};

export const HOME_CONTENT: Record<Language, HomeContent> = {
	en: {
		heroTagline:
			"A dark fantasy collectible card game, 1v1, where positioning on the board matters as much as the cards in your hand.",
		heroNewsCta: "See the news",
		heroDecksCta: "Your decks",
		heroWishlistCta: "Wishlist on Steam",
		gameTitle: "The game",
		gameText:
			"Wyrdane is a dark fantasy collectible card game where two players face off 1v1 until one hero's HP hits 0. Minions are deployed across two rows, Front and Back, where position matters as much as the card itself. Four races oppose each other with radically different identities: the Undead thrives on death and infection, Humans fight in disciplined ranks, Demons pay for their power in HP, and Abominations mutate and absorb at random through combat. Building a deck means picking a race and its own mana pool, not just stacking the strongest cards.",
		lanesTitle: "Two rows, a battle of positioning",
		lanes: [
			{
				key: "front",
				name: "Front",
				text: "The front line. As long as it isn't empty, the enemy hero stays out of direct attack range.",
			},
			{
				key: "back",
				name: "Back",
				text: "The support line, protected from regular attacks while the Front holds, but vulnerable to Infiltrate.",
			},
			{
				key: "hybrid",
				name: "Hybrid",
				text: "Some minions can be placed in either the Front or Back row, depending on the strategy of the moment.",
			},
		],
		boardTitle: "The board",
		boardLead: "Hover a zone on the board to learn its role.",
		cardTypesTitle: "Card types",
		cardTypes: [
			{
				id: "serviteur",
				name: "Minion",
				text: "A unit placed in the Front row, Back row, or Hybrid at the player's choice.",
			},
			{ id: "incantation", name: "Instant", text: "A spell with an immediate effect, played then discarded." },
			{
				id: "rituel",
				name: "Ritual",
				text: "A persistent spell with several charges, consumed only when its trigger actually fires.",
			},
			{ id: "enchantement", name: "Enchantment", text: "A permanent passive effect, active until destroyed." },
			{
				id: "ressource",
				name: "Resource",
				text: "A race card that increases that race's mana pool, then leaves the game.",
			},
		],
		racesTitle: "Races, each its own way to play",
		races: [
			{
				key: "undead",
				name: "Undead",
				text:
					"The Undead thrives on death: Infection stacks on enemy minions over time, the Graveyard piles up its own dead, and Sacrifice turns losses into resources. Keywords like Plaguebearer, Necrophage, and Revenant reward a race that never fears losing troops: its own or the enemy's, both feed its strategy.",
			},
			{
				key: "human",
				name: "Human",
				text:
					"Humans fight in tight ranks: Formation strengthens every minion as long as an ally stands beside it, Command grows an entire line with every reinforcement, and Discipline shields it from control effects. A race built on tempo and coordination, where strength comes less from any single minion than from the solidity of the whole line.",
			},
			{
				key: "demon",
				name: "Demon",
				text:
					"Demons pay for their power with their own hero's life: optional Pacts settled in HP, Corruption that permanently wears the enemy down, Infernal Rank that hits harder the more wounded its hero is. Playing Demon means accepting to weaken yourself to strike faster and harder. It's an aggressive gamble that punishes passivity.",
			},
			{
				key: "abomination",
				name: "Abomination",
				text:
					"The Abomination holds no stable form: Mutation reshapes it at random every time it survives a wound, while Fusion and Assimilation let it absorb whatever dies around it, ally or enemy. Every match grows its minions differently, at real risk: mutations can weaken just as easily as they can strengthen.",
			},
		],
		keywordsTitle: "Keywords",
		keywordsLead:
			"Each card can carry one or more keywords that define its behavior in combat: generic keywords, and those specific to each race.",
		triggersTitle: "A trigger for every moment of combat",
		triggersLead:
			"Card effects trigger at precise moments during the turn, allowing for deep synergies between the cards in your deck.",
		triggers: [
			{ id: "t_arrival", name: "Arrival", text: "Triggers when the minion arrives on the battlefield." },
			{
				id: "t_reinforcement",
				name: "Reinforcement",
				text: "Triggers when an allied minion arrives on the battlefield.",
			},
			{ id: "t_deathrattle", name: "Deathrattle", text: "Triggers when the minion dies." },
			{ id: "t_wound", name: "Wounded", text: "Triggers when the minion takes damage without dying." },
			{ id: "t_awaken", name: "Awakening", text: "Triggers at the start of its controller's turn." },
			{ id: "t_decline", name: "Decline", text: "Triggers at the end of its controller's turn." },
			{
				id: "t_attack",
				name: "Attack",
				text: "Triggers when this minion attacks.",
			},
			{ id: "t_grief", name: "Mourning", text: "Triggers when an allied minion dies." },
			{ id: "t_spell", name: "Spell", text: "Triggers when an allied spell is cast." },
			{ id: "t_sacrifice", name: "Sacrifice", text: "Triggers when an allied minion is voluntarily sacrificed." },
			{ id: "t_execution", name: "Execution", text: "Triggers when an enemy minion dies." },
			{ id: "t_carnage", name: "Carnage", text: "Triggers when any minion dies, allied or enemy." },
		],
		devTitle: "Still in development",
		devText:
			"Wyrdane is an indie project actively being built, and cards, mechanics and this very website evolve every week. Some features shown here may still change before release. Follow the Dev Log and our socials to watch it take shape.",
		sectionNav: [
			{ id: "le-jeu", label: "The game" },
			{ id: "lanes", label: "Positioning" },
			{ id: "plateau", label: "The board" },
			{ id: "types-de-cartes", label: "Card types" },
			{ id: "races", label: "Races" },
			{ id: "mots-cles", label: "Keywords" },
			{ id: "declencheurs", label: "Triggers" },
		],
	},
	fr: {
		heroTagline:
			"Un jeu de cartes à collectionner dark fantasy, 1 contre 1, où chaque position sur le plateau compte autant que chaque carte en main.",
		heroNewsCta: "Voir les actualités",
		heroDecksCta: "Vos decks",
		heroWishlistCta: "Wishlist Steam",
		gameTitle: "Le jeu",
		gameText:
			"Wyrdane est un jeu de cartes à collectionner dark fantasy où deux joueurs s'affrontent en 1 contre 1 jusqu'à réduire le héros adverse à 0 point de vie. Les serviteurs se déploient sur deux rangées, Avant et Arrière, où la position compte autant que la carte posée. Quatre races s'opposent avec des identités radicalement différentes : le Mort-Vivant prospère sur la mort et l'infection, l'Humain combat en rangs disciplinés, le Démon paie sa puissance en points de vie, l'Abomination mute et absorbe au hasard des combats. Composer un deck, c'est choisir une race et son propre pool de mana, pas seulement empiler les cartes les plus fortes.",
		lanesTitle: "Deux rangées, une bataille de positionnement",
		lanes: [
			{
				key: "front",
				name: "Avant",
				text: "La ligne de front. Tant qu'elle n'est pas vide, le héros adverse reste hors de portée des attaques directes.",
			},
			{
				key: "back",
				name: "Arrière",
				text: "La ligne de soutien, protégée des attaques classiques tant que l'Avant tient, mais vulnérable à l'Infiltration.",
			},
			{
				key: "hybrid",
				name: "Hybride",
				text: "Certains serviteurs peuvent être posés au choix en Avant ou en Arrière, selon la stratégie du moment.",
			},
		],
		boardTitle: "Le plateau",
		boardLead: "Survole une zone du plateau pour découvrir son rôle.",
		cardTypesTitle: "Les types de cartes",
		cardTypes: [
			{
				id: "serviteur",
				name: "Serviteur",
				text: "Une unité posée en rangée Avant, Arrière, ou en Hybride au choix du joueur.",
			},
			{ id: "incantation", name: "Incantation", text: "Un sort à effet immédiat, joué puis défaussé." },
			{
				id: "rituel",
				name: "Rituel",
				text: "Un sort persistant doté de plusieurs charges, consommées uniquement quand son déclencheur se déclenche vraiment.",
			},
			{ id: "enchantement", name: "Enchantement", text: "Un effet passif permanent, actif jusqu'à sa destruction." },
			{
				id: "ressource",
				name: "Ressource",
				text: "Une carte de race qui augmente le pool de mana de sa race, puis disparaît de la partie.",
			},
		],
		racesTitle: "Des races, chacune sa façon de jouer",
		races: [
			{
				key: "undead",
				name: "Mort-Vivant",
				text:
					"Le Mort-Vivant prospère sur la mort : Infection qui s'accumule sur les serviteurs ennemis, Cimetière où s'entassent ses propres morts, et Sacrifice pour transformer ses pertes en ressource. Des mots-clés comme Pestiféré, Nécrophage ou Revenant récompensent une race qui ne craint jamais de perdre du monde : la sienne comme celle de l'adversaire nourrit sa stratégie.",
			},
			{
				key: "human",
				name: "Humain",
				text:
					"L'Humain combat en rangs serrés : Formation renforce chaque serviteur tant qu'un allié reste à ses côtés, Commandement fait grandir toute une ligne au fil des renforts, et Discipline la protège des effets de contrôle. Une race de tempo et de coordination, où la force vient moins d'un serviteur isolé que de la solidité de l'ensemble.",
			},
			{
				key: "demon",
				name: "Démon",
				text:
					"Les Démons paient leurs pouvoirs avec la vie de leur propre héros : Pactes optionnels réglés en points de vie, Corruption qui ronge durablement l'adversaire, Rang Infernal qui frappe d'autant plus fort que son héros est blessé. Jouer Démon, c'est accepter de s'affaiblir pour frapper plus vite et plus fort. C'est un pari agressif qui punit la passivité.",
			},
			{
				key: "abomination",
				name: "Abomination",
				text:
					"L'Abomination ne connaît aucune forme stable : Mutation la fait évoluer au hasard à chaque blessure survécue, tandis que Fusion et Assimilation lui font absorber ce qui meurt autour d'elle, le sien comme celui de l'adversaire. Chaque partie fait grandir ses serviteurs différemment, au prix d'un vrai risque : les mutations peuvent autant affaiblir que renforcer.",
			},
		],
		keywordsTitle: "Mots-clés",
		keywordsLead:
			"Chaque carte peut porter un ou plusieurs mots-clés qui définissent son comportement au combat : les mots-clés génériques, et ceux propres à chaque race.",
		triggersTitle: "Des déclencheurs pour chaque instant du combat",
		triggersLead:
			"Les effets de carte se déclenchent à des moments précis du tour, ce qui permet de construire des synergies profondes entre les cartes de son deck.",
		triggers: [
			{ id: "t_arrival", name: "Arrivée", text: "Se déclenche quand le serviteur arrive sur le champ de bataille." },
			{
				id: "t_reinforcement",
				name: "Renfort",
				text: "Se déclenche quand un serviteur allié arrive sur le champ de bataille.",
			},
			{ id: "t_deathrattle", name: "Dernier Souffle", text: "Se déclenche quand le serviteur meurt." },
			{ id: "t_wound", name: "Blessure", text: "Se déclenche quand le serviteur subit des dégâts sans en mourir." },
			{ id: "t_awaken", name: "Éveil", text: "Se déclenche au début du tour de son contrôleur." },
			{ id: "t_decline", name: "Déclin", text: "Se déclenche à la fin du tour de son contrôleur." },
			{
				id: "t_attack",
				name: "Attaque",
				text: "Se déclenche quand ce serviteur attaque.",
			},
			{ id: "t_grief", name: "Deuil", text: "Se déclenche quand un serviteur allié meurt." },
			{ id: "t_spell", name: "Sortilège", text: "Se déclenche quand un sort allié est lancé." },
			{ id: "t_sacrifice", name: "Sacrifice", text: "Se déclenche lors du sacrifice volontaire d'un serviteur allié." },
			{ id: "t_execution", name: "Exécution", text: "Se déclenche quand un serviteur ennemi meurt." },
			{ id: "t_carnage", name: "Carnage", text: "Se déclenche quand n'importe quel serviteur meurt, allié ou ennemi." },
		],
		devTitle: "Encore en développement",
		devText:
			"Wyrdane est un projet indépendant en cours de développement actif, les cartes, les mécaniques et ce site lui-même évoluent chaque semaine. Certains éléments présentés ici peuvent encore changer avant la sortie. Suis le Dev Log et nos réseaux pour voir le jeu prendre forme.",
		sectionNav: [
			{ id: "le-jeu", label: "Le jeu" },
			{ id: "lanes", label: "Positionnement" },
			{ id: "plateau", label: "Le plateau" },
			{ id: "types-de-cartes", label: "Types de cartes" },
			{ id: "races", label: "Races" },
			{ id: "mots-cles", label: "Mots-clés" },
			{ id: "declencheurs", label: "Déclencheurs" },
		],
	},
};
