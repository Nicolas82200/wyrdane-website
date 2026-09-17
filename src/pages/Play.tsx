import { Link } from "react-router-dom";

import { useLanguage } from "../i18n/useLanguage";
import { PAGES_CONTENT } from "../i18n/pages";
import { usePageTitle } from "../hooks/usePageTitle";
import "./Play.css";

const Play = () => {
	const { language } = useLanguage();
	const t = PAGES_CONTENT[language].play;
	usePageTitle(t.title);

	return (
		<div className="play">
			<section className="play-hero">
				<span className="play-eyebrow">{t.eyebrow}</span>
				<h1>{t.heroTitle}</h1>
				<p className="play-hero-subtitle">{t.heroSubtitle}</p>
				<div className="play-hero-actions">
					<a
						href="https://store.steampowered.com/app/5052390/Wyrdane/"
						target="_blank"
						rel="noopener noreferrer"
						className="btn btn-primary"
					>
						{t.wishlistCta}
					</a>
					<a
						href="https://store.steampowered.com/app/5052390/Wyrdane/"
						target="_blank"
						rel="noopener noreferrer"
						className="btn"
					>
						{t.steamLink}
					</a>
				</div>
				<Link to="/" className="play-back-link">
					{t.backHome}
				</Link>
			</section>
		</div>
	);
};

export default Play;
