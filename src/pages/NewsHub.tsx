import { useSearchParams } from "react-router-dom";

import EntryAccordion from "../components/EntryAccordion";
import { ALL_ENTRIES, NEWS_ENTRIES, DEVLOG_ENTRIES, type EntryKind } from "../content/loadEntries";
import { useLanguage } from "../i18n/useLanguage";
import { PAGES_CONTENT } from "../i18n/pages";
import { usePageTitle } from "../hooks/usePageTitle";
import "./NewsHub.css";

type Filter = "all" | EntryKind;

function parseFilter(value: string | null): Filter {
	return value === "news" || value === "devlog" ? value : "all";
}

// Page unique pour Actualités et Devlog : une seule route (/news), un filtre
// à trois onglets (Tout / Actualités / Devlog) reflété dans l'URL (?tab=...)
// pour que les deux entrées de la navbar/du footer pointent vers la même
// page tout en ouvrant sur l'onglet correspondant.
const NewsHub = () => {
	const { language } = useLanguage();
	const t = PAGES_CONTENT[language].newsHub;
	usePageTitle(t.title);
	const [searchParams, setSearchParams] = useSearchParams();
	const filter = parseFilter(searchParams.get("tab"));

	const setFilter = (next: Filter) => {
		if (next === "all") {
			setSearchParams({});
		} else {
			setSearchParams({ tab: next });
		}
	};

	const entries =
		filter === "all" ? ALL_ENTRIES : filter === "news" ? NEWS_ENTRIES : DEVLOG_ENTRIES;

	return (
		<div className="news-hub">
			<div className="news-hub-inner">
				<div className="news-hub-header">
					<h1>{t.title}</h1>
					<p className="news-hub-subtitle">{t.subtitle}</p>
				</div>

				<div className="news-hub-tabs">
					<button
						type="button"
						className={`news-hub-tab ${filter === "all" ? "active" : ""}`}
						onClick={() => setFilter("all")}
					>
						{t.tabAll}
					</button>
					<button
						type="button"
						className={`news-hub-tab ${filter === "news" ? "active" : ""}`}
						onClick={() => setFilter("news")}
					>
						{t.tabNews}
					</button>
					<button
						type="button"
						className={`news-hub-tab ${filter === "devlog" ? "active" : ""}`}
						onClick={() => setFilter("devlog")}
					>
						{t.tabDevlog}
					</button>
				</div>

				{entries.length > 0 ? (
					<EntryAccordion entries={entries} />
				) : (
					<p className="news-hub-empty">{t.empty}</p>
				)}
			</div>
		</div>
	);
};

export default NewsHub;
