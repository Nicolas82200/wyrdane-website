import { animate } from "motion";
import type { ForwardedRef } from "react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import HTMLFlipBook from "react-pageflip";

import archivesBgUrl from "../assets/site/archives.jpg";
import book01CoverUrl from "../assets/site/book-01.png";
import book01SpineUrl from "../assets/site/book01-spine.png";
import pageTurnSoundUrl from "../assets/site/page-turn.wav";
import { JOURNAL_PAGES, type JournalPage } from "../data/journalAldrenia";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import "./Lore.css";

// Instance StPageFlip exposée par react-pageflip via ref.current.pageFlip()
// (voir node_modules/react-pageflip/build/index.es.js) — non typée par le
// paquet, d'où ce typage minimal couvrant juste ce qu'on utilise ici.
interface PageFlipInstance {
	flipNext: (corner?: "top" | "bottom") => void;
	flipPrev: (corner?: "top" | "bottom") => void;
	getState: () => "user_fold" | "fold_corner" | "flipping" | "read";
}
type FlipBookHandle = { pageFlip: () => PageFlipInstance };

// react-pageflip appose lui-même les classes --left/--right/--hard/--soft sur
// la racine qu'on lui donne (voir Nodlik/StPageFlip, HTMLPage.ts) : le CSS de
// Lore.css s'appuie sur ces classes plutôt que de recalculer une parité.
const Page = forwardRef(
	(
		props: { page: JournalPage; folio: number | null },
		ref: ForwardedRef<HTMLDivElement>,
	) => {
		const { page, folio } = props;

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
						<p className="lore-book-no">{page.bookNo}</p>
						<p className="lore-book-title">
							{page.bookTitle.split("\n").map((line, i) => (
								<span key={i}>
									{i > 0 && <br />}
									{line}
								</span>
							))}
						</p>
						<p className="lore-book-sub">{page.bookSub}</p>
						<p className="lore-ornament">&#10047;</p>
					</div>
				);
				break;
			case "sealed":
				content = (
					<div className="lore-page lore-divider">
						<p className="lore-book-no">{page.bookNo}</p>
						<p className="lore-book-title">{page.bookTitle}</p>
						<p className="lore-book-sub">{page.bookSub}</p>
						<div className="lore-wax-row">
							{page.waxList.map((w) => (
								<div className="lore-wax" key={w}>
									{w}
								</div>
							))}
						</div>
						<p className="lore-book-sub" style={{ marginTop: 14 }}>
							{page.note}
						</p>
					</div>
				);
				break;
			case "colophon":
				content = (
					<div className="lore-page">
						<p className="lore-page-title">{page.title}</p>
						{page.paragraphs.map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>
				);
				break;
			case "content-italic":
				content = (
					<div className="lore-page">
						<p style={{ fontStyle: "italic" }}>{page.text}</p>
					</div>
				);
				break;
			case "content":
				content = (
					<div className="lore-page">
						{page.title && <p className="lore-page-title">{page.title}</p>}
						{page.paragraphs.map((p, i) => (
							<p
								key={i}
								className={i === 0 && page.dropcap ? "lore-dropcap" : undefined}
							>
								{p}
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
	const prefersReducedMotion = usePrefersReducedMotion();
	// false = salle des archives (étagères, livre à cliquer) ; true = livre
	// ouvert (flipbook). Un seul livre écrit pour l'instant (book-01) — les
	// emplacements vides repérés sur archives.jpg pour les prochains sont
	// documentés sur .lore-archive-book-01 ci-dessous et dans Lore.css.
	const [opened, setOpened] = useState(false);
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

	const handleBookClick = (e: React.MouseEvent<HTMLDivElement>) => {
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
	const handleFlip = (e: { data: number }) => {
		pendingIsCoverRef.current = e.data === 0;
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

	if (!opened) {
		return (
			<div className="lore-room lore-archive-room">
				<img className="lore-room-bg" src={archivesBgUrl} alt="" />
				{/* Emplacements vides repérés sur archives.jpg (coordonnées en % de
				   l'image 1344x768 source, pour rester justes quelle que soit la
				   taille d'affichage) : la grande étagère centrale basse
				   (x: 28%-73%, y: 77%-85%, quelques livres déjà au centre) a le
				   plus de place pour de futurs tomes des deux côtés de
				   .lore-archive-book-01 ; un petit creux existe aussi vers
				   x: 63%-69%, y: 56%-62% (un seul livret isolé). */}
				<button
					type="button"
					className="lore-archive-book lore-archive-book-01"
					style={{ backgroundImage: `url(${book01SpineUrl})` }}
					onClick={() => setOpened(true)}
					aria-label="Ouvrir le Journal d'Aldrenia"
				/>
			</div>
		);
	}

	return (
		<div
			className={`lore-room${isFlipping ? " lore-room--flipping" : ""}`}
			style={{ "--lore-page-w": `${pageWidthPx}px` } as React.CSSProperties}
		>
			<img className="lore-room-bg lore-room-bg--dim" src={archivesBgUrl} alt="" />
			<button type="button" className="lore-back-button" onClick={() => setOpened(false)}>
				← Retour
			</button>
			<div className="lore-stage">
				{/* Dos de la couverture, derrière le bloc de pages (demande
				   explicite) : pas d'illustration dédiée pour l'intérieur/dos de
				   la reliure, on réutilise donc la texture de book-01.png — posé
				   un peu plus grand que le livre pour dépasser visiblement sur
				   les côtés et en bas, comme les plats d'un vrai livre vus de
				   derrière le bloc de pages (même logique que le léger débord de
				   0.5px sur .lore-cover, en plus prononcé puisque visible en
				   continu et pas seulement sur la tranche). Même bascule
				   couverture/double-page que .lore-book-wrap ci-dessous : un
				   fond resté en permanence à la taille double-page avait l'air
				   énorme derrière la seule couverture, bien plus étroite. */}
				<div
					className={`lore-book-backdrop${isCoverWidth ? " lore-book-backdrop--cover" : ""}`}
					style={{ backgroundImage: `url(${book01CoverUrl})` }}
				/>
				<div
					className={`lore-book-wrap${isCoverWidth ? " lore-book-wrap--cover" : ""}`}
					ref={wrapRef}
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
						flippingTime={prefersReducedMotion ? 1 : 500}
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
						{JOURNAL_PAGES.map((page, i) => (
							<Page key={i} page={page} folio={i === 0 ? null : i + 1} />
						))}
					</HTMLFlipBook>
				</div>
			</div>
		</div>
	);
};

export default Lore;
