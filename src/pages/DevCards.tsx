// Page de vérification des cartes, montée en développement uniquement (voir
// main.tsx) : http://localhost:5173/dev-cards rend les 304 cartes du jeu avec
// leurs vrais textes, pour repérer d'un coup d'œil un nom, une description ou
// un flavour qui ne tiendrait pas dans son cadre — les cases sont en
// overflow: hidden, donc un texte trop long y est coupé en silence.
//
// Les données viennent de src/data/devAllCards.json, écrit par
// `node scripts/generate-game-cards.mjs` en même temps que gameCards.json :
// a regénérer apres tout changement de texte de carte cote card-game.
//
// Le sélecteur de police en haut de page sert à comparer des candidates sur de
// vraies cartes (la police vit normalement dans GameCard.css) : il surcharge
// `font-family` le temps de l'essai, et ne change rien au site.
//
// Verification automatique (console du navigateur, sur cette page) — doit
// renvoyer deux listes vides, dans les DEUX langues :
//
//   const over = (el) => { const r = document.createRange();
//     r.selectNodeContents(el);
//     const c = r.getBoundingClientRect(), b = el.getBoundingClientRect();
//     return Math.max(b.top - c.top, c.bottom - b.bottom); };
//   [...document.querySelectorAll('[data-card]')].flatMap((card) =>
//     ['.gamecard-name', '.gamecard-desc']
//       .filter((sel) => over(card.querySelector(sel)) > 1)
//       .map((sel) => [card.dataset.card, sel]));
//
// (scrollHeight ne convient PAS pour ce controle : les deux cases sont des
// conteneurs flex centres, ou un contenu trop grand deborde des deux cotes et
// n'est donc compte qu'a moitie.)
import { useState } from "react";
import GameCard from "../components/GameCard";
import type { CardData } from "../types";
import cards from "../data/devAllCards.json";

const FONTS: Record<string, string> = {
	"(actuelle) Spectral": "",
	Alegreya: '"Alegreya", Georgia, serif',
	"Alegreya Sans": '"Alegreya Sans", system-ui, sans-serif',
	Bitter: '"Bitter", Georgia, serif',
	Spectral: '"Spectral", Georgia, serif',
	Vollkorn: '"Vollkorn", Georgia, serif',
	Faustina: '"Faustina", Georgia, serif',
	"Crimson Text (jeu)": '"CrimsonTextCard", Georgia, serif',
};

export default function DevCards() {
	const [font, setFont] = useState("(actuelle) Spectral");
	const family = FONTS[font];
	return (
		<div style={{ background: "#111", minHeight: "100vh" }}>
			<link
				rel="stylesheet"
				href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,700;1,400&family=Alegreya+Sans:ital,wght@0,400;0,700;1,400&family=Bitter:ital,wght@0,400;0,700;1,400&family=Spectral:ital,wght@0,400;0,700;1,400&family=Vollkorn:ital,wght@0,400;0,700;1,400&family=Faustina:ital,wght@0,400;0,700;1,400&display=swap"
			/>
			<div style={{ position: "sticky", top: 0, zIndex: 99, padding: 10, background: "#000", color: "#eee" }}>
				<label>
					Police d'essai{" "}
					<select value={font} onChange={(e) => setFont(e.target.value)} style={{ fontSize: 16 }}>
						{Object.keys(FONTS).map((name) => (
							<option key={name}>{name}</option>
						))}
					</select>
				</label>
			</div>
			{/* .gamecard porte sa propre regle font-family, qui gagne sur un
			    heritage pose par le conteneur : il faut donc une regle de meme
			    cible pour la surcharger. */}
			{family && <style>{`#dev-cards-grid .gamecard { font-family: ${family}; }`}</style>}
			{/* key={font} remonte toute la grille : la mesure des cases tourne au
			    montage, elle doit etre refaite avec les metriques de la nouvelle
			    police, sinon les hauteurs restent celles de la precedente. */}
			<div
				id="dev-cards-grid"
				key={font}
				style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: 16 }}
			>
				{(cards as unknown as CardData[]).map((card) => (
					<div key={card.name} data-card={card.name}>
						<GameCard card={card} />
					</div>
				))}
			</div>
		</div>
	);
}
