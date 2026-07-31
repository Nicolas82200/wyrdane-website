import { useEffect, useState, type ReactNode } from "react";

import { LanguageContext, type Language } from "./language";

const STORAGE_KEY = "wyrdane-language";

const readInitialLanguage = (): Language => {
	const stored = localStorage.getItem(STORAGE_KEY);
	return stored === "fr" ? "fr" : "en";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const [language, setLanguageState] = useState<Language>(readInitialLanguage);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, language);
		document.documentElement.lang = language;
	}, [language]);

	const setLanguage = (lang: Language) => setLanguageState(lang);

	return (
		<LanguageContext.Provider value={{ language, setLanguage }}>
			{children}
		</LanguageContext.Provider>
	);
};
