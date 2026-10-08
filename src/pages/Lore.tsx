import type { ForwardedRef } from "react";
import { forwardRef, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

import { JOURNAL_PAGES, type JournalPage } from "../data/journalAldrenia";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import "./Lore.css";

// react-pageflip appose lui-même les classes --left/--right/--hard/--soft sur
// la racine qu'on lui donne (voir Nodlik/StPageFlip, HTMLPage.ts) : le CSS de
// Lore.css s'appuie sur ces classes plutôt que de recalculer une parité.
const Page = forwardRef((props: { page: JournalPage; folio: number | null }, ref: ForwardedRef<HTMLDivElement>) => {
	const { page, folio } = props;

	let content: React.ReactNode;
	switch (page.kind) {
		case "cover":
			content = (
				<div className="lore-page lore-cover">
					<div className="lore-seal-big">A</div>
					<p className="lore-cover-title">Journal d'Aldrenia</p>
					<p className="lore-cover-sub">Chancellerie du Royaume</p>
				</div>
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
						<p key={i} className={i === 0 && page.dropcap ? "lore-dropcap" : undefined}>
							{p}
						</p>
					))}
				</div>
			);
			break;
	}

	const torn = page.kind === "content" ? page.torn : undefined;
	return (
		<div className={`lore-page-face${torn ? ` lore-torn-${torn}` : ""}`} ref={ref}>
			{content}
			{folio !== null && !torn && <span className="lore-page-no">{folio} p.</span>}
		</div>
	);
});
Page.displayName = "JournalPage";

const Lore = () => {
	const prefersReducedMotion = usePrefersReducedMotion();
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
	const handleChangeState = (e: { data: string }) => setIsFlipping(e.data === "flipping");

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

	return (
		<div
			className={`lore-room${isFlipping ? " lore-room--flipping" : ""}`}
			style={{ "--lore-page-w": `${pageWidthPx}px` } as React.CSSProperties}
		>
			<div className="lore-stage">
				<div className="lore-book-wrap" ref={wrapRef}>
					<HTMLFlipBook
						className="lore-flipbook"
						style={{}}
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
						flippingTime={prefersReducedMotion ? 1 : 900}
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
						showPageCorners
						disableFlipByClick={false}
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
