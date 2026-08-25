import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import AuthPanel from "../components/AuthPanel";
import { useAuth } from "../auth/useAuth";

interface AuthRequireProps {
	children: ReactNode;
}

// Composant "garde" : enveloppe une page à protéger. L'état de session
// (checking/authed/anon) vient du AuthProvider global (un seul appel à
// /api/auth/authVerif pour tout le site, voir main.tsx) plutôt que d'être
// re-vérifié ici à chaque montage.
const AuthRequire = ({ children }: AuthRequireProps) => {
	const { status, recheck } = useAuth();
	const navigate = useNavigate();

	// Tant qu'on n'a pas la réponse, on n'affiche pas le contenu protégé
	// (sinon il "flasherait" avant d'afficher le panneau de connexion).
	if (status === "checking") return <p>Chargement…</p>;

	// Pas de session valide : propose de se connecter directement ici plutôt
	// que de rediriger silencieusement vers l'accueil. onSuccess (popup Steam
	// résolue) redemande l'état de session plutôt que de recharger la page.
	if (status === "anon") return <AuthPanel onCancel={() => navigate("/")} onSuccess={recheck} />;

	return <>{children}</>;
};

export default AuthRequire;
