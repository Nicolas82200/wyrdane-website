export type CardData = {
	id: number;
	name: string;
	race: string;
	card_type: string;
	lane: string | null;
	cost: number | null;
	attack: number | null;
	hp: number | null;
	rarity: string | null;
	charges: number | null;
	effect: string | null;
	flavor: string | null;
	image_path: string;
};
