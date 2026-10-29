import { animate } from "motion";
import type { ForwardedRef } from "react";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import HTMLFlipBook from "react-pageflip";
import { Link } from "react-router-dom";

import archivesBgUrl from "../assets/site/archives.jpg";
import book01CoverUrl from "../assets/site/book-01.png";
import book01SpineUrl from "../assets/site/book01-spine.png";
import mapEnUrl from "../assets/site/map-en.png";
import mapFrUrl from "../assets/site/map-fr.png";
import map1awEnUrl from "../assets/site/1aw-map-en.png";
import map1awFrUrl from "../assets/site/1aw-map-fr.png";
import pageTurnSoundUrl from "../assets/site/page-turn.wav";
import Portal from "../components/Portal";
import { JOURNAL_BOOKS, type Bi, type JournalPage } from "../data/journalAldrenia";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useLanguage } from "../i18n/useLanguage";
import "./Lore.css";

// Les deux cartes (Entree I, Entree III) ont chacune un fichier par langue
// plutot qu'un seul fichier texte-neutre : resout ici les noms de fichier
// relatifs portes par les pages kind:"map" (journalAldrenia.ts) vers les
// imports Vite ci-dessus, selon la langue courante.
const MAP_URLS: Record<string, string> = {
	"map-fr.png": mapFrUrl,
	"map-en.png": mapEnUrl,
	"1aw-map-fr.png": map1awFrUrl,
	"1aw-map-en.png": map1awEnUrl,
};

// Instance StPageFlip exposée par react-pageflip via ref.current.pageFlip()
// (voir node_modules/react-pageflip/build/index.es.js) — non typée par le
// paquet, d'où ce typage minimal couvrant juste ce qu'on utilise ici.
interface PageFlipInstance {
	flipNext: (corner?: "top" | "bottom") => void;
	flipPrev: (corner?: "top" | "bottom") => void;
	// flip()/flipToPage() (saut direct, UN SEUL tournage anime vers une page
	// arbitraire) a ete essaye deux fois, y compris apres avoir elimine tout
	// risque de clic concurrent (stopPropagation sur le bouton) : il reste
	// coince sur la page de depart au lieu de reveler la cible — bug reel de
	// la librairie sur les sauts a distance. Plutot que de contourner ce
	// bug avec un saut instantane (turnToPage(), sans animation), jumpToPage
	// (plus bas) enchaine plusieurs flipNext()/flipPrev() normaux via la
	// MEME file d'attente que la navigation habituelle (flipQueueRef/
	// processFlipQueue) : chacun est fiable et anime, le livre feuillette
	// reellement jusqu'a la page visee. getCurrentPageIndex() sert a savoir,
	// apres chaque tournage, s'il faut en enchainer un autre.
	getCurrentPageIndex: () => number;
	getState: () => "user_fold" | "fold_corner" | "flipping" | "read";
}
type FlipBookHandle = { pageFlip: () => PageFlipInstance };

// Marque-pages : une entree par page de JOURNAL_PAGES qui porte un titre
// (divider.bookNo pour les grandes "Entrees", content.title pour les
// chapitres). Calcule une seule fois au chargement du module (JOURNAL_PAGES
// est statique) : l'INDEX de chaque marque-page dans ce tableau est son
// "emplacement" fixe (voir Lore.css .lore-bookmark, position en
// `top: slot * TAB_HEIGHT`) — il ne bouge jamais, seul le cote (gauche si
// deja lue, droite sinon) change selon la page courante.
const TAB_HEIGHT = 32;
type Bookmark = { pageIndex: number; label: Bi };
// Divider = toujours marque (ce sont les seuls "tomes"/grandes entrees).
// content = marque UNIQUEMENT si bookmark:true est pose explicitement sur la
// page (voir journalAldrenia.ts) : un chapitre/royaume, jamais une page de
// sous-section a l'interieur d'un chapitre deja marque (demande explicite,
// liste volontairement courte plutot qu'un marque-page par page titree).
// label reste bilingue (Bi) : choisi a l'affichage selon la langue courante,
// pas au calcul de ce tableau (module-level, calcule une seule fois).
// Salle des archives : aucun tome ouvert, donc aucune page. Constante de
// module pour garder une reference stable d'un rendu a l'autre.
const NO_PAGES: JournalPage[] = [];

const computeBookmarks = (pages: JournalPage[]): Bookmark[] =>
	pages.reduce<Bookmark[]>((acc, page, pageIndex) => {
		if (page.kind === "divider") acc.push({ pageIndex, label: page.bookNo });
		else if (page.kind === "content" && page.bookmark && page.title) {
			acc.push({ pageIndex, label: page.title });
		}
		return acc;
	}, []);

