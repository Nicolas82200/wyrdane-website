import type { Language } from "./language";

export type BoardZoneText = { label: string; text: string };

export type BoardContent = {
	legendEnemy: string;
	legendPlayer: string;
	zones: Record<string, BoardZoneText>;
};

export const BOARD_CONTENT: Record<Language, BoardContent> = {
	en: {
		legendEnemy: "Enemy zones",
		legendPlayer: "Your zones",
		zones: {
			"enemy-hero": {
				label: "Enemy hero",
				text: "The opposing hero. The first side to bring it to 0 HP wins the game.",
			},
			"enemy-back": {
				label: "Enemy Back row",
				text: "The opponent's support line, safe from regular attacks, except for the Infiltrate keyword, which can target it directly.",
			},
			"enemy-front": {
				label: "Enemy Front row",
				text: "The opponent's front line. As long as it isn't empty, the enemy hero stays out of direct attack range.",
			},
			"enemy-enchantment": {
				label: "Enemy Enchantments",
				text: "The opponent's active permanent passive effects, in play until destroyed.",
			},
			"enemy-ritual": {
				label: "Enemy Rituals",
				text: "The opponent's ongoing Ritual spells, with their remaining charges.",
			},
			"enemy-graveyard": {
				label: "Enemy graveyard",
				text: "The pile of the opponent's dead minions, a key resource for an Undead deck (Sacrifice, Necrophage...).",
			},
			"enemy-deck": {
				label: "Enemy deck",
				text: "The opponent's draw pile. The enemy automatically draws a card at the start of their turn.",
			},
			"player-front": {
				label: "Front row",
				text: "Your front line. As long as it isn't empty, the enemy hero stays out of direct attack range.",
			},
			"player-back": {
				label: "Back row",
				text: "Your support line, safe from regular attacks, except for the Infiltrate keyword.",
			},
			"player-hero": {
				label: "Your hero",
				text: "Your hero. If it falls to 0 HP, the game is lost.",
			},
			"player-deck": {
				label: "Your deck",
				text: "Your draw pile. A card is drawn automatically at the start of each turn.",
			},
			"player-graveyard": {
				label: "Your graveyard",
				text: "The pile of your dead minions, central to Undead synergies (Sacrifice, Necrophage...).",
			},
			"player-ritual": {
				label: "Your Rituals",
				text: "Your ongoing Ritual spells, with their remaining charges.",
			},
			"player-enchantment": {
				label: "Your Enchantments",
				text: "Your active permanent passive effects, in play until destroyed.",
			},
		},
	},
	fr: {
		legendEnemy: "Zones ennemies",
		legendPlayer: "Vos zones",
		zones: {
			"enemy-hero": {
				label: "Héros ennemi",
				text: "Le héros adverse. Le premier camp à le réduire à 0 HP remporte la partie.",
			},
			"enemy-back": {
				label: "Rangée Arrière ennemie",
				text: "La ligne de soutien adverse, à l'abri des attaques classiques, sauf du mot-clé Infiltration, qui peut la viser directement.",
			},
			"enemy-front": {
				label: "Rangée Avant ennemie",
				text: "La ligne de front adverse. Tant qu'elle n'est pas vide, le héros ennemi reste hors de portée directe.",
			},
			"enemy-enchantment": {
				label: "Enchantements ennemis",
				text: "Les effets passifs permanents actifs du camp adverse, actifs jusqu'à leur destruction.",
			},
			"enemy-ritual": {
				label: "Rituels ennemis",
				text: "Les sorts Rituel adverses en cours, avec leurs charges restantes.",
			},
			"enemy-graveyard": {
				label: "Cimetière ennemi",
				text: "La pile des serviteurs adverses morts, une ressource clé pour un deck Mort-Vivant (Sacrifice, Nécrophage...).",
			},
			"enemy-deck": {
				label: "Deck ennemi",
				text: "La pioche adverse. L'ennemi pioche automatiquement une carte au début de son tour.",
			},
			"player-front": {
				label: "Rangée Avant",
				text: "Votre ligne de front. Tant qu'elle n'est pas vide, le héros adverse reste hors de portée directe.",
			},
			"player-back": {
				label: "Rangée Arrière",
				text: "Votre ligne de soutien, à l'abri des attaques classiques, sauf du mot-clé Infiltration.",
			},
			"player-hero": {
				label: "Votre héros",
				text: "Votre héros. S'il tombe à 0 HP, la partie est perdue.",
			},
			"player-deck": {
				label: "Votre deck",
				text: "Votre pioche. Une carte est piochée automatiquement au début de chaque tour.",
			},
			"player-graveyard": {
				label: "Votre cimetière",
				text: "La pile de vos serviteurs morts, au cœur des synergies Mort-Vivant (Sacrifice, Nécrophage...).",
			},
			"player-ritual": {
				label: "Vos rituels",
				text: "Vos sorts Rituel en cours, avec leurs charges restantes.",
			},
			"player-enchantment": {
				label: "Vos enchantements",
				text: "Vos effets passifs permanents, actifs jusqu'à leur destruction.",
			},
		},
	},
};
