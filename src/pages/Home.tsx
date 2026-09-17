import { useState } from "react";
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
import CardTypeExplorer from "../components/CardTypeExplorer";
import SectionNav from "../components/SectionNav";
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

	// Section races : aucune race sélectionnée par défaut (images seules).
	// Sélectionner une race affiche sa description en dessous et grise les
	// autres images (voir Home.css .race-card.dimmed).
	const [activeRaceKey, setActiveRaceKey] = useState<string | null>(null);
	const activeRace = t.races.find((race) => race.key === activeRaceKey) ?? null;

	return (
		<div className="landing">
			<SectionNav items={t.sectionNav} />

			<section className="hero" id="hero">
				<div className="hero-content">
					<h1>WYRDANE</h1>
					<p className="hero-tagline">{t.heroTagline}</p>
					<div className="hero-actions">
						<Link to="/news" className="btn btn-primary">
							{t.heroNewsCta}
						</Link>
						<Link to="/decks" className="btn">
							{t.heroDecksCta}
						</Link>
						<a
							href="https://store.steampowered.com/app/5052390/Wyrdane/"
							target="_blank"
							rel="noopener noreferrer"
							className="btn"
						>
							{t.heroWishlistCta}
						</a>
					</div>
					<SocialLinks className="hero-socials" />
				</div>
			</section>

			<Reveal className="section" id="le-jeu">
				<h2>{t.gameTitle}</h2>
				<p className="section-lead">{t.gameText}</p>
			</Reveal>

			<Reveal className="section" id="lanes">
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

			<Reveal className="section section-extra-wide" id="plateau">
				<h2>{t.boardTitle}</h2>
				<p className="section-lead">{t.boardLead}</p>
				<BoardDiagram />
			</Reveal>

			<Reveal className="section section-wide" id="types-de-cartes">
				<h2>{t.cardTypesTitle}</h2>
				<CardTypeExplorer
					types={t.cardTypes.map((type) => ({
						id: type.id,
						name: type.name,
						description: type.text,
					}))}
				/>
			</Reveal>

			<Reveal className="section" id="races">
				<h2>{t.racesTitle}</h2>
				<div className="races-grid">
					{t.races.map((race) => (
						<button
							type="button"
							className={`race-card ${activeRaceKey === race.key ? "active" : ""} ${
								activeRaceKey && activeRaceKey !== race.key ? "dimmed" : ""
							}`}
							key={race.key}
							onClick={() => setActiveRaceKey(activeRaceKey === race.key ? null : race.key)}
						>
							<div
								className="race-image"
								style={{ backgroundImage: `url(${RACE_IMAGES[race.key]})` }}
							/>
							<h3>{race.name}</h3>
						</button>
					))}
				</div>
				<div className={`race-detail ${activeRace ? "visible" : ""}`}>
					{activeRace && (
						<div className="race-detail-inner" key={activeRace.key}>
							<h3>{activeRace.name}</h3>
							<p>{activeRace.text}</p>
						</div>
					)}
				</div>
			</Reveal>

			<Reveal className="section" id="mots-cles">
				<h2>{t.keywordsTitle}</h2>
				<p className="section-lead">{t.keywordsLead}</p>
				<InfoExplorer groups={KEYWORD_GROUPS[language]} />
			</Reveal>

			<Reveal className="section" id="declencheurs">
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

			<Reveal className="section section-dev">
				<h2>{t.devTitle}</h2>
				<p className="section-lead">{t.devText}</p>
			</Reveal>
		</div>
	);
};

export default Home;
