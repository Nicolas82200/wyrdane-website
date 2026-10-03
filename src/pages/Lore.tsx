import type { ForwardedRef } from "react";
import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

import { JOURNAL_PAGES, TOME_TABS, type JournalPage } from "../data/journalAldrenia";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import "./Lore.css";

// Juste ce qu'on utilise de l'API PageFlip (StPageFlip, pas exportée telle
// quelle par react-pageflip — voir node_modules/react-pageflip/build).
interface PageFlipApi {
	getCurrentPageIndex: () => number;
	flipNext: () => void;
	flipPrev: () => void;
	turnToPage: (page: number) => void;
}
type FlipBookRef = { pageFlip: () => PageFlipApi };

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
	const bookRef = useRef<FlipBookRef | null>(null);
	// Page vers laquelle une séquence de marque-page est en train d'avancer,
	// un retournement à la fois ; null quand aucune séquence n'est en cours.
	const chainTarget = useRef<number | null>(null);
	const [currentPage, setCurrentPage] = useState(0);

	const pageIndexBySection = useMemo(() => {
		const map = new Map<string, number>();
		JOURNAL_PAGES.forEach((p, i) => {
			if ("sectionId" in p && p.sectionId) map.set(p.sectionId, i);
			if (p.kind === "cover") map.set("cover", i);
		});
		return map;
	}, []);

	// react-pageflip sait animer un flip vers une page arbitraire (flip(page)),
	// mais StPageFlip saute directement à l'avant-dernière page puis n'anime
	// QUE le dernier tour (voir Flip.ts, flipToPage) — même symptôme que celui
	// qu'on avait diagnostiqué et corrigé dans l'artifact autonome, cette fois
	// dans la librairie elle-même. On rejoue donc chaque page intermédiaire en
	// chaînant flipNext/flipPrev un par un, repris à chaque "onFlip".
	const handleFlip = useCallback((e: { data: number }) => {
		setCurrentPage(e.data);
		const target = chainTarget.current;
		if (target === null || e.data === target) {
			chainTarget.current = null;
			return;
		}
		const api = bookRef.current?.pageFlip();
		if (target > e.data) api?.flipNext();
		else api?.flipPrev();
	}, []);

	const jumpTo = useCallback(
		(id: string) => {
			const target = pageIndexBySection.get(id);
			const api = bookRef.current?.pageFlip();
			if (target === undefined || !api) return;

			const current = api.getCurrentPageIndex();
			if (target === current) return;

			if (prefersReducedMotion) {
				api.turnToPage(target);
				setCurrentPage(target);
				return;
			}
			chainTarget.current = target;
			if (target > current) api.flipNext();
			else api.flipPrev();
		},
		[pageIndexBySection, prefersReducedMotion],
	);

	// Deux colonnes façon onglets de classeur : à droite tant que la section
	// n'a pas été atteinte, à gauche une fois passée.
	const tabsAhead: typeof TOME_TABS = [];
	const tabsBehind: typeof TOME_TABS = [];
	for (const tab of TOME_TABS) {
		const idx = pageIndexBySection.get(tab.id) ?? 0;
		(idx <= currentPage ? tabsBehind : tabsAhead).push(tab);
	}

	return (
		<div className="lore-room">
			<div className="lore-stage">
				<div className="lore-book-wrap">
					<div className="lore-tabs lore-tabs-left">
						{tabsBehind.map((t) => (
							<button
								key={t.id}
								type="button"
								className={`lore-tab${t.isCover ? " lore-tab-cover" : ""}${t.quiet ? " lore-tab-quiet" : ""}`}
								onClick={() => jumpTo(t.id)}
							>
								{t.label}
							</button>
						))}
					</div>
					<div className="lore-tabs lore-tabs-right">
						{tabsAhead.map((t) => (
							<button
								key={t.id}
								type="button"
								className={`lore-tab${t.isCover ? " lore-tab-cover" : ""}${t.quiet ? " lore-tab-quiet" : ""}`}
								onClick={() => jumpTo(t.id)}
							>
								{t.label}
							</button>
						))}
					</div>

					<HTMLFlipBook
						className="lore-flipbook"
						ref={bookRef}
						style={{}}
						width={420}
						height={600}
						size="stretch"
						minWidth={280}
						maxWidth={620}
						minHeight={400}
						maxHeight={860}
						startPage={0}
						showCover
						flippingTime={prefersReducedMotion ? 1 : 900}
						maxShadowOpacity={0.45}
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
						onFlip={handleFlip}
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
