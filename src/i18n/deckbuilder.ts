import type { Language } from "./language";

// Contenu texte du deck builder (DeckBuilder.tsx) et de la liste des decks
// (ShowDecks.tsx) - ces deux pages n'avaient jusqu'ici aucun texte routé par
// le système i18n du site (tout en dur en français). Les valeurs contenant
// un espace réservé ("{n}", "{price}"...) sont remplacées avec .replace(),
// même convention que footerRights ("{year}") dans i18n/common.ts.
export const DECKBUILDER_CONTENT = {
	en: {
		loadDeckError: "Couldn't load this deck.",
		loadCardsError: "Couldn't load cards from the Wyrdane database.",
		loadingCards: "Loading cards...",

		back: "← Back",
		titleNew: "Deck Builder",
		titleEdit: "Edit Deck",
		balanceTitle: "Balance",

		searchPlaceholder: "🔍  Search for a card...",

		raceLabel: "Race:",
		typeLabel: "Type:",
		rarityLabel: "Rarity:",
		costLabel: "Cost:",
		all: "All",
		hideLocked: "Hide locked cards",
		keywordLabel: "Keyword:",
		sortLabel: "Sort:",
		sortDefault: "Default",
		sortCost: "Cost",
		sortName: "Name",
		sortRarity: "Rarity",

		buyError: "Purchase failed (insufficient balance or network error).",
		buyLabel: "Buy ({price})",
		noResults: "No card matches these filters.",

		deckNamePlaceholder: "Deck name...",
		playableCount: "{n} playable cards (min {min})",
		resourceCount: "{n} resource cards (min {min})",
		noCardsInDeck: "No cards added yet.",
		removeAllTitle: "Remove all copies of {name}",
		manaCurve: "Mana curve",
		avgCost: "Average cost: {avg}",
		distribution: "Breakdown",
		exportBtn: "Export",
		importBtn: "Import",
		saving: "Saving...",
		saveDeck: "Save deck",
		nameYourDeck: "Please name your deck.",
		minCountsError: "The deck must contain at least {min} playable cards and {minRes} resource cards.",
		fixRaceWarnings: "Fix the race resource warnings before saving.",
		saveGenericError: "Error while saving the deck.",
		raceMissingWarning:
			"Missing resource cards: add at least {needed} {race} resource card(s) to be able to play your cards of this race.",
		raceOrphanWarning: "You have {race} resource cards but no card of that race in the deck.",
		newDeckDefaultName: "New Deck",

		cardLocked: "Card not unlocked",
		cardMaxed: "Maximum number of copies reached",

		exportTitle: "Deck code",
		exportText:
			"Code copied to the clipboard. Share it so someone else can import this deck (website or game).",
		ok: "OK",
		unsavedTitle: "Unsaved changes",
		unsavedText: "You're leaving the deck builder without saving. Do you want to save?",
		discard: "Leave without saving",
		save: "Save",
		importTitle: "Import a deck",
		importText: "Paste a deck code below.",
		invalidCode: "Invalid deck code.",
		cancel: "Cancel",

		loadDecksError: "Couldn't load your decks",
		deleteDeckError: "Couldn't delete this deck",
		decksTitle: "My Decks",
		decksSubtitle: "Choose the deck that will go with you into battle",
		loading: "Loading...",
		emptyState: "No decks yet. Create your first one!",
		cardsCount: "{n} cards",
		removeDeckTitle: "Remove {name}",
		newDeck: "+ New Deck",
	},
	fr: {
		loadDeckError: "Impossible de charger ce deck.",
		loadCardsError: "Impossible de charger les cartes depuis la base Wyrdane.",
		loadingCards: "Chargement des cartes...",

		back: "← Retour",
		titleNew: "Constructeur de Deck",
		titleEdit: "Modifier le Deck",
		balanceTitle: "Solde",

		searchPlaceholder: "🔍  Rechercher une carte...",

		raceLabel: "Race :",
		typeLabel: "Type :",
		rarityLabel: "Rareté :",
		costLabel: "Coût :",
		all: "Tous",
		hideLocked: "Cacher les cartes non débloquées",
		keywordLabel: "Mot-clé :",
		sortLabel: "Trier :",
		sortDefault: "Par défaut",
		sortCost: "Coût",
		sortName: "Nom",
		sortRarity: "Rareté",

		buyError: "Achat impossible (solde insuffisant ou erreur réseau).",
		buyLabel: "Acheter ({price})",
		noResults: "Aucune carte ne correspond à ces filtres.",

		deckNamePlaceholder: "Nom du deck...",
		playableCount: "{n} cartes jouables (min {min})",
		resourceCount: "{n} cartes-ressource (min {min})",
		noCardsInDeck: "Aucune carte ajoutée.",
		removeAllTitle: "Retirer toutes les copies de {name}",
		manaCurve: "Courbe de mana",
		avgCost: "Coût moyen : {avg}",
		distribution: "Répartition",
		exportBtn: "Exporter",
		importBtn: "Importer",
		saving: "Sauvegarde...",
		saveDeck: "Sauvegarder le deck",
		nameYourDeck: "Merci de nommer votre deck.",
		minCountsError:
			"Le deck doit contenir au moins {min} cartes jouables et {minRes} cartes-ressource.",
		fixRaceWarnings: "Corrigez les avertissements de ressources de race avant de sauvegarder.",
		saveGenericError: "Erreur lors de la sauvegarde du deck.",
		raceMissingWarning:
			"Il manque des cartes-ressource : ajoutez au moins {needed} carte(s)-ressource de {race} pour pouvoir jouer vos cartes de cette race.",
		raceOrphanWarning:
			"Vous avez des cartes-ressource de {race} mais aucune carte de cette race dans le deck.",
		newDeckDefaultName: "Nouveau Deck",

		cardLocked: "Carte non débloquée",
		cardMaxed: "Nombre d'exemplaires maximum atteint",

		exportTitle: "Code du deck",
		exportText:
			"Code copié dans le presse-papiers. Partage-le pour que quelqu'un d'autre importe ce deck (site web ou jeu).",
		ok: "OK",
		unsavedTitle: "Modifications non sauvegardées",
		unsavedText:
			"Vous quittez le constructeur de deck mais vous n'avez pas sauvegardé. Voulez-vous sauvegarder ?",
		discard: "Quitter sans sauvegarder",
		save: "Sauvegarder",
		importTitle: "Importer un deck",
		importText: "Colle un code de deck ci-dessous.",
		invalidCode: "Code de deck invalide.",
		cancel: "Annuler",

		loadDecksError: "Impossible de charger vos decks",
		deleteDeckError: "Impossible de supprimer ce deck",
		decksTitle: "Mes Decks",
		decksSubtitle: "Choisis le deck qui t'accompagnera au combat",
		loading: "Chargement...",
		emptyState: "Aucun deck pour l'instant. Crée ton premier deck !",
		cardsCount: "{n} cartes",
		removeDeckTitle: "Retirer {name}",
		newDeck: "+ Nouveau Deck",
	},
} satisfies Record<Language, Record<string, string>>;

export const useDeckBuilderContent = (language: Language) => DECKBUILDER_CONTENT[language];
