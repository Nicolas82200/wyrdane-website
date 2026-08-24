import { useEffect, useRef, useState } from "react";

import { API_URL } from "../api";
import { useLanguage } from "../i18n/useLanguage";
import { PAGES_CONTENT } from "../i18n/pages";

import "./AuthPanel.css";

type AuthPanelProps = {
	onCancel: () => void;
	// Appelé une fois la session posée côté backend (popup fermée avec
	// succès). Optionnel : si absent, on se contente de fermer la popup
	// (le composant appelant peut préférer re-vérifier la session lui-même).
	onSuccess?: () => void;
};

const BACKEND_ORIGIN = new URL(API_URL).origin;

// Wyrdane n'a pas de mot de passe : l'auth passe par Steam. Plutôt que de
// naviguer le site entier vers Steam (perte de contexte, retour en pleine
// page), on ouvre une popup vers /api/auth/steam/redirect?popup=1 : le
// backend, une fois la connexion validée, renvoie une petite page qui poste
// un message à cette fenêtre puis se ferme (voir authController.sendPopupResult).
const AuthPanel = ({ onCancel, onSuccess }: AuthPanelProps) => {
	const { language } = useLanguage();
	const t = PAGES_CONTENT[language].auth;
	const [error, setError] = useState(false);
	const listenerRef = useRef<((event: MessageEvent) => void) | null>(null);

	useEffect(() => {
		return () => {
			if (listenerRef.current) window.removeEventListener("message", listenerRef.current);
		};
	}, []);

	const handleSteamLogin = () => {
		setError(false);
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
			if (event.data.success) onSuccess?.();
			else setError(true);
		};
		listenerRef.current = handleMessage;
		window.addEventListener("message", handleMessage);
	};

	return (
		<div className="auth-panel">
			<button type="button" className="auth-back" onClick={onCancel}>
				{t.back}
			</button>

			<h2>{t.title}</h2>

			{error && <p className="modal-error">{t.steamLoginError}</p>}

			<button type="button" className="btn btn-primary" onClick={handleSteamLogin}>
				{t.steamLogin}
			</button>
		</div>
	);
};

export default AuthPanel;
