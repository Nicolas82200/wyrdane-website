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
			<div className="footer-columns">
				<div className="footer-brand">
					<span className="footer-logo">WYRDANE</span>
					<p className="footer-tagline">{t.footerTagline}</p>
					<div className="footer-brand-actions">
						<a
							href="https://discord.gg/jktBJhXNNF"
							target="_blank"
							rel="noopener noreferrer"
							className="btn footer-discord-btn"
						>
							Discord
						</a>
						<a
							href="https://store.steampowered.com/app/5052390/Wyrdane/"
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn-primary footer-steam-btn"
						>
							Steam
						</a>
					</div>
					<SocialLinks className="footer-socials" />
				</div>

				<nav className="footer-nav-col">
					<span className="footer-col-heading">{t.footerNavHeading}</span>
					<Link to="/">{t.navHome}</Link>
					<Link to="/play">{t.navPlay}</Link>
					<Link to="/news">{t.navNews}</Link>
					<Link to="/decks">{t.footerDeckBuilder}</Link>
				</nav>

				<nav className="footer-nav-col">
					<span className="footer-col-heading">{t.footerInfoHeading}</span>
					<Link to="/mentions-legales">{t.footerLegalNotice}</Link>
					<Link to="/cgu">{t.footerTerms}</Link>
					<Link to="/confidentialite">{t.footerPrivacy}</Link>
					<Link to="/cgv">{t.footerSales}</Link>
					<Link to="/contact">{t.navContact}</Link>
				</nav>
			</div>

			<div className="footer-bottom">
				<p className="footer-rights">
					{t.footerRights.replace("{year}", String(new Date().getFullYear()))}
				</p>
				<p className="footer-made-with">{t.footerMadeWith}</p>
			</div>
		</footer>
	);
};

export default SiteFooter;
