import type { Language } from "./language";

export type SimpleItem = { name: string; text: string };
export type LaneItem = { key: "front" | "back" | "hybrid"; name: string; text: string };
export type RaceItem = { key: string; name: string; text: string };
export type ComingSoonSection = { title: string; text: string; badge: string };

export type HomeContent = {
	heroTagline: string;
	heroNewsCta: string;
	gameTitle: string;
	gameText: string;
	lanesTitle: string;
	lanes: LaneItem[];
	cardTypesTitle: string;
	cardTypes: SimpleItem[];
	boardTitle: string;
	boardLead: string;
	keywordsTitle: string;
	keywordsLead: string;
	triggersTitle: string;
	triggersLead: string;
	triggers: SimpleItem[];
	racesTitle: string;
	races: RaceItem[];
	devTitle: string;
	devText: string;
	deckSection: ComingSoonSection;
	playSection: ComingSoonSection;
};

export const HOME_CONTENT: Record<Language, HomeContent> = {
	en: {
		heroTagline:
			"A dark fantasy collectible card game, 1v1, where positioning on the board matters as much as the cards in your hand.",
		heroNewsCta: "See the news",
		gameTitle: "The game",
		gameText:
			"Two players fight to reduce the enemy hero to 0 HP. Each side deploys its minions across two positional rows, Front and Back, and builds its deck around one of the game's races, each with its own keywords, mana pool, and playstyle.",
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
		cardTypesTitle: "Card types",
		cardTypes: [
			{
				name: "Minion",
				text: "A unit placed in the Front row, Back row, or Hybrid at the player's choice.",
			},
			{ name: "Instant", text: "A spell with an immediate effect, played then discarded." },
			{
				name: "Ritual",
				text: "A persistent spell with several charges, consumed only when its trigger actually fires.",
			},
			{ name: "Enchantment", text: "A permanent passive effect, active until destroyed." },
			{
				name: "Resource",
				text: "A race card that increases that race's mana pool, then leaves the game.",
			},
		],
		boardTitle: "The board",
		boardLead: "Hover a zone on the board to learn its role.",
		keywordsTitle: "Keywords",
		keywordsLead:
			"Each card can carry one or more keywords that define its behavior in combat: generic keywords, and those specific to each race.",
		triggersTitle: "A trigger for every moment of combat",
		triggersLead:
			"Card effects trigger at precise moments during the turn, allowing for deep synergies between the cards in your deck.",
		triggers: [
			{ name: "Arrival", text: "Triggers when the minion arrives on the battlefield." },
			{
				name: "Reinforcement",
				text: "Triggers when an allied minion arrives on the battlefield.",
			},
			{ name: "Deathrattle", text: "Triggers when the minion dies." },
			{ name: "Charge", text: "Lets the minion attack the turn it's summoned." },
			{ name: "Wound", text: "Triggers when the minion takes damage without dying." },
			{ name: "Awaken", text: "Triggers at the start of its controller's turn." },
			{ name: "Decline", text: "Triggers at the end of its controller's turn." },
			{
				name: "Rally",
				text: "Triggers when another allied minion arrives on the battlefield.",
			},
			{ name: "Grief", text: "Triggers when an allied minion dies." },
			{ name: "Spell", text: "Triggers when an allied spell is cast." },
			{ name: "Sacrifice", text: "Triggers when an allied minion is voluntarily sacrificed." },
			{ name: "Execution", text: "Triggers when an enemy minion dies." },
			{ name: "Carnage", text: "Triggers when any minion dies, allied or enemy." },
		],
		racesTitle: "Races, each its own way to play",
		races: [
			{
				key: "undead",
				name: "Undead",
				text: "Infection, Graveyard and Sacrifice: a race that thrives on death, its own as well as its opponent's.",
			},
			{
				key: "human",
				name: "Human",
				text: "Discipline and Formation: tightly-knit lines where every reinforcement makes the ranks stronger.",
			},
			{
				key: "demon",
				name: "Demon",
				text: "Pacts and self-inflicted damage: raw power paid for in its own hero's blood.",
			},
			{
				key: "abomination",
				name: "Abomination",
				text: "Mutation, Fusion, Devour: unstable creatures that transform with every fight.",
			},
		],
		devTitle: "Still in development",
		devText:
			"Wyrdane is an indie project actively being built, and cards, mechanics and this very website evolve every week. Some features shown here may still change before release. Follow the Dev Log and our socials to watch it take shape.",
		deckSection: {
			title: "Build your deck",
			text: "Compose your deck from the game's races and their keywords. Decks built here will be directly usable in the game, ready for when the deck builder opens up.",
			badge: "Coming soon",
		},
		playSection: {
			title: "Play a match",
			text: "Log in with Steam and face other players 1v1, putting your deck to the test.",
			badge: "Coming soon on Steam",
		},
	},
	fr: {
		heroTagline:
			"Un jeu de cartes à collectionner dark fantasy, 1 contre 1, où chaque position sur le plateau compte autant que chaque carte en main.",
		heroNewsCta: "Voir les actualités",
		gameTitle: "Le jeu",
		gameText:
			"Deux joueurs s'affrontent pour réduire le héros adverse à 0 HP. Chaque camp déploie ses serviteurs sur deux rangées positionnelles, Avant et Arrière, et compose son deck autour d'une des races du jeu, chacune avec ses propres mots-clés, son propre pool de mana et sa propre façon de jouer.",
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
		cardTypesTitle: "Les types de cartes",
		cardTypes: [
			{
				name: "Serviteur",
				text: "Une unité posée en rangée Avant, Arrière, ou en Hybride au choix du joueur.",
			},
			{ name: "Éphémère", text: "Un sort à effet immédiat, joué puis défaussé." },
			{
				name: "Rituel",
				text: "Un sort persistant doté de plusieurs charges, consommées uniquement quand son déclencheur se déclenche vraiment.",
			},
			{ name: "Enchantement", text: "Un effet passif permanent, actif jusqu'à sa destruction." },
			{
				name: "Ressource",
				text: "Une carte de race qui augmente le pool de mana de sa race, puis disparaît de la partie.",
			},
		],
		boardTitle: "Le plateau",
		boardLead: "Survole une zone du plateau pour découvrir son rôle.",
		keywordsTitle: "Mots-clés",
		keywordsLead:
			"Chaque carte peut porter un ou plusieurs mots-clés qui définissent son comportement au combat : les mots-clés génériques, et ceux propres à chaque race.",
		triggersTitle: "Des déclencheurs pour chaque instant du combat",
		triggersLead:
			"Les effets de carte se déclenchent à des moments précis du tour, ce qui permet de construire des synergies profondes entre les cartes de son deck.",
		triggers: [
			{ name: "Arrivée", text: "Se déclenche quand le serviteur arrive sur le champ de bataille." },
			{
				name: "Renfort",
				text: "Se déclenche quand un serviteur allié arrive sur le champ de bataille.",
			},
			{ name: "Dernier Souffle", text: "Se déclenche quand le serviteur meurt." },
			{ name: "Assaut", text: "Permet au serviteur d'attaquer dès le tour où il est invoqué." },
			{ name: "Blessure", text: "Se déclenche quand le serviteur subit des dégâts sans en mourir." },
			{ name: "Éveil", text: "Se déclenche au début du tour de son contrôleur." },
			{ name: "Déclin", text: "Se déclenche à la fin du tour de son contrôleur." },
			{
				name: "Ralliement",
				text: "Se déclenche quand un autre serviteur allié arrive sur le champ de bataille.",
			},
			{ name: "Deuil", text: "Se déclenche quand un serviteur allié meurt." },
			{ name: "Sortilège", text: "Se déclenche quand un sort allié est lancé." },
			{ name: "Sacrifice", text: "Se déclenche lors du sacrifice volontaire d'un serviteur allié." },
			{ name: "Exécution", text: "Se déclenche quand un serviteur ennemi meurt." },
			{ name: "Carnage", text: "Se déclenche quand n'importe quel serviteur meurt, allié ou ennemi." },
		],
		racesTitle: "Des races, chacune sa façon de jouer",
		races: [
			{
				key: "undead",
				name: "Mort-Vivant",
				text: "Infection, Cimetière et Sacrifice : une race qui prospère sur la mort, la sienne comme celle de l'adversaire.",
			},
			{
				key: "human",
				name: "Humain",
				text: "Discipline et Formation : des lignes soudées où chaque renfort rend les rangs plus forts.",
			},
			{
				key: "demon",
				name: "Démon",
				text: "Pactes et dégâts auto-infligés : une puissance brute payée au prix du sang de son propre héros.",
			},
			{
				key: "abomination",
				name: "Abomination",
				text: "Mutation, Fusion, Dévoration : des créatures instables qui se transforment à chaque combat.",
			},
		],
		devTitle: "Encore en développement",
		devText:
			"Wyrdane est un projet indépendant en cours de développement actif, les cartes, les mécaniques et ce site lui-même évoluent chaque semaine. Certains éléments présentés ici peuvent encore changer avant la sortie. Suis le Dev Log et nos réseaux pour voir le jeu prendre forme.",
		deckSection: {
			title: "Compose ton deck",
			text: "Assemble ton deck parmi les races du jeu et leurs mots-clés. Les decks créés ici seront directement utilisables dans le jeu, prêts pour l'ouverture du deck builder.",
			badge: "Bientôt disponible",
		},
		playSection: {
			title: "Joue une partie",
			text: "Connecte-toi avec Steam et affronte d'autres joueurs en 1 contre 1 pour mettre ton deck à l'épreuve.",
			badge: "Bientôt disponible sur Steam",
		},
	},
};
