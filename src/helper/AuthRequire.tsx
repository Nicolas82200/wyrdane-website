import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import { useIsMobile } from "../hooks/useIsMobile";
import DeckBuilderMobileNotice from "../components/DeckBuilderMobileNotice";

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
	const isMobile = useIsMobile();

	// Le deck builder n'est pas praticable sur petit écran : vérifié avant
	// même l'état de connexion, ça ne sert à rien de demander une session
	// pour afficher un contenu qu'on va de toute façon remplacer.
	if (isMobile) return <DeckBuilderMobileNotice />;

	// Tant qu'on n'a pas la réponse, on n'affiche pas le contenu protégé
	// (sinon il "flasherait" avant la redirection).
	if (status === "checking") return <p>Chargement…</p>;

	if (status === "anon") return <Navigate to="/" replace />;

	return <>{children}</>;
};

export default AuthRequire;
