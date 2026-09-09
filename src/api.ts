import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	// Exigé par le backend (wyrdane-backend, middleware/csrf.ts) sur toute
	// route authentifiée par cookie : force un préflight CORS qu'un
	// formulaire/fetch externe ne peut pas satisfaire (le cookie de session
	// est SameSite=None+Secure en production, site et API étant sur des
	// domaines différents).
	headers: {
		"X-Requested-With": "XMLHttpRequest",
	},
});

export default api;
