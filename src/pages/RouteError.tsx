import { Link } from "react-router-dom";

import { useLanguage } from "../i18n/useLanguage";
import "./ContentPage.css";

const CONTENT = {
	en: {
		title: "Something went wrong",
		subtitle: "An unexpected error occurred. You can go back to the home page and try again.",
		home: "Back to home",
	},
	fr: {
		title: "Une erreur est survenue",
		subtitle: "Une erreur inattendue s'est produite. Vous pouvez revenir à l'accueil et réessayer.",
		home: "Retour à l'accueil",
	},
};

const RouteError = () => {
	const { language } = useLanguage();
	const t = CONTENT[language];

	return (
		<div className="content-page">
			<div className="content-panel">
				<h1>{t.title}</h1>
				<p className="content-subtitle">{t.subtitle}</p>
				<hr className="content-sep" />
				<p style={{ textAlign: "center" }}>
					<Link to="/">{t.home}</Link>
				</p>
			</div>
		</div>
	);
};

export default RouteError;
