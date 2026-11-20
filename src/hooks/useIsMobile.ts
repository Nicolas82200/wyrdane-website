import { useCallback, useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 760px)";

// useSyncExternalStore plutôt qu'un useState + useEffect : une media query EST
// un store externe, et le lire ainsi évite le setState dans l'effet qu'il
// fallait sinon pour resynchroniser l'état quand `query` change (l'initialiseur
// de useState, lui, ne rejoue jamais) — exactement ce que la règle
// react-hooks/set-state-in-effect interdit.
export const useIsMobile = (query: string = MOBILE_QUERY) => {
	const subscribe = useCallback(
		(onStoreChange: () => void) => {
			const mql = window.matchMedia(query);
			mql.addEventListener("change", onStoreChange);
			return () => mql.removeEventListener("change", onStoreChange);
		},
		[query],
	);

	return useSyncExternalStore(
		subscribe,
		() => window.matchMedia(query).matches,
		// Pas de window au rendu hors navigateur (scripts/generate-og-pages.mjs) :
		// on y part du cas large, le client corrige à l'hydratation.
		() => false,
	);
};
