import { useState, type MouseEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useLanguage } from "../i18n/useLanguage";
import { COMMON } from "../i18n/common";
import { PAGES_CONTENT } from "../i18n/pages";
import { useAuth } from "../auth/useAuth";
import { useSteamLoginPopup } from "../auth/useSteamLoginPopup";
import SocialLinks from "./SocialLinks";
import "./Navbar.css";

const Navbar = () => {
	const [open, setOpen] = useState(false);
	const [deckGateOpen, setDeckGateOpen] = useState(false);
	const [loginError, setLoginError] = useState(false);
	const { language, setLanguage } = useLanguage();
	const t = COMMON[language];
	const authT = PAGES_CONTENT[language].auth;
	const { status, user, recheck, logout } = useAuth();
	const navigate = useNavigate();

	const { open: openLogin, isOpen: loginPopupOpen } = useSteamLoginPopup((success) => {
		if (success) {
			setLoginError(false);
			recheck();
		} else {
			setLoginError(true);
		}
	});

	// Popup dédiée quand la connexion est déclenchée depuis le lien "Mes
	// decks" pour un visiteur non connecté : une fois réussie, on referme le
	// panneau et on part directement sur /decks plutôt que de laisser
	// l'utilisateur recliquer sur le lien.
	const { open: openLoginForDecks, isOpen: deckLoginPopupOpen } = useSteamLoginPopup((success) => {
		if (success) {
			setLoginError(false);
			recheck();
			setDeckGateOpen(false);
			setOpen(false);
			navigate("/decks");
		} else {
			setLoginError(true);
		}
	});

	const links = [
		{ to: "/", label: t.navHome, end: true },
		{ to: "/news", label: t.navNews, end: false },
		{ to: "/dev-log", label: t.navDevLog, end: false },
		{ to: "/contact", label: t.navContact, end: false },
	];

	function handleMyDecksClick(e: MouseEvent) {
		if (status !== "authed") {
			e.preventDefault();
			setLoginError(false);
			setDeckGateOpen(true);
			return;
		}
		setOpen(false);
	}

	return (
		<header className="navbar">
			<div className="navbar-inner">
				<NavLink to="/" className="navbar-brand" onClick={() => setOpen(false)}>
					WYRDANE
				</NavLink>

				<div className="navbar-mobile-actions">
					<div className="navbar-lang navbar-lang-mobile">
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
				</div>

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
						to="/decks"
						className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
						onClick={handleMyDecksClick}
					>
						{t.navMyDecks}
					</NavLink>
					<NavLink
						to="/play"
						className="btn btn-primary navbar-cta"
						onClick={() => setOpen(false)}
					>
						{t.navPlay}
					</NavLink>

					<div className="navbar-lang navbar-lang-desktop">
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

					{/* Tout à droite de la navbar : connexion Steam, ou pseudo +
					    déconnexion une fois connecté. */}
					{status === "authed" && (
						<div className="navbar-account">
							<span className="navbar-account-name">{user?.name}</span>
							<button
								type="button"
								className="navbar-link navbar-logout"
								onClick={() => {
									logout();
									setOpen(false);
								}}
							>
								{t.navLogout}
							</button>
						</div>
					)}
					{status === "anon" && (
						<button
							type="button"
							className="btn btn-primary navbar-cta navbar-login"
							onClick={() => {
								setLoginError(false);
								openLogin();
							}}
						>
							{authT.steamLogin}
						</button>
					)}
				</nav>
			</div>

			{deckGateOpen && (
				<div
					className="navbar-modal-overlay"
					onClick={() => !deckLoginPopupOpen && setDeckGateOpen(false)}
				>
					<div className="navbar-modal" onClick={(e) => e.stopPropagation()}>
						{deckLoginPopupOpen ? (
							<p>{authT.steamLoginPending}</p>
						) : (
							<>
								<p>{t.navDecksLoginRequired}</p>
								{loginError && <p className="modal-error">{authT.steamLoginError}</p>}
								<div className="navbar-modal-actions">
									<button
										type="button"
										className="btn btn-primary"
										onClick={() => openLoginForDecks()}
									>
										{authT.steamLogin}
									</button>
									<button
										type="button"
										className="navbar-modal-close"
										onClick={() => setDeckGateOpen(false)}
									>
										{t.navModalClose}
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}

			{loginPopupOpen && (
				<div className="steam-login-overlay">
					<p>{authT.steamLoginPending}</p>
				</div>
			)}
		</header>
	);
};

export default Navbar;
