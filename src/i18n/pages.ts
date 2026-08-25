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
		steamLoginError: string;
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
			steamSoonTitle: "Wishlist Wyrdane on Steam",
			steamSoonText:
				"The game is still in development and isn't playable yet, but its Steam page is live right now. Wishlist it to be notified the moment it launches.",
			steamLink: "View the Steam page",
			backHome: "← Back to home",
		},
		auth: {
			back: "← Back",
			title: "Log in",
			steamLogin: "Log in with Steam",
			steamLoginError: "Steam login failed or was cancelled. Please try again.",
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
			steamSoonTitle: "Ajoute Wyrdane à ta liste de souhaits Steam",
			steamSoonText:
				"Le jeu est encore en développement et n'est pas encore jouable, mais sa page Steam est en ligne dès maintenant. Ajoute-le à ta liste de souhaits pour être prévenu dès la sortie.",
			steamLink: "Voir la page Steam",
			backHome: "← Retour à l'accueil",
		},
		auth: {
			back: "← Retour",
			title: "Connectez-vous",
			steamLogin: "Se connecter avec Steam",
			steamLoginError: "La connexion Steam a échoué ou a été annulée. Réessaie.",
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
