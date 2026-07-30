import type { Language } from "./language";

export type LegalSection = {
	heading: string;
	paragraphs?: string[];
	list?: string[];
};

export type LegalPageContent = {
	title: string;
	updated: string;
	intro?: string;
	sections: LegalSection[];
};

export type LegalContent = {
	legalNotice: LegalPageContent;
	terms: LegalPageContent;
	privacy: LegalPageContent;
	sales: LegalPageContent;
};

export const LEGAL_CONTENT: Record<Language, LegalContent> = {
	fr: {
		legalNotice: {
			title: "Mentions légales",
			updated: "Dernière mise à jour : 30 juillet 2026",
			sections: [
				{
					heading: "Éditeur du site",
					paragraphs: [
						"Le site wyrdane.com (ci-après « le Site ») ainsi que le jeu vidéo Wyrdane sont édités par Wyrdane, éditeur individuel non-professionnel au sens de l'article 6-III de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN). L'éditeur n'étant pas encore immatriculé en tant qu'entreprise, son adresse personnelle n'est pas rendue publique mais a été communiquée à l'hébergeur du Site.",
						"Contact : wyrdane@outlook.fr",
					],
				},
				{
					heading: "Directeur de la publication",
					paragraphs: ["La direction de la publication est assurée par Wyrdane."],
				},
				{
					heading: "Hébergement",
					paragraphs: [
						"Le Site est hébergé par OVH SAS, société immatriculée au RCS de Lille Métropole sous le numéro 424 761 419, dont le siège social est situé 2 rue Kellermann, 59100 Roubaix, France (https://www.ovhcloud.com).",
						"Les serveurs applicatifs du Jeu (backend) sont hébergés sur la même infrastructure ou, ponctuellement, chez Render Services Inc., États-Unis (https://render.com).",
					],
				},
				{
					heading: "Propriété intellectuelle",
					paragraphs: [
						"L'ensemble des éléments du Site et du jeu Wyrdane (textes, illustrations, logos, cartes, code source, identité visuelle...) sont protégés par le droit de la propriété intellectuelle et restent la propriété exclusive de leur éditeur, sauf mention contraire. Toute reproduction, représentation ou exploitation, totale ou partielle, sans autorisation préalable est interdite.",
					],
				},
				{
					heading: "Signalement",
					paragraphs: [
						"Pour tout signalement de contenu illicite ou toute question relative au Site, contactez wyrdane@outlook.fr.",
					],
				},
			],
		},
		terms: {
			title: "Conditions Générales d'Utilisation",
			updated: "Dernière mise à jour : 30 juillet 2026",
			intro:
				"Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du site wyrdane.com et du jeu vidéo Wyrdane (ci-après « le Jeu »), édité par Wyrdane. L'utilisation du Site ou la création d'un compte implique l'acceptation pleine et entière des présentes CGU.",
			sections: [
				{
					heading: "Accès et compte",
					paragraphs: [
						"L'accès au Jeu nécessite un compte Steam valide ; l'authentification est exclusivement assurée via Steam, aucun mot de passe n'est créé ou stocké par Wyrdane.",
						"L'utilisation du Jeu est réservée aux personnes en mesure de créer légalement un compte Steam dans leur pays de résidence. Les utilisateurs mineurs doivent s'assurer d'avoir l'autorisation de leur représentant légal.",
					],
				},
				{
					heading: "Comportement des joueurs",
					list: [
						"Respecter les autres joueurs et adopter un comportement loyal en partie.",
						"Ne pas utiliser de logiciel tiers, bot, script ou exploit destiné à obtenir un avantage déloyal.",
						"Ne pas usurper l'identité d'un tiers ni harceler d'autres utilisateurs.",
						"Ne pas tenter de perturber le fonctionnement du Site, du Jeu ou de ses serveurs (déni de service, intrusion, etc.).",
					],
					paragraphs: [
						"Tout manquement à ces règles peut entraîner un avertissement, une suspension temporaire ou la résiliation définitive du compte, sans préavis ni indemnité.",
					],
				},
				{
					heading: "Monnaie virtuelle et contenus du Jeu",
					paragraphs: [
						"Le Jeu peut comporter une monnaie virtuelle (« monnaie molle ») ainsi que des cartes et objets virtuels obtenus en jeu ou, le cas échéant, via des achats décrits dans les Conditions Générales de Vente (CGV). Ces éléments n'ont aucune valeur monétaire réelle, ne sont ni convertibles en argent réel, ni cessibles, ni échangeables entre joueurs, et demeurent la propriété de Wyrdane. Ils ne constituent en aucun cas un actif numérique ou une monnaie électronique.",
					],
				},
				{
					heading: "Disponibilité du service",
					paragraphs: [
						"Wyrdane s'efforce d'assurer un accès continu au Jeu mais ne garantit pas une disponibilité ininterrompue. Le Jeu étant en développement actif, des interruptions, mises à jour ou modifications de fonctionnalités peuvent survenir sans préavis.",
					],
				},
				{
					heading: "Propriété intellectuelle",
					paragraphs: [
						"Les présentes CGU n'emportent aucune cession de droit de propriété intellectuelle. Le contenu du Jeu et du Site reste la propriété exclusive de Wyrdane (voir Mentions légales).",
					],
				},
				{
					heading: "Responsabilité",
					paragraphs: [
						"Wyrdane met tout en œuvre pour assurer l'exactitude des informations diffusées mais ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation du Site ou du Jeu, dans les limites autorisées par la loi.",
					],
				},
				{
					heading: "Modification des CGU",
					paragraphs: [
						"Wyrdane se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle via le Site.",
					],
				},
				{
					heading: "Droit applicable et litiges",
					paragraphs: [
						"Les présentes CGU sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français compétents seront seuls saisis.",
					],
				},
			],
		},
		privacy: {
			title: "Politique de confidentialité",
			updated: "Dernière mise à jour : 30 juillet 2026",
			sections: [
				{
					heading: "Responsable de traitement",
					paragraphs: [
						"Le responsable du traitement des données personnelles collectées sur le Site et dans le Jeu est Wyrdane, éditeur du Site, joignable à wyrdane@outlook.fr.",
					],
				},
				{
					heading: "Données collectées",
					list: [
						"Identifiant Steam (SteamID64), pseudonyme et avatar public associés à votre compte Steam, transmis lors de la connexion.",
						"Données de progression de jeu : collection de cartes possédées, decks, monnaie virtuelle, statistiques de partie.",
						"Adresse IP et données techniques de connexion (journaux serveur), à des fins de sécurité et de lutte contre la triche.",
						"Toute information transmise volontairement par email lors d'un contact.",
					],
					paragraphs: [
						"Wyrdane ne collecte ni mot de passe, ni moyen de paiement : l'authentification et les paiements éventuels sont intégralement gérés par Steam/Valve.",
					],
				},
				{
					heading: "Finalités et bases légales",
					list: [
						"Création et gestion du compte joueur (base légale : exécution du contrat formé par les CGU).",
						"Fonctionnement du Jeu, sauvegarde de la progression et multijoueur (exécution du contrat).",
						"Sécurité, prévention de la fraude et de la triche (base légale : intérêt légitime).",
						"Réponse aux demandes de contact (base légale : intérêt légitime).",
					],
				},
				{
					heading: "Destinataires des données",
					paragraphs: [
						"Les données sont hébergées par l'hébergeur du Site et du backend de jeu (voir Mentions légales) et ne sont transmises à aucun tiers à des fins commerciales. Steam/Valve Corporation (États-Unis) intervient en tant que fournisseur d'authentification, dans le cadre de son propre traitement de données décrit dans sa politique de confidentialité.",
					],
				},
				{
					heading: "Transferts hors Union européenne",
					paragraphs: [
						"Certaines données peuvent être traitées par des prestataires situés hors de l'Union européenne, notamment Valve Corporation pour l'authentification Steam, et ponctuellement Render Services Inc. pour l'hébergement. Ces transferts s'appuient sur les garanties prévues par ces prestataires (clauses contractuelles types ou équivalent).",
					],
				},
				{
					heading: "Durée de conservation",
					paragraphs: [
						"Les données liées à votre compte sont conservées pendant toute la durée d'utilisation du Jeu, puis supprimées ou anonymisées après une période d'inactivité prolongée, sauf obligation légale de conservation plus longue.",
					],
				},
				{
					heading: "Cookies",
					paragraphs: [
						"Le Site et le Jeu utilisent uniquement un cookie de session, strictement nécessaire à l'authentification et au fonctionnement du compte joueur. Ce cookie ne nécessite pas de consentement préalable (article 82 de la loi Informatique et Libertés) et est supprimé à la déconnexion ou à expiration. Aucun cookie publicitaire ni traceur d'analyse n'est utilisé à ce jour ; si cela évoluait, cette politique serait mise à jour et un bandeau de consentement serait mis en place le cas échéant.",
					],
				},
				{
					heading: "Vos droits",
					paragraphs: [
						"Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données. Vous pouvez exercer ces droits en écrivant à wyrdane@outlook.fr. Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (www.cnil.fr).",
					],
				},
				{
					heading: "Sécurité",
					paragraphs: [
						"Wyrdane met en œuvre des mesures techniques et organisationnelles raisonnables pour protéger vos données contre tout accès non autorisé, perte ou divulgation.",
					],
				},
			],
		},
		sales: {
			title: "Conditions Générales de Vente",
			updated: "Dernière mise à jour : 30 juillet 2026",
			intro:
				"À la date de publication de ces conditions, Wyrdane ne propose aucun achat avec de l'argent réel : les cartes et la monnaie virtuelle s'obtiennent exclusivement en jouant. Les présentes Conditions Générales de Vente (CGV) sont publiées par anticipation et s'appliqueront automatiquement dès l'activation d'une fonctionnalité d'achat payant (par exemple des packs de cartes ou une monnaie premium).",
			sections: [
				{
					heading: "Objet et champ d'application",
					paragraphs: [
						"Les présentes CGV régissent toute vente de contenu numérique (packs, monnaie virtuelle premium ou tout autre bien numérique) proposée depuis le Jeu ou le Site, une fois cette fonctionnalité activée. Elles complètent les Conditions Générales d'Utilisation (CGU).",
					],
				},
				{
					heading: "Nature des biens vendus",
					paragraphs: [
						"Les biens vendus sont des contenus numériques exclusivement utilisables au sein du Jeu (cartes, monnaie virtuelle, cosmétiques). Ils n'ont aucune valeur monétaire réelle, ne sont ni remboursables en argent, ni convertibles, ni cessibles ou échangeables entre joueurs, en dehors des mécanismes prévus par le Jeu lui-même.",
					],
				},
				{
					heading: "Prix et paiement",
					paragraphs: [
						"Les prix sont indiqués en euros toutes taxes comprises (TTC). Le paiement s'effectue via la plateforme tierce utilisée pour la distribution du Jeu (notamment Steam/Valve), selon les moyens de paiement et conditions propres à cette plateforme.",
					],
				},
				{
					heading: "Livraison",
					paragraphs: [
						"Les biens numériques achetés sont crédités immédiatement sur le compte joueur après confirmation du paiement.",
					],
				},
				{
					heading: "Droit de rétractation",
					paragraphs: [
						"Conformément à l'article L221-28 13° du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques non fournis sur support matériel dont l'exécution a commencé après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation. En validant un achat, vous reconnaissez demander l'exécution immédiate et renoncer expressément à votre droit de rétractation.",
					],
				},
				{
					heading: "Remboursement",
					paragraphs: [
						"Toute demande de remboursement est soumise à la politique de remboursement de la plateforme tierce utilisée pour l'achat (par exemple la politique de remboursement Steam), Wyrdane n'étant pas en mesure de traiter directement les transactions financières.",
					],
				},
				{
					heading: "Réclamations et médiation",
					paragraphs: [
						"Pour toute réclamation, contactez wyrdane@outlook.fr. Conformément au Code de la consommation, en cas de litige non résolu à l'amiable, le consommateur peut recourir gratuitement à un médiateur de la consommation ou à la plateforme européenne de règlement en ligne des litiges (https://ec.europa.eu/consumers/odr).",
					],
				},
			],
		},
	},
	en: {
		legalNotice: {
			title: "Legal Notice",
			updated: "Last updated: July 30, 2026",
			sections: [
				{
					heading: "Site publisher",
					paragraphs: [
						"The website wyrdane.com (\"the Site\") and the video game Wyrdane are published by Wyrdane, a non-professional individual publisher within the meaning of Article 6-III of French law n° 2004-575 of June 21, 2004 for confidence in the digital economy (LCEN). As the publisher is not yet registered as a business, their personal address is not made public but has been provided to the Site's host.",
						"Contact: wyrdane@outlook.fr",
					],
				},
				{
					heading: "Publication director",
					paragraphs: ["Publication is directed by Wyrdane."],
				},
				{
					heading: "Hosting",
					paragraphs: [
						"The Site is hosted by OVH SAS, registered with the Lille Métropole Trade and Companies Register under number 424 761 419, with registered office at 2 rue Kellermann, 59100 Roubaix, France (https://www.ovhcloud.com).",
						"The Game's application servers (backend) are hosted on the same infrastructure or, occasionally, by Render Services Inc., United States (https://render.com).",
					],
				},
				{
					heading: "Intellectual property",
					paragraphs: [
						"All elements of the Site and of the Wyrdane game (text, artwork, logos, cards, source code, visual identity...) are protected by intellectual property law and remain the exclusive property of their publisher, unless stated otherwise. Any reproduction, representation, or exploitation, in whole or in part, without prior authorization is prohibited.",
					],
				},
				{
					heading: "Reporting",
					paragraphs: [
						"To report unlawful content or for any question regarding the Site, contact wyrdane@outlook.fr.",
					],
				},
			],
		},
		terms: {
			title: "Terms of Use",
			updated: "Last updated: July 30, 2026",
			intro:
				"These Terms of Use govern access to and use of the website wyrdane.com and the video game Wyrdane (\"the Game\"), published by Wyrdane. Using the Site or creating an account implies full acceptance of these Terms.",
			sections: [
				{
					heading: "Access and account",
					paragraphs: [
						"Access to the Game requires a valid Steam account; authentication is handled exclusively via Steam, and Wyrdane never creates or stores a password.",
						"Use of the Game is restricted to people who can legally create a Steam account in their country of residence. Minors must ensure they have their legal guardian's permission.",
					],
				},
				{
					heading: "Player conduct",
					list: [
						"Treat other players with respect and play fairly.",
						"Do not use third-party software, bots, scripts, or exploits intended to gain an unfair advantage.",
						"Do not impersonate another person or harass other users.",
						"Do not attempt to disrupt the operation of the Site, the Game, or its servers (denial of service, intrusion, etc.).",
					],
					paragraphs: [
						"Any breach of these rules may result in a warning, a temporary suspension, or permanent termination of the account, without notice or compensation.",
					],
				},
				{
					heading: "Virtual currency and Game content",
					paragraphs: [
						"The Game may include virtual currency (\"soft currency\") as well as cards and virtual items obtained in-game or, where applicable, through purchases described in the Terms of Sale. These items have no real monetary value, cannot be converted into real money, transferred, or traded between players, and remain the property of Wyrdane. They do not constitute a digital asset or electronic money of any kind.",
					],
				},
				{
					heading: "Service availability",
					paragraphs: [
						"Wyrdane strives to keep the Game continuously accessible but does not guarantee uninterrupted availability. As the Game is under active development, interruptions, updates, or feature changes may occur without notice.",
					],
				},
				{
					heading: "Intellectual property",
					paragraphs: [
						"These Terms do not transfer any intellectual property rights. The content of the Game and the Site remains the exclusive property of Wyrdane (see Legal Notice).",
					],
				},
				{
					heading: "Liability",
					paragraphs: [
						"Wyrdane makes every effort to ensure the accuracy of the information published but cannot be held liable for direct or indirect damages resulting from the use of the Site or the Game, to the extent permitted by law.",
					],
				},
				{
					heading: "Changes to these Terms",
					paragraphs: [
						"Wyrdane reserves the right to modify these Terms at any time. Users will be informed of any substantial change via the Site.",
					],
				},
				{
					heading: "Governing law and disputes",
					paragraphs: [
						"These Terms are governed by French law. In the event of a dispute, an amicable resolution will be sought before any legal action. Failing that, the competent French courts shall have exclusive jurisdiction.",
					],
				},
			],
		},
		privacy: {
			title: "Privacy Policy",
			updated: "Last updated: July 30, 2026",
			sections: [
				{
					heading: "Data controller",
					paragraphs: [
						"The controller for personal data collected on the Site and in the Game is Wyrdane, the Site's publisher, reachable at wyrdane@outlook.fr.",
					],
				},
				{
					heading: "Data collected",
					list: [
						"Steam ID (SteamID64), display name, and public avatar associated with your Steam account, provided at login.",
						"Game progress data: owned card collection, decks, virtual currency, match statistics.",
						"IP address and technical connection data (server logs), for security and anti-cheat purposes.",
						"Any information voluntarily provided by email when contacting us.",
					],
					paragraphs: [
						"Wyrdane never collects passwords or payment details: authentication and any payments are handled entirely by Steam/Valve.",
					],
				},
				{
					heading: "Purposes and legal bases",
					list: [
						"Creating and managing the player account (legal basis: performance of the contract formed by the Terms of Use).",
						"Operating the Game, saving progress, and multiplayer (performance of the contract).",
						"Security, fraud and cheat prevention (legal basis: legitimate interest).",
						"Responding to contact requests (legal basis: legitimate interest).",
					],
				},
				{
					heading: "Data recipients",
					paragraphs: [
						"Data is hosted by the Site's and game backend's host (see Legal Notice) and is not transmitted to any third party for commercial purposes. Steam/Valve Corporation (United States) acts as authentication provider, under its own data processing described in its own privacy policy.",
					],
				},
				{
					heading: "Transfers outside the European Union",
					paragraphs: [
						"Some data may be processed by providers located outside the European Union, notably Valve Corporation for Steam authentication, and occasionally Render Services Inc. for hosting. These transfers rely on the safeguards provided by these processors (standard contractual clauses or equivalent).",
					],
				},
				{
					heading: "Retention period",
					paragraphs: [
						"Account-related data is kept for as long as you use the Game, then deleted or anonymized after an extended period of inactivity, unless a longer retention period is required by law.",
					],
				},
				{
					heading: "Cookies",
					paragraphs: [
						"The Site and the Game only use a session cookie, strictly necessary for authentication and the operation of the player account. This cookie does not require prior consent and is deleted upon logout or expiration. No advertising or analytics cookie is used at this time; should this change, this policy will be updated and a consent banner will be implemented accordingly.",
					],
				},
				{
					heading: "Your rights",
					paragraphs: [
						"In accordance with the General Data Protection Regulation (GDPR), you have the right to access, rectify, erase, restrict, object to, and port your data. You can exercise these rights by writing to wyrdane@outlook.fr. You also have the right to lodge a complaint with the CNIL (www.cnil.fr) or your local data protection authority.",
					],
				},
				{
					heading: "Security",
					paragraphs: [
						"Wyrdane implements reasonable technical and organizational measures to protect your data against unauthorized access, loss, or disclosure.",
					],
				},
			],
		},
		sales: {
			title: "Terms of Sale",
			updated: "Last updated: July 30, 2026",
			intro:
				"As of the publication date of these terms, Wyrdane does not offer any purchases with real money: cards and virtual currency are obtained exclusively by playing. These Terms of Sale are published in advance and will automatically apply once a paid purchase feature (such as card packs or premium currency) is activated.",
			sections: [
				{
					heading: "Purpose and scope",
					paragraphs: [
						"These Terms of Sale govern any sale of digital content (packs, premium virtual currency, or any other digital good) offered from the Game or the Site, once such a feature is activated. They complement the Terms of Use.",
					],
				},
				{
					heading: "Nature of goods sold",
					paragraphs: [
						"The goods sold are digital content usable exclusively within the Game (cards, virtual currency, cosmetics). They have no real monetary value and cannot be refunded for money, converted, transferred, or traded between players, outside of mechanisms provided by the Game itself.",
					],
				},
				{
					heading: "Price and payment",
					paragraphs: [
						"Prices are shown in euros, all taxes included. Payment is made through the third-party platform used to distribute the Game (notably Steam/Valve), according to the payment methods and terms specific to that platform.",
					],
				},
				{
					heading: "Delivery",
					paragraphs: [
						"Purchased digital goods are credited to the player account immediately after payment confirmation.",
					],
				},
				{
					heading: "Right of withdrawal",
					paragraphs: [
						"Under French Consumer Code Article L221-28 13°, the right of withdrawal does not apply to digital content not supplied on a physical medium whose performance has begun after the consumer's prior express agreement and express waiver of their right of withdrawal. By completing a purchase, you acknowledge requesting immediate performance and expressly waive your right of withdrawal.",
					],
				},
				{
					heading: "Refunds",
					paragraphs: [
						"Any refund request is subject to the refund policy of the third-party platform used for the purchase (e.g. Steam's refund policy), as Wyrdane is not able to process financial transactions directly.",
					],
				},
				{
					heading: "Complaints and mediation",
					paragraphs: [
						"For any complaint, contact wyrdane@outlook.fr. Under the French Consumer Code, if a dispute is not resolved amicably, the consumer may resort free of charge to a consumer mediator or to the EU Online Dispute Resolution platform (https://ec.europa.eu/consumers/odr).",
					],
				},
			],
		},
	},
};
