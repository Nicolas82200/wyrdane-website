import { useState } from "react";
import { NavLink } from "react-router-dom";

import { useLanguage } from "../i18n/useLanguage";
import { COMMON } from "../i18n/common";
import SocialLinks from "./SocialLinks";
import "./Navbar.css";

const Navbar = () => {
	const [open, setOpen] = useState(false);
	const { language, setLanguage } = useLanguage();
	const t = COMMON[language];

	const links = [
		{ to: "/", label: t.navHome, end: true },
		{ to: "/news", label: t.navNews, end: false },
		{ to: "/dev-log", label: t.navDevLog, end: false },
	];

	return (
		<header className="navbar">
			<div className="navbar-inner">
				<NavLink to="/" className="navbar-brand" onClick={() => setOpen(false)}>
					WYRDANE
				</NavLink>

				<button
					type="button"
					className="navbar-burger"
					aria-label="Menu"
					aria-expanded={open}
					onClick={() => setOpen((v) => !v)}
				>
					<span />
					<span />
					<span />
				</button>

				<nav className={`navbar-links ${open ? "open" : ""}`}>
					{links.map((link) => (
						<NavLink
							key={link.to}
							to={link.to}
							end={link.end}
							className={({ isActive }) =>
								`navbar-link ${isActive ? "active" : ""}`
							}
							onClick={() => setOpen(false)}
						>
							{link.label}
						</NavLink>
					))}
					<NavLink
						to="/play"
						className="btn btn-primary navbar-cta"
						onClick={() => setOpen(false)}
					>
						{t.navPlay}
					</NavLink>
					<div className="navbar-lang">
						<button
							type="button"
							className={`navbar-lang-btn ${language === "en" ? "active" : ""}`}
							onClick={() => setLanguage("en")}
						>
							EN
						</button>
						<span className="navbar-lang-sep">/</span>
						<button
							type="button"
							className={`navbar-lang-btn ${language === "fr" ? "active" : ""}`}
							onClick={() => setLanguage("fr")}
						>
							FR
						</button>
					</div>
					<SocialLinks className="navbar-socials" />
				</nav>
			</div>
		</header>
	);
};

export default Navbar;
