import type { Language } from "./language";

export type PagesContent = {
	play: {
		title: string;
		steamSoonTitle: string;
		steamSoonText: string;
		steamLink: string;
		backHome: string;
	};
	auth: {
		back: string;
		title: string;
		steamLogin: string;
	};
	news: {
		title: string;
		subtitle: string;
	};
	devLog: {
		title: string;
		subtitle: string;
	};
};

export const PAGES_CONTENT: Record<Language, PagesContent> = {
	en: {
		play: {
			title: "WYRDANE",
			steamSoonTitle: "Coming soon on Steam",
			steamSoonText:
				"Wyrdane isn't available on Steam yet, but the store page is live. Wishlist it to know the moment it launches.",
			steamLink: "View the Steam page",
			backHome: "← Back to home",
		},
		auth: {
			back: "← Back",
			title: "Log in",
			steamLogin: "Log in with Steam",
		},
		news: {
			title: "News",
			subtitle: "Announcements, releases, and major changes to Wyrdane.",
		},
		devLog: {
			title: "Dev Log",
			subtitle: "Wyrdane's development journal, entry by entry.",
		},
	},
	fr: {
		play: {
			title: "WYRDANE",
			steamSoonTitle: "Bientôt disponible sur Steam",
			steamSoonText:
				"Wyrdane n'est pas encore disponible sur Steam, mais la page boutique est en ligne. Ajoute-le à ta liste de souhaits pour être prévenu dès la sortie.",
			steamLink: "Voir la page Steam",
			backHome: "← Retour à l'accueil",
		},
		auth: {
			back: "← Retour",
			title: "Connectez-vous",
			steamLogin: "Se connecter avec Steam",
		},
		news: {
			title: "Actualités",
			subtitle: "Les annonces, sorties et évolutions majeures de Wyrdane.",
		},
		devLog: {
			title: "Dev Log",
			subtitle: "Le journal de développement de Wyrdane, entrée par entrée.",
		},
	},
};
