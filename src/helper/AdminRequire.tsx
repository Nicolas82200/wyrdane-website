import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";
import AuthPanel from "../components/AuthPanel";

interface AdminRequireProps {
	children: ReactNode;
}

// Garde de /admin : vérifie côté backend (GET /api/admin/me, protégé par
// authorization + requireAdmin) plutôt que de se fier à un flag côté client,
// qu'il serait trivial de falsifier. Trois issues possibles : pas connecté du
// tout (401), connecté mais pas admin (403), ou admin confirmé (200).
const AdminRequire = ({ children }: AdminRequireProps) => {
	const [status, setStatus] = useState<"checking" | "admin" | "anon" | "forbidden">("checking");
	const navigate = useNavigate();

	// N'assigne jamais "checking" elle-même (déjà l'état initial au montage) :
	// c'est à l'appelant de le faire avant d'invoquer verify si besoin (voir
	// recheck, utilisé après une reconnexion réussie en popup).
	function verify() {
		api
			.get("/api/admin/me")
			.then(() => setStatus("admin"))
			.catch((err) => {
				setStatus(err?.response?.status === 401 ? "anon" : "forbidden");
			});
	}

	useEffect(verify, []);

	function recheck() {
		setStatus("checking");
		verify();
	}

	if (status === "checking") return <p>Chargement…</p>;
	if (status === "anon") return <AuthPanel onCancel={() => navigate("/")} onSuccess={recheck} />;
	if (status === "forbidden") {
		return (
			<div style={{ padding: 48, textAlign: "center", color: "var(--gold)" }}>
				<p>Accès réservé.</p>
			</div>
		);
	}

	return <>{children}</>;
};

export default AdminRequire;
