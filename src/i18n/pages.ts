import type { Language } from "./language";

export type PagesContent = {
	play: {
		title: string;
		eyebrow: string;
		heroTitle: string;
		heroSubtitle: string;
		wishlistCta: string;
		steamLink: string;
		backHome: string;
	};
	auth: {
		back: string;
		title: string;
		steamLogin: string;
		steamLoginError: string;
		steamLoginPending: string;
	};
	news: {
		title: string;
		subtitle: string;
	};
	newsHub: {
		title: string;
		subtitle: string;
		tabAll: string;
		tabNews: string;
		tabDevlog: string;
		empty: string;
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
			eyebrow: "Play",
			heroTitle: "Enter the arena",
			heroSubtitle:
				"Wyrdane is available on Steam. No browser game: the full experience awaits you on PC.",
			wishlistCta: "Add to wishlist",
			steamLink: "View on Steam →",
			backHome: "← Back to home",
		},
		auth: {
			back: "← Back",
			title: "Log in",
			steamLogin: "Log in with Steam",
			steamLoginError: "Steam login failed or was cancelled. Please try again.",
			steamLoginPending: "Log in with Steam in the window that just opened…",
		},
		news: {
			title: "News",
			subtitle: "Announcements, releases, and major changes to Wyrdane.",
		},
		newsHub: {
			title: "News & Devlog",
			subtitle: "Announcements, releases, and Wyrdane's development journal, all in one place.",
			tabAll: "All",
			tabNews: "News",
			tabDevlog: "Devlog",
			empty: "Nothing here yet.",
		},
		devLog: {
			title: "Dev Log",
			subtitle: "Wyrdane's development journal, entry by entry.",
		},
	},
	fr: {
		play: {
			title: "WYRDANE",
			eyebrow: "Jouer",
			heroTitle: "Entre dans l'arène",
			heroSubtitle:
				"Wyrdane est disponible sur Steam. Aucun jeu navigateur : l'expérience complète t'attend sur PC.",
			wishlistCta: "Ajouter à la liste de souhaits",
			steamLink: "Voir sur Steam →",
			backHome: "← Retour à l'accueil",
		},
		auth: {
			back: "← Retour",
			title: "Connectez-vous",
			steamLogin: "Se connecter avec Steam",
			steamLoginError: "La connexion Steam a échoué ou a été annulée. Réessaie.",
			steamLoginPending: "Connecte-toi avec Steam dans la fenêtre qui vient de s'ouvrir…",
		},
		news: {
			title: "Actualités",
			subtitle: "Les annonces, sorties et évolutions majeures de Wyrdane.",
		},
		newsHub: {
			title: "Actualités & Devlog",
			subtitle: "Les annonces, sorties et le journal de développement de Wyrdane, au même endroit.",
			tabAll: "Tout",
			tabNews: "Actualités",
			tabDevlog: "Devlog",
			empty: "Rien à afficher pour l'instant.",
		},
		devLog: {
			title: "Dev Log",
			subtitle: "Le journal de développement de Wyrdane, entrée par entrée.",
		},
	},
};
