import type { Language } from "./language";

export type ContactCategory = "bug" | "question" | "illustrator" | "partnership" | "other";

export type ContactContent = {
	title: string;
	subtitle: string;
	nameLabel: string;
	namePlaceholder: string;
	emailLabel: string;
	emailPlaceholder: string;
	categoryLabel: string;
	categories: Record<ContactCategory, string>;
	portfolioLabel: string;
	portfolioPlaceholder: string;
	messageLabel: string;
	messagePlaceholder: string;
	submit: string;
	submitting: string;
	success: string;
	error: string;
};

export const CONTACT_CONTENT: Record<Language, ContactContent> = {
	fr: {
		title: "Nous contacter",
		subtitle: "Une question, un bug rencontré en jeu, une proposition ? Écrivez-nous.",
		nameLabel: "Nom",
		namePlaceholder: "Votre nom ou pseudo",
		emailLabel: "Email",
		emailPlaceholder: "vous@exemple.com",
		categoryLabel: "Sujet",
		categories: {
			bug: "Bug / problème rencontré en jeu",
			question: "Question générale",
			illustrator: "Je suis illustrateur·rice",
			partnership: "Partenariat / presse",
			other: "Autre",
		},
		portfolioLabel: "Lien vers votre portfolio",
		portfolioPlaceholder: "https://...",
		messageLabel: "Message",
		messagePlaceholder: "Décrivez votre demande...",
		submit: "Envoyer",
		submitting: "Envoi en cours...",
		success: "Votre message a bien été envoyé, merci !",
		error: "Une erreur est survenue, merci de réessayer plus tard.",
	},
	en: {
		title: "Contact us",
		subtitle: "A question, a bug you ran into, a proposal? Get in touch.",
		nameLabel: "Name",
		namePlaceholder: "Your name or handle",
		emailLabel: "Email",
		emailPlaceholder: "you@example.com",
		categoryLabel: "Subject",
		categories: {
			bug: "Bug / issue in the game",
			question: "General question",
			illustrator: "I'm an illustrator",
			partnership: "Partnership / press",
			other: "Other",
		},
		portfolioLabel: "Link to your portfolio",
		portfolioPlaceholder: "https://...",
		messageLabel: "Message",
		messagePlaceholder: "Describe your request...",
		submit: "Send",
		submitting: "Sending...",
		success: "Your message has been sent, thank you!",
		error: "Something went wrong, please try again later.",
	},
};
