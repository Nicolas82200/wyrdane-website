import { createContext } from "react";

export type AuthUser = { id: number; name: string };
export type AuthStatus = "checking" | "authed" | "anon";

export type AuthContextValue = {
	status: AuthStatus;
	user: AuthUser | null;
	// Redemande l'état de session au backend (après une connexion réussie,
	// ou après un logout) plutôt que de recharger la page.
	recheck: () => void;
	logout: () => Promise<void>;
	// Montant de la quête cachée de première connexion (500 or, voir
	// currencyModel.claimFirstLoginReward côté backend) une fois créditée sur
	// CE chargement de page, null sinon (jamais reclaimé : le backend renvoie
	// credited:false dès le second appel, voir AuthProvider.verify).
	firstLoginReward: number | null;
	dismissFirstLoginReward: () => void;
	// Solde de monnaie molle affiché à côté du pseudo dans la navbar. null
	// tant qu'il n'a pas encore été chargé (anonyme, ou requête en cours).
	balance: number | null;
	// Recharge le solde depuis le backend (après un achat de carte dans le
	// deck builder, par ex.) plutôt que de dupliquer l'état localement.
	refreshBalance: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