// react-pageflip appose lui-même les classes --left/--right/--hard/--soft sur
// la racine qu'on lui donne (voir Nodlik/StPageFlip, HTMLPage.ts) : le CSS de
// Lore.css s'appuie sur ces classes plutôt que de recalculer une parité.
const Page = forwardRef(
	(
		props: {
			page: JournalPage;
			folio: number | null;
			lang: "fr" | "en";
			onOpenImage?: (src: string, alt: string) => void;
		},
		ref: ForwardedRef<HTMLDivElement>,
	) => {
		const { page, folio, lang, onOpenImage } = props;
		const t = (b: Bi) => b[lang];

		let content: React.ReactNode;
		switch (page.kind) {
			case "cover":
				content = (
					<div
						className="lore-page lore-cover"
						style={{ backgroundImage: `url(${book01CoverUrl})` }}
					/>
				);
				break;
			case "divider":
				content = (
					<div className="lore-page lore-divider">
						<p className="lore-book-no">{t(page.bookNo)}</p>
						<p className="lore-book-title">
							{t(page.bookTitle)
								.split("\n")
								.map((line, i) => (
									<span key={i}>
										{i > 0 && <br />}
										{line}
									</span>
								))}
						</p>
						<p className="lore-ornament">&#10047;</p>
					</div>
				);
				break;
			case "sealed":
				content = (
					<div className="lore-page lore-divider">
						<p className="lore-book-no">{t(page.bookNo)}</p>
						<p className="lore-book-title">{t(page.bookTitle)}</p>
						<p className="lore-book-sub">{t(page.bookSub)}</p>
						<div className="lore-wax-row">
							{page.waxList.map((w, i) => (
								<div className="lore-wax" key={i}>
									{w}
								</div>
							))}
						</div>
						<p className="lore-book-sub" style={{ marginTop: 14 }}>
							{t(page.note)}
						</p>
					</div>
				);
				break;
			case "colophon":
				content = (
					<div className="lore-page">
						<p className="lore-page-title">{t(page.title)}</p>
						{page.paragraphs.map((p, i) => (
							<p key={i}>{t(p)}</p>
						))}
					</div>
				);
				break;
			case "content-italic":
				content = (
					<div className="lore-page">
						<p style={{ fontStyle: "italic" }}>{t(page.text)}</p>
					</div>
				);
				break;
			case "map": {
				const src = MAP_URLS[lang === "fr" ? page.srcFr : page.srcEn];
				const alt = lang === "fr" ? "Carte de Mydaria" : "Map of Mydaria";
				content = (
					<div className="lore-page lore-map">
						<img
							className="lore-map-img"
							src={src}
							alt={alt}
							onClick={(e) => {
								e.stopPropagation();
								onOpenImage?.(src, alt);
							}}
						/>
					</div>
				);
				break;
			}
			case "content":
				content = (
					<div className="lore-page">
						{page.title && <p className="lore-page-title">{t(page.title)}</p>}
						{page.paragraphs.map((p, i) => (
							<p
								key={i}
								className={i === 0 && page.dropcap ? "lore-dropcap" : undefined}
							>
								{t(p)}
							</p>
						))}
					</div>
				);
				break;
		}

		const torn = page.kind === "content" ? page.torn : undefined;
		return (
			<div
				className={`lore-page-face${torn ? ` lore-torn-${torn}` : ""}${page.kind === "cover" ? " lore-page-face--cover" : ""}`}
				ref={ref}
			>
				{content}
				{folio !== null && !torn && (
					<span className="lore-page-no">{folio} p.</span>
				)}
			</div>
		);
	},
);
Page.displayName = "JournalPage";

