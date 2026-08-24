import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import api from "../api";

// Alimente le dashboard admin (visites/visiteurs uniques, voir Admin.tsx) :
// un appel par navigation, y compris les changements de route côté client
// (SPA, pas de rechargement de page). Best-effort, ne bloque jamais l'affichage.
export function usePageviewTracking() {
	const location = useLocation();

	useEffect(() => {
		api.post("/api/analytics/pageview", { path: location.pathname }).catch(() => {});
	}, [location.pathname]);
}
