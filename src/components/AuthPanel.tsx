import { useState } from "react";

import { useLanguage } from "../i18n/useLanguage";
import { PAGES_CONTENT } from "../i18n/pages";
import { useSteamLoginPopup } from "../auth/useSteamLoginPopup";
import Portal from "./Portal";

import "./AuthPanel.css";

type AuthPanelProps = {
	onCancel: () => void;
	// Appelé une fois la session posée côté backend (popup fermée avec
	// succès). Optionnel : si absent, on se contente de fermer la popup
	// (le composant appelant peut préférer re-vérifier la session lui-même).
	onSuccess?: () => void;
};

const AuthPanel = ({ onCancel, onSuccess }: AuthPanelProps) => {
	const { language } = useLanguage();
	const t = PAGES_CONTENT[language].auth;
	const [error, setError] = useState(false);

	const { open: openSteamLogin, isOpen } = useSteamLoginPopup((success) => {
		if (success) onSuccess?.();
		else setError(true);
	});

	const handleSteamLogin = () => {
		setError(false);
		openSteamLogin();
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

			{isOpen && (
				<Portal>
					<div className="steam-login-overlay">
						<p>{t.steamLoginPending}</p>
					</div>
				</Portal>
			)}
		</div>
	);
};

export default AuthPanel;
