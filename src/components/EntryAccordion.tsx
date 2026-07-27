import { useState } from "react";

import type { Entry } from "../content/loadEntries";
import { useLanguage } from "../i18n/useLanguage";
import "./EntryAccordion.css";

const EntryAccordion = ({ entries }: { entries: Entry[] }) => {
	const { language } = useLanguage();
	const [openId, setOpenId] = useState<string | null>(null);

	return (
		<div className="entry-list">
			{entries.map((entry) => {
				const id = entry.date + entry.title[language];
				const isOpen = openId === id;
				const lede = entry.lede?.[language];
				const stats = entry.stats?.[language];
				const sections = entry.sections[language];

				return (
					<article className={`entry-card ${isOpen ? "open" : ""}`} key={id}>
						<button
							type="button"
							className="entry-header"
							aria-expanded={isOpen}
							onClick={() => setOpenId(isOpen ? null : id)}
						>
							<span className="entry-header-text">
								<span className="entry-date">{entry.date}</span>
								<h2>{entry.title[language]}</h2>
							</span>
							<span className="entry-chevron" aria-hidden="true" />
						</button>
						<div className="entry-body">
							<div className="entry-body-inner">
								{lede && <p className="entry-lede">{lede}</p>}

								{stats && stats.length > 0 && (
									<div className="entry-stats">
										{stats.map((stat) => (
											<div className="entry-stat" key={stat.label}>
												<span className="entry-stat-value">{stat.value}</span>
												<span className="entry-stat-label">{stat.label}</span>
											</div>
										))}
									</div>
								)}

								{sections.map((section, i) => (
									<section className="entry-section" key={i}>
										{section.heading && (
											<h3 className="entry-section-heading">{section.heading}</h3>
										)}
										{section.paragraphs.map((paragraph, j) => (
											<p key={j}>{paragraph}</p>
										))}
									</section>
								))}
							</div>
						</div>
					</article>
				);
			})}
		</div>
	);
};

export default EntryAccordion;
