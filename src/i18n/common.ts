import type { Language } from "./language";

export const COMMON = {
	en: {
		navHome: "Home",
		navNews: "News",
		navDevLog: "Dev Log",
		navPlay: "Play",
		navContact: "Contact",
		navMyDecks: "My decks",
		navLogout: "Log out",
		navDecksLoginRequired: "Log in with Steam to access your decks.",
		navModalClose: "Close",
		navBalance: "Gold balance",
		firstLoginRewardTitle: "Welcome to Wyrdane!",
		firstLoginRewardText: "Here's {amount} gold for your very first login.",
		firstLoginRewardClaim: "Claim",
		deckBuilderMobileTitle: "Desktop only, for now",
		deckBuilderMobileText:
			"The deck builder isn't adapted to small screens yet. Come back on a computer to build and manage your decks.",
		footerTagline: "Wyrdane, a dark fantasy card game in development.",
		footerLegalNotice: "Legal Notice",
		footerTerms: "Terms of Use",
		footerPrivacy: "Privacy Policy",
		footerSales: "Terms of Sale",
		footerRights: "© {year} Wyrdane. All rights reserved.",
	},
	fr: {
		navHome: "Accueil",
		navNews: "Actualités",
		navDevLog: "Dev Log",
		navPlay: "Jouer",
		navContact: "Nous contacter",
		navMyDecks: "Mes decks",
		navLogout: "Se déconnecter",
		navDecksLoginRequired: "Connecte-toi avec Steam pour accéder à tes decks.",
		navModalClose: "Fermer",
		navBalance: "Solde en or",
		firstLoginRewardTitle: "Bienvenue sur Wyrdane !",
		firstLoginRewardText: "Voici {amount} pièces d'or pour ta toute première connexion.",
		firstLoginRewardClaim: "Récupérer",
		deckBuilderMobileTitle: "Disponible sur ordinateur uniquement",
		deckBuilderMobileText:
			"Le deck builder n'est pas encore adapté aux petits écrans. Reviens depuis un ordinateur pour composer et gérer tes decks.",
		footerTagline: "Wyrdane, jeu de cartes dark fantasy en développement.",
		footerLegalNotice: "Mentions légales",
		footerTerms: "CGU",
		footerPrivacy: "Confidentialité",
		footerSales: "CGV",
		footerRights: "© {year} Wyrdane. Tous droits réservés.",
	},
} satisfies Record<Language, Record<string, string>>;

export const useCommon = (language: Language) => COMMON[language];
