import { createContext } from "react";

export type Language = "en" | "fr";

export type LanguageContextValue = {
	language: Language;
	setLanguage: (lang: Language) => void;
};

export const LanguageContext = createContext<LanguageContextValue | null>(null);
