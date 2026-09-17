import type { ReactNode } from "react";

import "./ExplorerPanel.css";

// Coquille commune aux trois explorateurs de la page d'accueil (types de
// carte, mots-clés, déclencheurs) : un seul panneau bordé, avec les filtres
// (une ou deux rangées d'onglets, ex. race puis entrée) regroupés en haut
// comme une barre de navigation, et le contenu (détail/grille de cartes) en
// dessous dans le même cadre — jamais des onglets flottants au-dessus d'un
// panneau séparé.
const ExplorerPanel = ({ navRows, children }: { navRows: ReactNode[]; children: ReactNode }) => {
	return (
		<div className="explorer-panel">
			<div className="explorer-panel-nav">
				{navRows.map((row, index) => (
					<div className="explorer-panel-nav-row" key={index}>
						{row}
					</div>
				))}
			</div>
			<div className="explorer-panel-body">{children}</div>
		</div>
	);
};

export default ExplorerPanel;
