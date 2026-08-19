// Portage TS de DeckManager.make_unique_name (E:\card-game\scripts\deck\DeckManager.gd) —
// ajoute un suffixe " N" (N = 1, 2, 3...) si base_name est déjà pris par un
// autre deck de l'utilisateur.
export function makeUniqueDeckName(baseName: string, takenNames: string[]): string {
	if (!takenNames.includes(baseName)) return baseName;
	let n = 1;
	while (takenNames.includes(`${baseName} ${n}`)) n += 1;
	return `${baseName} ${n}`;
}
