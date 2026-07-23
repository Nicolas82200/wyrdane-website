import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";

interface AuthRequireProps {
	children: ReactNode;
}

// Composant "garde" : enveloppe une page à protéger.
// Il demande au back si la session est valide AVANT d'afficher le contenu.
const AuthRequire = ({ children }: AuthRequireProps) => {
	const [checking, setChecking] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		api
			.get("/api/auth/authVerif")
			.then(() => setChecking(false))
			.catch(() => navigate("/"));
	}, [navigate]);

	// Tant qu'on n'a pas la réponse, on n'affiche pas le contenu protégé
	// (sinon il "flasherait" avant la redirection).
	if (checking) return <p>Chargement…</p>;

	return <>{children}</>;
};

export default AuthRequire;
