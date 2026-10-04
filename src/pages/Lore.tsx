import type { ForwardedRef } from "react";
import { forwardRef } from "react";
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

	return (
		<div className="lore-page-face" ref={ref}>
			{content}
			{folio !== null && <span className="lore-page-no">{folio} p.</span>}
		</div>
	);
});
Page.displayName = "JournalPage";

const Lore = () => {
	const prefersReducedMotion = usePrefersReducedMotion();

	return (
		<div className="lore-room">
			<div className="lore-stage">
				<div className="lore-book-wrap">
					<HTMLFlipBook
						className="lore-flipbook"
						style={{}}
						// width/height ne fixent que le ratio pour le dimensionnement
						// "stretch" (pageWidth/pageHeight) — la taille réelle vient de
						// .lore-flipbook dans Lore.css, contrainte pour ne jamais
						// dépasser ni la largeur ni la hauteur de la fenêtre.
						width={750}
						height={1000}
						size="stretch"
						minWidth={160}
						maxWidth={750}
						minHeight={213}
						maxHeight={1000}
						startPage={0}
						showCover
						flippingTime={prefersReducedMotion ? 1 : 900}
						maxShadowOpacity={0.45}
						// L'artifact de référence ne bascule jamais en page unique (il
						// réduit tout en vw, même sur mobile) : StPageFlip, lui, bascule
						// seul en-dessous de minWidth*2 si usePortrait est actif — on
						// le désactive pour forcer le recto/verso en toute largeur.
						usePortrait={false}
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
