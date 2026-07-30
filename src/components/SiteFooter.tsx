import { Link } from "react-router-dom";

import SocialLinks from "./SocialLinks";
import { useLanguage } from "../i18n/useLanguage";
import { COMMON } from "../i18n/common";
import "./SiteFooter.css";

const SiteFooter = () => {
	const { language } = useLanguage();
	const t = COMMON[language];

	return (
		<footer className="site-footer">
			<nav className="footer-links">
				<Link to="/">{t.navHome}</Link>
				<Link to="/news">{t.navNews}</Link>
				<Link to="/dev-log">{t.navDevLog}</Link>
				<Link to="/play">{t.navPlay}</Link>
				<Link to="/contact">{t.navContact}</Link>
			</nav>
			<SocialLinks className="footer-socials" withLabels />
			<p className="footer-tagline">{t.footerTagline}</p>
			<nav className="footer-legal-links">
				<Link to="/mentions-legales">{t.footerLegalNotice}</Link>
				<Link to="/cgu">{t.footerTerms}</Link>
				<Link to="/confidentialite">{t.footerPrivacy}</Link>
				<Link to="/cgv">{t.footerSales}</Link>
			</nav>
			<p className="footer-rights">
				{t.footerRights.replace("{year}", String(new Date().getFullYear()))}
			</p>
		</footer>
	);
};

export default SiteFooter;
