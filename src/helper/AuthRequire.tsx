import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";
import AuthPanel from "../components/AuthPanel";

interface AuthRequireProps {
	children: ReactNode;
}

// Composant "garde" : enveloppe une page à protéger.
// Il demande au back si la session est valide AVANT d'afficher le contenu.
const AuthRequire = ({ children }: AuthRequireProps) => {
	const [status, setStatus] = useState<"checking" | "authed" | "anon">("checking");
	const navigate = useNavigate();

	// N'assigne jamais "checking" elle-même (déjà l'état initial au montage) :
	// c'est à l'appelant de le faire avant d'invoquer verify si besoin (voir
	// recheck, utilisé après une reconnexion réussie en popup).
	function verify() {
		api
			.get("/api/auth/authVerif")
			.then(() => {
				// Idempotent côté backend (voir hasClaimedStarter) : donne les 4 decks
				// préfaits + cartes de départ dès la première session authentifiée,
				// sans attendre que le joueur ait lancé le jeu (même appel que
				// LoadingScreen.gd côté jeu). Ne bloque pas l'affichage si ça échoue.
				api.post("/api/collection/claim-starter").catch(() => {});
				// Idem pour la quête cachée de première connexion Steam (500 or,
				// voir currencyModel.claimFirstLoginReward) : idempotent côté
				// backend, même appel que le client Godot.
				api.post("/api/currency/claim-first-login-bonus").catch(() => {});
				setStatus("authed");
			})
			.catch(() => setStatus("anon"));
	}

	useEffect(verify, []);

	function recheck() {
		setStatus("checking");
		verify();
	}

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
