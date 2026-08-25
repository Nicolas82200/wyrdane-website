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
		footerTagline: "Wyrdane, jeu de cartes dark fantasy en développement.",
		footerLegalNotice: "Mentions légales",
		footerTerms: "CGU",
		footerPrivacy: "Confidentialité",
		footerSales: "CGV",
		footerRights: "© {year} Wyrdane. Tous droits réservés.",
	},
} satisfies Record<Language, Record<string, string>>;

export const useCommon = (language: Language) => COMMON[language];
