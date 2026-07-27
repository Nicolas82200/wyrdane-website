import EntryAccordion from "../components/EntryAccordion";
import { NEWS_ENTRIES } from "../content/loadEntries";
import { useLanguage } from "../i18n/useLanguage";
import { PAGES_CONTENT } from "../i18n/pages";
import "./ContentPage.css";

const News = () => {
	const { language } = useLanguage();
	const t = PAGES_CONTENT[language].news;

	return (
		<div className="content-page">
			<div className="content-panel">
				<h1>{t.title}</h1>
				<p className="content-subtitle">{t.subtitle}</p>
				<hr className="content-sep" />
				<EntryAccordion entries={NEWS_ENTRIES} />
			</div>
		</div>
	);
};

export default News;
