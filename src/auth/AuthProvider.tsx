import { useEffect, useState, type ReactNode } from "react";

import api from "../api";
import { AuthContext, type AuthStatus, type AuthUser } from "./authContext";

// Source unique de l'état de session pour tout le site (Navbar, AuthRequire,
// deck builder...) : un seul appel à /api/auth/authVerif au chargement de
// l'app plutôt qu'un par composant qui en a besoin.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [status, setStatus] = useState<AuthStatus>("checking");
	const [user, setUser] = useState<AuthUser | null>(null);
	const [firstLoginReward, setFirstLoginReward] = useState<number | null>(null);

	function verify() {
		api
			.get("/api/auth/authVerif")
			.then((res) => {
				// Idempotent côté backend (voir hasClaimedStarter) : donne les 4 decks
				// préfaits + cartes de départ dès la première session authentifiée,
				// sans attendre que le joueur ait ouvert le deck builder (même appel
				// que LoadingScreen.gd côté jeu). Ne bloque pas l'affichage si ça échoue.
				api.post("/api/collection/claim-starter").catch(() => {});
				// Idem pour la quête cachée de première connexion Steam (500 or, voir
				// currencyModel.claimFirstLoginReward) : idempotent côté backend, même
				// appel que le client Godot. `credited` ne vaut true qu'au tout premier
				// appel réussi (backend, pas client) : sert de déclencheur au popup de
				// bienvenue plutôt qu'un état posé côté client qui pourrait se
				// déclencher à tort sur un rechargement de page.
				api
					.post("/api/currency/claim-first-login-bonus")
					.then((rewardRes) => {
						if (rewardRes.data?.credited) setFirstLoginReward(rewardRes.data.amount);
					})
					.catch(() => {});
				setUser((res.data?.users as AuthUser | undefined) ?? null);
				setStatus("authed");
			})
			.catch(() => {
				setUser(null);
				setStatus("anon");
			});
	}

	useEffect(verify, []);

	function recheck() {
		setStatus("checking");
		verify();
	}

	async function logout() {
		try {
			await api.get("/api/auth/logout");
		} finally {
			setUser(null);
			setStatus("anon");
		}
	}

	function dismissFirstLoginReward() {
		setFirstLoginReward(null);
	}

	return (
		<AuthContext.Provider
			value={{ status, user, recheck, logout, firstLoginReward, dismissFirstLoginReward }}
		>
			{children}
		</AuthContext.Provider>
	);
};
