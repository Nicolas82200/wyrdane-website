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
};

export const AuthContext = createContext<AuthContextValue | null>(null);
