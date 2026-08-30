import { Link } from "react-router-dom";

import undeadImage from "../assets/site/races/undead.jpg";
import humanImage from "../assets/site/races/human.jpg";
import demonImage from "../assets/site/races/demon.jpg";
import abominationImage from "../assets/site/races/abomination.jpg";
import frontLaneIcon from "../assets/site/icons/front_lane.png";
import backLaneIcon from "../assets/site/icons/back_lane.png";
import hybridLaneIcon from "../assets/site/icons/hibrid_lane.png";
import Reveal from "../components/Reveal";
import BoardDiagram from "../components/BoardDiagram";
import InfoExplorer from "../components/InfoExplorer";
import SocialLinks from "../components/SocialLinks";
import { useLanguage } from "../i18n/useLanguage";
import { HOME_CONTENT } from "../i18n/home";
import { KEYWORD_GROUPS } from "../i18n/keywords";
import { usePageTitle } from "../hooks/usePageTitle";
import "./Home.css";

const RACE_IMAGES: Record<string, string> = {
	undead: undeadImage,
	human: humanImage,
	demon: demonImage,
	abomination: abominationImage,
};

const LANE_ICONS: Record<string, string> = {
	front: frontLaneIcon,
	back: backLaneIcon,
	hybrid: hybridLaneIcon,
};

const Home = () => {
	const { language } = useLanguage();
	const t = HOME_CONTENT[language];
	usePageTitle();

	return (
		<div className="landing">
			<section className="hero">
				<div className="hero-content">
					<h1>WYRDANE</h1>
					<p className="hero-tagline">{t.heroTagline}</p>
					<div className="hero-actions">
						<Link to="/news" className="btn btn-primary">
							{t.heroNewsCta}
						</Link>
					</div>
					<SocialLinks className="hero-socials" />
				</div>
			</section>

			<Reveal className="section">
				<h2>{t.gameTitle}</h2>
				<p className="section-lead">{t.gameText}</p>
			</Reveal>

			<Reveal className="section">
				<h2>{t.lanesTitle}</h2>
				<div className="lanes">
					{t.lanes.map((lane) => (
						<div className="lane-card" key={lane.name}>
							<img className="lane-icon" src={LANE_ICONS[lane.key]} alt="" />
							<h3>{lane.name}</h3>
							<p>{lane.text}</p>
						</div>
					))}
				</div>
			</Reveal>

			<Reveal className="section">
				<h2>{t.cardTypesTitle}</h2>
				<InfoExplorer
					groups={[
						{
							key: "cardTypes",
							title: t.cardTypesTitle,
							items: t.cardTypes.map((type) => ({
								id: type.id,
								name: type.name,
								description: type.text,
							})),
						},
					]}
				/>
			</Reveal>

			<Reveal className="section">
				<h2>{t.boardTitle}</h2>
				<p className="section-lead">{t.boardLead}</p>
				<BoardDiagram />
			</Reveal>

			<Reveal className="section">
				<h2>{t.keywordsTitle}</h2>
				<p className="section-lead">{t.keywordsLead}</p>
				<InfoExplorer groups={KEYWORD_GROUPS[language]} />
			</Reveal>

			<Reveal className="section">
				<h2>{t.triggersTitle}</h2>
				<p className="section-lead">{t.triggersLead}</p>
				<InfoExplorer
					groups={[
						{
							key: "triggers",
							title: t.triggersTitle,
							items: t.triggers.map((trigger) => ({
								id: trigger.id,
								name: trigger.name,
								description: trigger.text,
							})),
						},
					]}
				/>
			</Reveal>

			<Reveal className="section">
				<h2>{t.racesTitle}</h2>
				<div className="races-grid">
					{t.races.map((race) => (
						<div className="race-card" key={race.key}>
							<div
								className="race-image"
								style={{ backgroundImage: `url(${RACE_IMAGES[race.key]})` }}
							/>
							<h3>{race.name}</h3>
							<p>{race.text}</p>
						</div>
					))}
				</div>
			</Reveal>

			<Reveal className="section section-dev">
				<h2>{t.devTitle}</h2>
				<p className="section-lead">{t.devText}</p>
			</Reveal>

			<Reveal className="section section-cta">
				<h2>{t.deckSection.title}</h2>
				<span className="cta-badge">{t.deckSection.badge}</span>
				<p className="section-lead">{t.deckSection.text}</p>
			</Reveal>

			<Reveal className="section section-cta">
				<h2>{t.playSection.title}</h2>
				<a
					href="https://store.steampowered.com/app/5052390/Wyrdane/"
					target="_blank"
					rel="noopener noreferrer"
					className="cta-badge cta-badge-link"
				>
					{t.playSection.badge}
				</a>
				<p className="section-lead">{t.playSection.text}</p>
			</Reveal>
		</div>
	);
};

export default Home;
