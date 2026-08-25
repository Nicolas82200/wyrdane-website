import { useEffect, useRef } from "react";

import { API_URL } from "../api";

const BACKEND_ORIGIN = new URL(API_URL).origin;

// Wyrdane n'a pas de mot de passe : l'auth passe par Steam. Plutôt que de
// naviguer le site entier vers Steam (perte de contexte, retour en pleine
// page), on ouvre une popup vers /api/auth/steam/redirect?popup=1 : le
// backend, une fois la connexion validée, renvoie une petite page qui poste
// un message à cette fenêtre puis se ferme (voir authController.sendPopupResult).
// Extrait de AuthPanel pour être réutilisable ailleurs (Navbar, popup "Mes
// decks") sans dupliquer la logique d'ouverture/écoute de la popup.
export function useSteamLoginPopup(onResult: (success: boolean) => void): () => void {
	const listenerRef = useRef<((event: MessageEvent) => void) | null>(null);

	useEffect(() => {
		return () => {
			if (listenerRef.current) window.removeEventListener("message", listenerRef.current);
		};
	}, []);

	return function openSteamLogin() {
		const width = 480;
		const height = 640;
		const left = window.screenX + (window.outerWidth - width) / 2;
		const top = window.screenY + (window.outerHeight - height) / 2;
		const popup = window.open(
			`${API_URL}/api/auth/steam/redirect?popup=1`,
			"wyrdane-steam-login",
			`width=${width},height=${height},left=${left},top=${top}`,
		);

		// Popup bloquée par le navigateur (rare, mais possible selon les
		// réglages/extensions) : on retombe sur la redirection pleine page
		// plutôt que de laisser le clic sans effet.
		if (!popup) {
			window.location.href = `${API_URL}/api/auth/steam/redirect`;
			return;
		}

		const handleMessage = (event: MessageEvent) => {
			if (event.origin !== BACKEND_ORIGIN) return;
			if (event.data?.source !== "wyrdane-steam-login") return;
			window.removeEventListener("message", handleMessage);
			listenerRef.current = null;
			onResult(event.data.success);
		};
		listenerRef.current = handleMessage;
		window.addEventListener("message", handleMessage);
	};
}
