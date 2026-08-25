import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../auth/useAuth";

interface AuthRequireProps {
	children: ReactNode;
}

// Garde d'accès pour les routes réservées aux joueurs connectés. La
// connexion Steam est désormais toujours disponible depuis la navbar
// (bouton, ou popup déclenchée par le lien "Mes decks") : plus besoin d'un
// panneau de login dédié ici, un visiteur non connecté est simplement
// renvoyé à l'accueil.
const AuthRequire = ({ children }: AuthRequireProps) => {
	const { status } = useAuth();

	// Tant qu'on n'a pas la réponse, on n'affiche pas le contenu protégé
	// (sinon il "flasherait" avant la redirection).
	if (status === "checking") return <p>Chargement…</p>;

	if (status === "anon") return <Navigate to="/" replace />;

	return <>{children}</>;
};

export default AuthRequire;
