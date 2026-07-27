import type { Language } from "./language";

export const COMMON = {
	en: {
		navHome: "Home",
		navNews: "News",
		navDevLog: "Dev Log",
		navPlay: "Play",
		footerTagline: "Wyrdane, a dark fantasy card game in development.",
	},
	fr: {
		navHome: "Accueil",
		navNews: "Actualités",
		navDevLog: "Dev Log",
		navPlay: "Jouer",
		footerTagline: "Wyrdane, jeu de cartes dark fantasy en développement.",
	},
} satisfies Record<Language, Record<string, string>>;

export const useCommon = (language: Language) => COMMON[language];
