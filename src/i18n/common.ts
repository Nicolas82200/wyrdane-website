import type { Language } from "./language";

export const COMMON = {
	en: {
		navHome: "Home",
		navNews: "News",
		navDevLog: "Dev Log",
		navPlay: "Play",
		navContact: "Contact",
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
		footerTagline: "Wyrdane, jeu de cartes dark fantasy en développement.",
		footerLegalNotice: "Mentions légales",
		footerTerms: "CGU",
		footerPrivacy: "Confidentialité",
		footerSales: "CGV",
		footerRights: "© {year} Wyrdane. Tous droits réservés.",
	},
} satisfies Record<Language, Record<string, string>>;

export const useCommon = (language: Language) => COMMON[language];
