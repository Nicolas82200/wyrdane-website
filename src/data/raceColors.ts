// Card.gd RACE_ICON_COLORS - teinte du filigrane central sur la carte
// (GameCard.tsx). Réutilisée pour le badge de coût dans la liste du deck
// (DeckBuilder.tsx) afin de distinguer les races d'un coup d'œil sans avoir
// à survoler chaque carte - RACE_COLORS (fond de carte) est trop sombre/peu
// contrasté pour ce rôle, ces teintes sont pensées pour rester lisibles sur
// un petit badge.
export const RACE_ICON_COLORS: Record<string, string> = {
	"Mort-Vivant": "#bebebe",
	Abomination: "#9bd76e",
	Humain: "#e8c56d",
	Demon: "#e87587",
};
