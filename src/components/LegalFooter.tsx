import { Link } from "react-router-dom";

import { useLanguage } from "../i18n/useLanguage";
import { COMMON } from "../i18n/common";
import "./LegalFooter.css";

const LegalFooter = () => {
	const { language } = useLanguage();
	const t = COMMON[language];

	return (
		<footer className="legal-footer">
			<nav className="legal-footer-links">
				<Link to="/mentions-legales">{t.footerLegalNotice}</Link>
				<Link to="/cgu">{t.footerTerms}</Link>
				<Link to="/confidentialite">{t.footerPrivacy}</Link>
				<Link to="/cgv">{t.footerSales}</Link>
			</nav>
			<p>{t.footerRights.replace("{year}", String(new Date().getFullYear()))}</p>
		</footer>
	);
};

export default LegalFooter;
