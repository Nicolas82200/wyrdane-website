import { useLanguage } from "../i18n/useLanguage";
import { LEGAL_CONTENT, type LegalContent } from "../i18n/legal";
import { usePageTitle } from "../hooks/usePageTitle";
import "./ContentPage.css";
import "./LegalPage.css";

type LegalPageProps = {
	pageKey: keyof LegalContent;
};

const LegalPage = ({ pageKey }: LegalPageProps) => {
	const { language } = useLanguage();
	const content = LEGAL_CONTENT[language][pageKey];
	usePageTitle(content.title);

	return (
		<div className="content-page">
			<div className="content-panel legal-panel">
				<h1>{content.title}</h1>
				<p className="content-subtitle">{content.updated}</p>
				<hr className="content-sep" />

				{content.intro && <p className="legal-intro">{content.intro}</p>}

				{content.sections.map((section) => (
					<section key={section.heading} className="legal-section">
						<h2>{section.heading}</h2>
						{section.paragraphs?.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
						{section.list && (
							<ul>
								{section.list.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						)}
					</section>
				))}
			</div>
		</div>
	);
};

export default LegalPage;
