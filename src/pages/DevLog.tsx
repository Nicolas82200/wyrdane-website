import EntryAccordion from "../components/EntryAccordion";
import { DEVLOG_ENTRIES } from "../content/loadEntries";
import { useLanguage } from "../i18n/useLanguage";
import { PAGES_CONTENT } from "../i18n/pages";
import { usePageTitle } from "../hooks/usePageTitle";
import "./ContentPage.css";

const DevLog = () => {
	const { language } = useLanguage();
	const t = PAGES_CONTENT[language].devLog;
	usePageTitle(t.title);

	return (
		<div className="content-page">
			<div className="content-panel">
				<h1>{t.title}</h1>
				<p className="content-subtitle">{t.subtitle}</p>
				<hr className="content-sep" />
				<EntryAccordion entries={DEVLOG_ENTRIES} />
			</div>
		</div>
	);
};

export default DevLog;
