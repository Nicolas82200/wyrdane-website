// Garde-fou des carrousels de la page d'accueil : chaque entrée (type de carte,
// mot-clé, déclencheur) doit trouver au moins une carte dans devAllCards.json,
// sinon son carrousel est vide en silence. Lancer après tout changement de
// cartes : node scripts/check-card-filters.mjs
//
// Les ids viennent de src/i18n/{home,keywords}.ts, la sélection de
// src/data/cardFilters.ts — le slug et la table des déclencheurs sont
// recopiés ici (3 lignes) pour que le check tourne en node sans bundler.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const cards = JSON.parse(fs.readFileSync(path.join(root, "src/data/devAllCards.json"), "utf8"));
const slug = (v) =>
	v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_");

const TRIGGER_ENUM_BY_ID = {
	t_arrival: "ONPLAY",
	t_reinforcement: "OnSummon",
	t_deathrattle: "DEATHRATTLE",
	t_wound: "OnDamaged",
	t_awaken: "OnAwaken",
	t_attack: "OnAttack",
	t_grief: "OnGrief",
	t_sacrifice: "OnSacrifice",
	t_execution: "OnExecution",
	t_carnage: "OnCarnage",
};
// Plus aucune valeur d'enum côté jeu : aucune carte ne les porte, c'est voulu.
const EMPTY_ON_PURPOSE = new Set(["t_decline", "t_spell"]);

const ids = (file) => {
	const text = fs.readFileSync(path.join(root, file), "utf8");
	return [...new Set([...text.matchAll(/id: "([a-z_0-9]+)"/g)].map((m) => m[1]))];
};

const TYPE_IDS = ["serviteur", "incantation", "rituel", "enchantement", "ressource"];
const entryIds = [...ids("src/i18n/keywords.ts"), ...ids("src/i18n/home.ts").filter((id) => id.startsWith("t_"))];

let checked = 0;
for (const id of TYPE_IDS) {
	const found = cards.filter((c) => slug(c.card_type) === id);
	assert.ok(found.length > 0, `aucune carte de type "${id}"`);
	checked++;
}
for (const id of entryIds) {
	if (EMPTY_ON_PURPOSE.has(id)) continue;
	const enumName = TRIGGER_ENUM_BY_ID[id];
	const found = enumName
		? cards.filter((c) => c.triggers.includes(enumName))
		: cards.filter((c) => c.keywords.some((k) => slug(k) === id));
	assert.ok(found.length > 0, `aucune carte pour l'entrée "${id}"`);
	checked++;
}
assert.ok(
	cards.every((c) => c.image_path?.startsWith("/assets/card_art/")),
	"une carte sans art : image_path doit pointer vers /assets/card_art/...",
);
console.log(`OK : ${checked} entrées illustrées, ${cards.length} cartes avec art.`);
