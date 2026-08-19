// Portage TS de CostSystem.compute_race_cost (E:\card-game\scripts\systems\CostSystem.gd) —
// part du coût d'une carte verrouillée sur le pool de sa race, selon sa rareté.
// Pas d'équivalent de CardData.race_cost_override côté site (absent du schéma
// backend/type CardData) : toujours la formule par rareté.
export const RACE_LOCK_PCT: Record<string, number> = {
	Commune: 0.25,
	Rare: 0.4,
	Épique: 0.55,
	Légendaire: 0.65,
};

export function computeRaceCost(total: number, rarity: string | null): number {
	if (total <= 0) return 0;
	const pct = RACE_LOCK_PCT[rarity ?? ""] ?? 0.4;
	return Math.min(Math.max(Math.round(total * pct), 1), total);
}
