// Card.gd RACE_ICON_COLORS — teinte de repere par race. Sert au badge de cout
// des lignes de deck (DeckBuilder.tsx) et au libelle de race sur la carte
// (GameCard.tsx), exactement comme cote jeu (DeckBuilder._make_cost_badge et
// Card.gd race_label). RACE_COLORS, le fond de carte, est trop sombre pour ce
// role : ces teintes-la sont pensees pour rester lisibles en petit.
//
// Valeurs recopiees de Card.gd le 2026-11-25 : les quatre avaient derive
// (#bebebe/#9bd76e/#e8c56d/#e87587 cote site contre les valeurs ci-dessous
// cote jeu).
export const RACE_ICON_COLORS: Record<string, string> = {
	"Mort-Vivant": "#e2e2e2",
	Abomination: "#bdeb9c",
	Humain: "#f2d98f",
	Demon: "#f2a3b0",
	Elfe: "#a6e6d8",
	Nain: "#e8c295",
};