const Lore = () => {
	const { language, setLanguage } = useLanguage();
	const prefersReducedMotion = usePrefersReducedMotion();
	// Visionneuse plein ecran pour les cartes (demande explicite) : src/alt de
	// l'image actuellement agrandie, ou null si fermee. Remonte depuis Page
	// via onOpenImage plutot que gere localement a chaque page, pour pouvoir
	// la rendre une seule fois, par portail, au-dessus de tout le reste
	// (voir Portal plus bas — essentiel pendant l'animation d'ouverture du
	// livre, qui pose un transform inline sur .lore-book-wrap : un position
	// fixed imbrique dedans se positionnerait contre CE transform plutot que
	// contre le viewport).
	const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
	useEffect(() => {
		if (!lightbox) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setLightbox(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [lightbox]);
	// null = salle des archives (étagères, tranches à cliquer) ; sinon index
	// du tome ouvert dans JOURNAL_BOOKS (journalAldrenia.ts), un tome par
	// époque. Les autres emplacements libres repérés sur archives.jpg pour les
	// tomes suivants sont documentés plus bas, sur le rendu de l'étagère.
	const [openedBookIndex, setOpenedBookIndex] = useState<number | null>(null);
	const openedBook = openedBookIndex === null ? null : JOURNAL_BOOKS[openedBookIndex];
	// Tome dont l'infobulle maison est affichee (survol ou focus clavier de sa
	// tranche), ou null. Remplace l'attribut title des tranches : l'infobulle
	// native du navigateur ne se style pas et met une seconde a apparaitre
	// (demande explicite). L'aria-label, lui, reste sur le bouton — un lecteur
	// d'ecran n'a que faire d'une etiquette dessinee.
	const [hoveredBookIndex, setHoveredBookIndex] = useState<number | null>(null);
	const pages = openedBook ? openedBook.pages : NO_PAGES;
	// Recalculé à chaque changement de tome : les emplacements verticaux des
	// onglets sont des index dans CE tableau, donc propres au tome ouvert.
	const bookmarks = useMemo(() => computeBookmarks(pages), [pages]);
	const wrapRef = useRef<HTMLDivElement | null>(null);
	// Largeur d'UNE page (pas de la double-page), poussée en variable CSS pour
	// que police/marges se calent dessus. Les container queries (cqw) se sont
	// montrées peu fiables ici (resolution incohérente constatée en test,
	// même isolée, sans doute un souci de timing du navigateur sur un élément
	// qui est À LA FOIS le conteneur de requête et la cible stylée) : mesure
	// directe via ResizeObserver, déterministe, pas de piège de ce genre.
	const [pageWidthPx, setPageWidthPx] = useState(320);
	const isPortraitRef = useRef(false);
	// Pousse une classe pendant qu'une page tourne, pour épaissir son ombre de
	// tranche (voir Lore.css) le temps du geste : StPageFlip anime une page
	// "souple" en 2D (clip-path + rotation dans le plan, pas un vrai flip 3D,
	// vérifié dans sa source), donc une vraie tranche extrudée n'a rien à
	// quoi s'accrocher ; l'ombre qui s'accentue pendant le mouvement est ce
	// qui se rapproche le plus d'un "vrai papier" sans se battre contre sa
	// géométrie.
	const [isFlipping, setIsFlipping] = useState(false);
	// Tant qu'on est sur la couverture (avant tout flip), le livre n'a
	// qu'une seule page réelle à montrer : forcer la largeur du wrap sous
	// le seuil recto/verso de la librairie (voir plus bas,
	// .lore-book-wrap--cover) pour qu'elle le mette elle-même en page
	// unique centrée, au lieu du spread page-vierge/couverture décalé à
	// droite qu'on avait avec la largeur double-page par défaut. Séparé de
	// l'index de page réel (qu'on n'a par ailleurs besoin de connaître nulle
	// part ici) pour pouvoir le faire passer à false AVANT le flip qui
	// quitte la couverture, le temps de l'animation de glissement
	// ci-dessous (slideToSpreadSlot). Doublé d'une ref (isCoverWidthRef) qui
	// porte la même valeur : processFlipQueue est rappelée via
	// `setTimeout(processFlipQueue, 0)` juste après avoir déclenché ce
	// setState, donc DANS LA MÊME passe — la closure de processFlipQueue
	// capturée à ce rendu-là lirait encore l'ANCIENNE valeur de isCoverWidth
	// (React ne la met à jour qu'au rendu suivant), ce qui relançait un
	// second glissement pour rien et bloquait la file dès le clic suivant.
	// Une ref n'a pas ce problème, elle est toujours à jour.
	const [isCoverWidth, setIsCoverWidth] = useState(true);
	const isCoverWidthRef = useRef(true);
	const flipBookRef = useRef<FlipBookHandle | null>(null);
	// react-pageflip/StPageFlip ne met pas en file les clics reçus pendant une
	// animation en cours : un clic pendant un flip annule/retasse l'animation
	// en route plutôt que de l'enchaîner, ce qui faisait "sauter" plusieurs
	// pages et changer tout le texte d'un coup. On gère donc nous-mêmes le
	// clic (plus de flip par clic coté librairie, voir disableFlipByClick/
	// showPageCorners plus bas) : chaque clic empile une direction, et on ne
	// dépile vers le pageFlip que lorsque l'animation précédente est bien
	// revenue à l'état "read".
	const flipQueueRef = useRef<Array<"next" | "prev">>([]);
	const isFlipBusyRef = useRef(false);
	// Vrai depuis le tout premier clic sur la couverture jusqu'à ce que le
	// livre soit effectivement ouvert (tournage compris) — tant qu'il l'est,
	// enqueueFlip ignore purement et simplement tout nouveau clic au lieu de
	// l'empiler (demande explicite) : empiler aurait fait rejouer tout seul,
	// une fois le livre ouvert, les clics reçus entre temps (6 clics rapides
	// sur la couverture faisaient par exemple feuilleter jusqu'à la page 6).
	// Distinct de isFlipBusyRef, qui lui reste utile APRÈS l'ouverture pour
	// mettre en file les tournages de page normaux.
	const isOpeningRef = useRef(false);

	const playPageTurnSound = () => {
		const audio = new Audio(pageTurnSoundUrl);
		audio.volume = 0.4;
		audio.play().catch(() => {});
	};

	// Glisse le wrap vers sa place de page droite dans le spread, PUIS bascule
	// en largeur double page, AVANT que le tournage ne commence — remplace
	// une première version qui animait la LARGEUR (couverture seule -> place
	// ouverte) : tant que react-pageflip ignore encore qu'il doit passer en
	// double page (il ne remesure que sur l'évènement window "resize", voir
	// plus bas), la seule page qu'il affiche occupe TOUTE la largeur du wrap
	// — donc en l'étirant en direct jusqu'à la largeur double page, c'est la
	// couverture elle-même qui s'étirait/se déformait en grandissant, avant
	// de se rétrécir d'un coup une fois le resize pris en compte. Un
	// déplacement pur (translateX) ne redimensionne jamais rien : la
	// couverture garde sa taille du début à la fin, elle change juste de
	// position — exactement ce que ferait un vrai livre qu'on pousse vers sa
	// place avant de l'ouvrir.
	//
	// Le calcul qui rend ça exact sans aucun saut au relâchement : la
	// largeur de .lore-book-wrap--cover (Lore.css) est TOUJOURS exactement
	// la moitié de celle de .lore-book-wrap en double page (mêmes bornes
	// divisées par deux, à tenir synchronisé si l'une des deux change). Avec
	// PW cette largeur couverture, décaler le wrap de +PW/2 place donc son
	// bord droit exactement là où tombera le bord droit de la page de
	// droite une fois le wrap repassé à 2×PW (centré, donc bordé par
	// [centre-PW, centre+PW]) : le glissement amène la couverture pile dans
	// la moitié droite de cette future largeur, bord à bord.
	const slideToSpreadSlot = (onDone: () => void) => {
		const el = wrapRef.current;
		if (!el) {
			onDone();
			return;
		}
		const commitSpread = () => {
			isCoverWidthRef.current = false;
			// flushSync (pas de useState + requestAnimationFrame) : on avait un
			// bref flash juste avant l'ouverture, le temps d'une frame où la
			// classe --cover était déjà retirée (React ne l'applique qu'au
			// PROCHAIN paint) mais où l'inline transform posé par motion était
			// encore là — le wrap se retrouvait un instant à sa largeur double
			// page ET décalé du glissement en même temps, trop loin à droite,
			// avant de se recaler d'un coup. flushSync force le changement de
			// classe (donc de largeur) à être peint AVANT la ligne suivante qui
			// efface la translation : les deux ne sont donc plus jamais vrais
			// en même temps sur un même paint.
			flushSync(() => setIsCoverWidth(false));
			el.style.transform = "";
			window.dispatchEvent(new Event("resize"));
			onDone();
		};
		if (prefersReducedMotion) {
			commitSpread();
			return;
		}
		const shift = el.getBoundingClientRect().width / 2;
		animate(el, { x: [0, shift] }, { duration: 0.4, ease: "easeInOut" }).then(commitSpread);
	};

	const processFlipQueue = () => {
		if (isFlipBusyRef.current) return;
		const next = flipQueueRef.current.shift();
		if (!next) return;
		const pageFlip = flipBookRef.current?.pageFlip();
		if (!pageFlip) return;
		isFlipBusyRef.current = true;
		if (isCoverWidthRef.current && next === "next") {
			// Premier clic : on quitte la couverture. Le livre doit avoir
			// fini de glisser à sa place ouverte avant que la page ne
			// tourne (demande explicite) — isOpeningRef reste à true tout ce
			// temps, donc enqueueFlip ignore tout nouveau clic au lieu de
			// l'empiler (voir plus haut) tant que l'ouverture n'est pas
			// entièrement terminée.
			isOpeningRef.current = true;
			slideToSpreadSlot(() => {
				playPageTurnSound();
				pageFlip.flipNext();
			});
		} else {
			playPageTurnSound();
			if (next === "next") pageFlip.flipNext();
			else pageFlip.flipPrev();
		}
	};

	const enqueueFlip = (direction: "next" | "prev") => {
		if (isOpeningRef.current) return;
		flipQueueRef.current.push(direction);
		processFlipQueue();
	};

	// StPageFlip anime lui-meme le glisser-deposer d'une page (useMouseEvents,
	// natif — ne pas confondre avec son flip-par-simple-clic, explicitement
	// desactive via disableFlipByClick plus bas). Le probleme : un VRAI clic
	// React se declenche quand meme a la fin d'un drag (mousedown puis
	// mouseup, meme avec un deplacement important entre les deux), donc
	// handleBookClick se declenchait EN PLUS de l'animation de glisser deja
	// jouee par la librairie — selon ou la souris finissait (typiquement sur
	// la page opposee une fois le drag termine), ca enclenchait un second
	// tournage, parfois dans le sens inverse de celui du drag, d'ou l'aller-
	// retour ou le livre qui se detraque carrement pres de la couverture (la
	// chorégraphie glissement+tournage de l'ouverture ne tolere pas un
	// second tournage concurrent). mouseDownXRef retient la position de
	// depart ; un clic dont le point d'arrivee s'en est trop ecarte est un
	// drag deja gere par la librairie, pas un vrai clic — on l'ignore.
	const mouseDownXRef = useRef<number | null>(null);
	const DRAG_CLICK_THRESHOLD = 8;
	const handleBookMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		mouseDownXRef.current = e.clientX;
	};
	const handleBookClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const downX = mouseDownXRef.current;
		mouseDownXRef.current = null;
		if (downX !== null && Math.abs(e.clientX - downX) > DRAG_CLICK_THRESHOLD) return;
		// isPointOnCorners (node_modules/page-flip/.../Flip.ts) ignore
		// disableFlipByClick pres des coins de la page : un clic la-dessus
		// declenche quand meme un tournage natif cote librairie, de facon
		// SYNCHRONE dans son propre mouseup (userStop -> flip()), donc AVANT
		// que ce handler React ne s'execute. isFlipBusyRef reste a false (on
		// n'a nous-memes rien declenche) alors que pageFlip.getState() est
		// deja passe a "flipping" : signature propre a ce cas, qui le
		// distingue d'un clic recu PENDANT un tournage que CE code a
		// lui-meme lance (celui-la doit au contraire s'empiler normalement,
		// voir plus bas) — sans ce garde-fou, le meme clic empilait un
		// second tournage par-dessus celui de la librairie, d'ou l'animation
		// qui se detraquait pres des coins du livre.
		const pageFlip = flipBookRef.current?.pageFlip();
		if (pageFlip && !isFlipBusyRef.current && pageFlip.getState() !== "read") return;
		const rect = e.currentTarget.getBoundingClientRect();
		const clickedRight = e.clientX - rect.left > rect.width / 2;
		enqueueFlip(clickedRight ? "next" : "prev");
	};

	// onFlip se déclenche dès le DÉBUT du tournage, pas à la fin — passer
	// isCoverWidth (donc rétrécir .lore-book-wrap) à ce moment-là
	// redimensionnerait le livre PENDANT l'animation de la page. En
	// ouverture, slideToSpreadSlot s'en charge déjà AVANT le flip (voir plus
	// haut) ; il ne reste donc à gérer ici que la fermeture (retour à la
	// couverture), rétrécie une fois le tournage retour bien terminé — pas
	// encore animée avec motion, seule l'ouverture a été demandée.
	const pendingIsCoverRef = useRef(true);
	// Pilote le cote (gauche/droite) de chaque marque-page (voir BOOKMARKS
	// plus haut) : mis a jour a chaque tournage reellement effectue, pas
	// seulement sur un clic de marque-page (navigation normale au fil de
	// la lecture aussi prise en compte).
	const [currentPageIndex, setCurrentPageIndex] = useState(0);
	const handleFlip = (e: { data: number }) => {
		pendingIsCoverRef.current = e.data === 0;
		setCurrentPageIndex(e.data);
	};

	// Cible d'un saut de marque-page en cours (voir jumpToPage), consommee
	// par handleChangeState : tant qu'elle est posee, chaque tournage qui se
	// termine en enchaine un autre vers elle au lieu de laisser la file
	// d'attente se vider. null = aucun saut en cours (navigation normale).
	const jumpTargetRef = useRef<number | null>(null);
	// Filet de securite : un saut ne doit jamais prendre plus de tournages
	// que de pages dans le livre. Coupe court plutot que de boucler pour de
	// bon si l'index cible ne finit jamais par matcher getCurrentPageIndex()
	// (cas qui ne devrait pas arriver, les deux viennent de la meme
	// collection de pages, mais mieux vaut un saut qui s'arrete tot qu'un
	// qui ne s'arrete jamais).
	const JUMP_STEP_LIMIT = pages.length;
	const jumpStepsLeftRef = useRef(0);

	// Saut vers la page d'un marque-page, feuillete comme une vraie
	// navigation : enchaine plusieurs flipNext()/flipPrev() normaux via la
	// MEME file que les clics habituels (flipQueueRef/processFlipQueue,
	// voir le commentaire sur PageFlipInstance.getCurrentPageIndex plus
	// haut), un par un, chacun anime. Le premier pas reutilise enqueueFlip
	// telle quelle (gere deja l'ouverture depuis la couverture) ; les pas
	// suivants sont ajoutes par handleChangeState, ci-dessous, a la fin de
	// chaque tournage.
	const jumpToPage = (target: number) => {
		if (isFlipBusyRef.current || target === currentPageIndex) return;
		jumpTargetRef.current = target;
		jumpStepsLeftRef.current = JUMP_STEP_LIMIT;
		enqueueFlip(target > currentPageIndex ? "next" : "prev");
	};

	const handleChangeState = (e: { data: string }) => {
		setIsFlipping(e.data === "flipping");
		if (e.data === "read") {
			isFlipBusyRef.current = false;
			isOpeningRef.current = false;
			const wasCover = isCoverWidthRef.current;
			isCoverWidthRef.current = pendingIsCoverRef.current;
			setIsCoverWidth(pendingIsCoverRef.current);
			// Fermeture (retour à la couverture) : prévenir react-pageflip du
			// rétrécissement, comme slideToSpreadSlot le fait déjà pour
			// l'ouverture — un seul dispatch par transition (voir le
			// commentaire détaillé plus bas, sur l'ancien useEffect générique
			// qui en posait un second à chaque fois : la rafale de resizes
			// qui en résultait sous clics répétés finissait par corrompre
			// l'état interne de la librairie, react-pageflip se mettant à
			// cloner ses pages en double — symptôme observé : l'avertissement
			// React "two children with the same key").
			if (!wasCover && pendingIsCoverRef.current) {
				requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
			}
			// Saut de marque-page en cours (jumpTargetRef, voir jumpToPage) :
			// le tournage qui vient de se terminer a-t-il atteint la cible, ou
			// faut-il en enchainer un autre ? getCurrentPageIndex() (valeur
			// fraiche de la librairie) plutot que l'etat React currentPageIndex,
			// dont la mise a jour par ce meme rendu n'est pas garantie visible
			// ici. Le pas suivant est empile AVANT le flush de la file ci-
			// dessous, pour qu'il parte avec les autres tournages en attente.
			//
			// PageCollection.showSpread() (node_modules/page-flip/src/
			// Collection/PageCollection.ts) pose TOUJOURS currentPageIndex a
			// spread[0], la page de GAUCHE de la double page affichee, jamais
			// celle de droite. Une cible qui tombe a droite de sa propre
			// double page ne peut donc jamais egaler `current` au sens
			// strict — sans la tolerance ci-dessous (`<= 1`, la cible est
			// soit affichee a gauche, soit juste a droite), le saut
			// oscillait indefiniment entre les deux pages voisines de la
			// cible au lieu de s'arreter dessus.
			const jt = jumpTargetRef.current;
			if (jt !== null) {
				const pf = flipBookRef.current?.pageFlip();
				const current = pf?.getCurrentPageIndex();
				const reached = current !== undefined && Math.abs(current - jt) <= 1;
				if (reached || jumpStepsLeftRef.current <= 0) {
					jumpTargetRef.current = null;
				} else {
					jumpStepsLeftRef.current -= 1;
					flipQueueRef.current.push(
						current !== undefined && current < jt ? "next" : "prev",
					);
				}
			}
			// Rappeler flipNext()/flipPrev() de façon SYNCHRONE depuis ce
			// handler (donc depuis l'intérieur du traitement interne de
			// StPageFlip de la fin du flip précédent) fait résoudre le flip
			// suivant instantanément, sans animation (vérifié : les clics en
			// rafale sautaient directement à la page finale). Décaler au tick
			// suivant laisse StPageFlip terminer proprement son nettoyage
			// interne avant de redémarrer une animation.
			setTimeout(processFlipQueue, 0);
		}
	};

	useEffect(() => {
		const el = wrapRef.current;
		if (!el) return;
		const recompute = (wrapWidth: number) => {
			setPageWidthPx(isPortraitRef.current ? wrapWidth : wrapWidth / 2);
		};
		const ro = new ResizeObserver((entries) => {
			const w = entries[0]?.contentRect.width;
			if (w) recompute(w);
		});
		ro.observe(el);
		recompute(el.getBoundingClientRect().width);
		return () => ro.disconnect();
	}, []);

	const handleChangeOrientation = (e: { data: string }) => {
		isPortraitRef.current = e.data === "portrait";
		const w = wrapRef.current?.getBoundingClientRect().width;
		if (w) setPageWidthPx(isPortraitRef.current ? w : w / 2);
	};

	// Lien de sortie, partage par les deux vues : cette page n'a pas de
	// Navbar (plein ecran immersif, voir App.tsx), donc sans lui il n'existe
	// aucun moyen de quitter /lore autrement que le bouton precedent/retour
	// du navigateur. Vers "/" faute de page d'origine identifiee (aucune
	// page du site ne lie encore vers /lore a ce jour).
	// Ouvrir/refermer un tome remet a zero TOUT l'etat de feuilletage, pas
	// seulement l'index de page : passer d'un tome a l'autre reutilise le meme
	// composant, donc un livre rouvert apres coup heritait sinon de la
	// couverture deja "glissee" (isCoverWidth), d'une file de tournages encore
	// pleine ou d'un saut de marque-page jamais termine, et s'ouvrait en plein
	// milieu ou restait bloque au premier clic.
	const resetFlipState = () => {
		flipQueueRef.current = [];
		isFlipBusyRef.current = false;
		isOpeningRef.current = false;
		jumpTargetRef.current = null;
		jumpStepsLeftRef.current = 0;
		pendingIsCoverRef.current = true;
		isCoverWidthRef.current = true;
		setIsCoverWidth(true);
		setIsFlipping(false);
		setCurrentPageIndex(0);
	};
	const openBook = (index: number) => {
		resetFlipState();
		setHoveredBookIndex(null);
		setOpenedBookIndex(index);
	};
	const closeBook = () => {
		resetFlipState();
		setOpenedBookIndex(null);
	};

	const siteLink = (
		<Link to="/" className="lore-site-link">
			{language === "fr" ? "↩ Retour au site" : "↩ Back to the site"}
		</Link>
	);

	// Bouton FR/EN partage par les deux vues (archives + lecture) — meme
	// LanguageContext que le reste du site (voir Navbar.tsx), juste un
	// habillage different puisque cette page n'a pas de Navbar.
	const langToggle = (
		<div className="lore-lang-toggle">
			<button
				type="button"
				className={language === "fr" ? "active" : ""}
				onClick={() => setLanguage("fr")}
			>
				FR
			</button>
			<span>/</span>
			<button
				type="button"
				className={language === "en" ? "active" : ""}
				onClick={() => setLanguage("en")}
			>
				EN
			</button>
		</div>
	);

	if (openedBookIndex === null) {
		return (
			<div className="lore-room lore-archive-room">
				{/* .lore-cover-frame reproduit object-fit:cover comme une vraie
				   boite (voir Lore.css) : image ET boutons vivent dedans pour
				   partager le meme repere en %, peu importe le ratio de l'ecran. */}
				<div className="lore-cover-frame">
					{/* draggable={false} : une <img> se laisse glisser par defaut
					   (fantome de glissement, depot dans un autre onglet), ce qui
					   n'a aucun sens pour un decor — double de regles CSS sur
					   .lore-room-bg pour WebKit, qui ignore l'attribut par endroits. */}
					<img className="lore-room-bg" src={archivesBgUrl} alt="" draggable={false} />
					{/* Une tranche cliquable par tome de JOURNAL_BOOKS, posee sur
					   l'etagere vide qui suit le pilier central droit (y: 48%-54%).
					   Seul shelfLeft change d'un tome a l'autre (en % de l'image
					   source 1344x768, comme tout le reste de ce cadre) : le calage
					   vertical et la taille restent ceux calibres sur cette etagere
					   dans Lore.css, donc tous les tomes se posent exactement sur la
					   meme planche, comme une vraie collection.
					   Autres rangees libres relevees sur l'image, pour quand cette
					   etagere sera pleine (elle porte deja un livret ouvert peint
					   vers x: 65%) : la grande etagere centrale basse (x: 28%-73%,
					   y: 77%-85%) et la rangee quasi vide x: 14%-27%, y: 35%-40% —
					   l'une comme l'autre demanderont leur propre calage vertical.
					   title (infobulle native) : meme convention que les marque-pages
					   du livre ouvert (.lore-bookmark plus bas), plutot qu'une
					   infobulle maison a styler. Double de l'aria-label, qui lui
					   porte l'ACTION ("Ouvrir...") attendue par un lecteur d'ecran
					   sur un bouton, quand l'infobulle ne fait que nommer le tome. */}
					{JOURNAL_BOOKS.map((b, i) => (
						<button
							key={b.id}
							type="button"
							className="lore-archive-book"
							style={{
								backgroundImage: `url(${book01SpineUrl})`,
								left: b.shelfLeft,
							}}
							onClick={() => openBook(i)}
							onMouseEnter={() => setHoveredBookIndex(i)}
							onMouseLeave={() =>
								setHoveredBookIndex((h) => (h === i ? null : h))
							}
							onFocus={() => setHoveredBookIndex(i)}
							onBlur={() => setHoveredBookIndex((h) => (h === i ? null : h))}
							aria-label={
								language === "fr"
									? `Ouvrir : ${b.label.fr}`
									: `Open: ${b.label.en}`
							}
						/>
					))}
					{hoveredBookIndex !== null && (
						<div
							className="lore-archive-tip"
							style={{
								left: `calc(${JOURNAL_BOOKS[hoveredBookIndex].shelfLeft} + 1.5%)`,
							}}
						>
							{JOURNAL_BOOKS[hoveredBookIndex].label[language]}
						</div>
					)}
				</div>
				{siteLink}
				{langToggle}
			</div>
		);
	}

	return (
		<div
			className={`lore-room${isFlipping ? " lore-room--flipping" : ""}`}
			style={{ "--lore-page-w": `${pageWidthPx}px` } as React.CSSProperties}
		>
			<img
				className="lore-room-bg lore-room-bg--dim"
				src={archivesBgUrl}
				alt=""
				draggable={false}
			/>
			<button type="button" className="lore-back-button" onClick={closeBook}>
				{language === "fr" ? "← Retour" : "← Back"}
			</button>
			{siteLink}
			{langToggle}
			<div className="lore-stage">
				{/* Dos de la couverture, derrière le bloc de pages (demande
				   explicite) : posé un peu plus grand que le livre pour dépasser
				   visiblement sur les côtés et en bas, comme les plats d'un vrai
				   livre vus de derrière le bloc de pages. Couleur unie (pas la
				   texture de book-01.png) : la réutiliser créait l'effet d'une
				   deuxième couverture qui se devine en transparence aux bords.
				   TOUJOURS à la taille double-page (demande explicite), que le
				   livre soit fermé ou ouvert — un livre garde physiquement ses
				   plats à leur taille dans les deux cas ; .lore-book-wrap, lui,
				   gagne overflow:hidden (Lore.css) pour que ce fond plus large ne
				   laisse jamais deviner les pages suivantes quand le livre est
				   fermé. */}
				<div
					className="lore-book-backdrop"
				/>
				<div
					className={`lore-book-wrap${isCoverWidth ? " lore-book-wrap--cover" : ""}`}
					ref={wrapRef}
					onMouseDown={handleBookMouseDown}
					onClick={handleBookClick}
				>
					<HTMLFlipBook
						ref={flipBookRef}
						className="lore-flipbook"
						style={{}}
						onFlip={handleFlip}
						onChangeOrientation={handleChangeOrientation}
						onChangeState={handleChangeState}
						// width/height ne fixent que le ratio pour le dimensionnement
						// "stretch" (pageWidth/pageHeight) — la taille réelle vient de
						// .lore-flipbook dans Lore.css, contrainte pour ne jamais
						// dépasser ni la largeur ni la hauteur de la fenêtre. Ratio
						// légèrement élargi par rapport à l'artifact (page 3:4,
						// donc double page 3:2 -> page 4:5, double page 4:2.5).
						width={820}
						height={1000}
						size="stretch"
						minWidth={380}
						maxWidth={820}
						minHeight={463}
						maxHeight={1000}
						startPage={0}
						showCover
						flippingTime={prefersReducedMotion ? 1 : 260}
						maxShadowOpacity={0.6}
						// StPageFlip bascule tout seul en page unique dès que la largeur
						// disponible descend sous minWidth*2 (760px ici). Avec un seuil
						// plus bas (480px), une tablette en portrait (~768px de large)
						// passait quand même en recto/verso, avec des demi-pages trop
						// étroites (353px) pour contenir le texte sans déborder (mesuré
						// via check-overflow.cjs) : mieux vaut une page pleine largeur à
						// cette taille-là que deux demi-pages trop serrées.
						usePortrait
						startZIndex={10}
						autoSize
						drawShadow
						mobileScrollSupport
						swipeDistance={30}
						clickEventForward
						useMouseEvents
						// Le flip par clic est désormais géré entièrement à la main
						// (handleBookClick + file d'attente ci-dessus) : la librairie
						// ne doit plus déclencher de flip toute seule au clic, sans
						// quoi les deux déclencheurs se chevaucheraient. showPageCorners
						// à false pour la même raison (le survol/clic d'un coin replié
						// déclenche aussi un flip côté librairie, même avec
						// disableFlipByClick). Le glisser-déposer (useMouseEvents) reste
						// natif, il n'a pas le problème des clics multiples.
						showPageCorners={false}
						disableFlipByClick
					>
						{pages.map((page, i) => (
							<Page
								key={i}
								page={page}
								folio={i === 0 ? null : i + 1}
								lang={language}
								onOpenImage={(src, alt) => setLightbox({ src, alt })}
							/>
						))}
					</HTMLFlipBook>
					{/* Marque-pages : un par page titree (BOOKMARKS, calcule plus haut).
					   Enfant de .lore-book-wrap (pas .lore-stage) pour que inset:0 se
					   resolve contre la largeur REELLE du livre (couverture etroite ou
					   double-page) — ancre sur .lore-stage, bien plus large que le livre,
					   les onglets sortaient de l'ecran, loin du bord reel des pages.
					   Position verticale fixe (slot = index dans BOOKMARKS, voir
					   Lore.css .lore-bookmark) ; seul le cote change — a droite tant
					   que la page n'a pas ete atteinte, a gauche une fois depassee —
					   sans jamais changer l'ordre vertical des onglets entre eux. */}
					<div className="lore-bookmarks">
						{bookmarks.map((bm, slot) => {
							const passed = bm.pageIndex < currentPageIndex;
							return (
								<button
									key={bm.pageIndex}
									type="button"
									className={`lore-bookmark ${passed ? "lore-bookmark--left" : "lore-bookmark--right"}`}
									style={{ top: slot * TAB_HEIGHT }}
									onClick={(e) => {
								e.stopPropagation();
								jumpToPage(bm.pageIndex);
							}}
									title={bm.label[language]}
								>
									{bm.label[language]}
								</button>
							);
						})}
					</div>
				</div>
			</div>
			{lightbox && (
				<Portal>
					{/* Visionneuse plein ecran (demande explicite), meme principe
					   qu'un lightbox de site classique : fond assombri, image
					   centree, fermeture au clic n'importe ou dessus ou sur Echap.
					   Les cartes sont tournees en portrait pour tenir dans une page
					   du livre (voir le script de rotation, hors depot) ; ici on les
					   remontre a l'horizontale (rotate(-90deg), l'inverse exact de
					   cette rotation) pour les lire confortablement en grand. */}
					<div
						className="lore-lightbox"
						onClick={() => setLightbox(null)}
						role="button"
						tabIndex={0}
						aria-label={language === "fr" ? "Fermer" : "Close"}
					>
						<button
							type="button"
							className="lore-lightbox-close"
							onClick={() => setLightbox(null)}
						>
							×
						</button>
						<img className="lore-lightbox-img" src={lightbox.src} alt={lightbox.alt} />
					</div>
				</Portal>
			)}
		</div>
	);
};

export default Lore;
