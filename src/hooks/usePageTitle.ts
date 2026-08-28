import { useEffect } from "react";

// "Wyrdane | <page>" partout, sauf l'accueil qui reste juste "Wyrdane"
// (aucun titre passé) - même ordre que le nom du site affiché par Google
// dans les résultats de recherche, voir aussi le WebSite JSON-LD dans
// index.html pour ce même nom.
export function usePageTitle(title?: string) {
	useEffect(() => {
		document.title = title ? `Wyrdane | ${title}` : "Wyrdane";
	}, [title]);
}
