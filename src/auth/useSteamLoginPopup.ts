import { useEffect, useRef, useState } from "react";

import { API_URL } from "../api";

const BACKEND_ORIGIN = new URL(API_URL).origin;

export type SteamLoginPopup = {
	open: () => void;
	// Vrai tant que la popup Steam est ouverte (utilisé pour assombrir le
	// reste de la page derrière elle, façon backdrop de modale, même si la
	// popup est une vraie fenêtre du navigateur qu'on ne peut pas styliser).
	isOpen: boolean;
};

// Wyrdane n'a pas de mot de passe : l'auth passe par Steam. Plutôt que de
// naviguer le site entier vers Steam (perte de contexte, retour en pleine
// page), on ouvre une popup vers /api/auth/steam/redirect?popup=1 : le
// backend, une fois la connexion validée, renvoie une petite page qui poste
// un message à cette fenêtre puis se ferme (voir authController.sendPopupResult).
// Extrait de AuthPanel pour être réutilisable ailleurs (Navbar, popup "Mes
// decks") sans dupliquer la logique d'ouverture/écoute de la popup.
export function useSteamLoginPopup(onResult: (success: boolean) => void): SteamLoginPopup {
	const [isOpen, setIsOpen] = useState(false);
	const listenerRef = useRef<((event: MessageEvent) => void) | null>(null);
	const pollRef = useRef<number | null>(null);

	function cleanup() {
		if (listenerRef.current) {
			window.removeEventListener("message", listenerRef.current);
			listenerRef.current = null;
		}
		if (pollRef.current !== null) {
			window.clearInterval(pollRef.current);
			pollRef.current = null;
		}
		setIsOpen(false);
	}

	useEffect(() => cleanup, []);

	function open() {
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

		setIsOpen(true);

		const handleMessage = (event: MessageEvent) => {
			if (event.origin !== BACKEND_ORIGIN) return;
			if (event.data?.source !== "wyrdane-steam-login") return;
			cleanup();
			onResult(event.data.success);
		};
		listenerRef.current = handleMessage;
		window.addEventListener("message", handleMessage);

		// Le joueur peut fermer la popup lui-même sans terminer la connexion
		// (croix de la fenêtre) : aucun message n'arrive alors jamais, donc on
		// sonde périodiquement popup.closed pour quand même lever le fond
		// assombri plutôt que de le laisser bloqué indéfiniment.
		pollRef.current = window.setInterval(() => {
			if (popup.closed) cleanup();
		}, 500);
	}

	return { open, isOpen };
}
