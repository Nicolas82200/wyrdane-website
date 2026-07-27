import { useState } from "react";

import { useLanguage } from "../i18n/useLanguage";
import { KEYWORD_GROUPS } from "../i18n/keywords";
import "./KeywordsExplorer.css";

const KeywordsExplorer = () => {
	const { language } = useLanguage();
	const groups = KEYWORD_GROUPS[language];
	const [activeKey, setActiveKey] = useState(groups[0].key);
	const active = groups.find((g) => g.key === activeKey) ?? groups[0];

	return (
		<div className="keywords-explorer">
			<div className="keywords-tabs">
				{groups.map((group) => (
					<button
						type="button"
						key={group.key}
						className={`keywords-tab ${group.key === activeKey ? "active" : ""}`}
						onClick={() => setActiveKey(group.key)}
					>
						{group.title}
					</button>
				))}
			</div>
			<div className="keywords-grid">
				{active.items.map((kw) => (
					<div className="info-card" key={kw.name}>
						<h3>{kw.name}</h3>
						<p>{kw.description}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default KeywordsExplorer;
