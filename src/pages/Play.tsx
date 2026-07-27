import { Link } from "react-router-dom";

import { useLanguage } from "../i18n/useLanguage";
import { PAGES_CONTENT } from "../i18n/pages";
import "./Play.css";

const Play = () => {
	const { language } = useLanguage();
	const t = PAGES_CONTENT[language].play;

	return (
		<div className="play">
			<div className="play-stage">
				<div className="play-view">
					<h1>{t.title}</h1>
					<p className="play-steam-badge">{t.steamSoonTitle}</p>
					<p className="play-steam-text">{t.steamSoonText}</p>
					<nav className="play-nav">
						<Link to="/" className="play-back-link">
							{t.backHome}
						</Link>
					</nav>
				</div>
			</div>
		</div>
	);
};

export default Play;
