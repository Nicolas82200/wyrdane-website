import { useEffect, useState, type ReactNode } from "react";

import { LanguageContext, type Language } from "./language";

const STORAGE_KEY = "wyrdane-language";

const readInitialLanguage = (): Language => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored === "fr" ? "fr" : "en";
	} catch {
		return "en";
	}
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const [language, setLanguageState] = useState<Language>(readInitialLanguage);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, language);
		} catch {
			// localStorage indisponible (navigation privée stricte, cookies
			// tiers bloqués...) : la langue reste effective pour cette session,
			// simplement pas mémorisée pour la prochaine visite.
		}
		document.documentElement.lang = language;
	}, [language]);

	const setLanguage = (lang: Language) => setLanguageState(lang);

	return (
		<LanguageContext.Provider value={{ language, setLanguage }}>
			{children}
		</LanguageContext.Provider>
	);
};
