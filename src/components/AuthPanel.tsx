import { API_URL } from "../api";

import "./AuthPanel.css";

type AuthPanelProps = {
	onCancel: () => void;
};

// Wyrdane n'a pas de mot de passe : l'auth passe par Steam. On redirige le
// navigateur vers /api/auth/steam/redirect qui lance le flow OpenID côté
// Steam ; le backend renvoie ensuite ici une fois la session posée (cookie).
const AuthPanel = ({ onCancel }: AuthPanelProps) => {
	const handleSteamLogin = () => {
		window.location.href = `${API_URL}/api/auth/steam/redirect`;
	};

	return (
		<div className="auth-panel">
			<button type="button" className="auth-back" onClick={onCancel}>
				← Retour
			</button>

			<h2>Connectez-vous</h2>

			<button type="button" className="btn btn-primary" onClick={handleSteamLogin}>
				Se connecter avec Steam
			</button>
		</div>
	);
};

export default AuthPanel;
