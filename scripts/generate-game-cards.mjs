// Régénère src/data/gameCards.json à partir des .tres de card-game (voir CLAUDE.md
// "gameCards.json, keywords.ts — copies statiques depuis card-game"). Usage :
//   node scripts/generate-game-cards.mjs [chemin-vers-card-game]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cardGameDir = process.argv[2] ?? "E:/card-game";
const cardsDir = path.join(cardGameDir, "resources", "cards");
const outPath = path.join(__dirname, "..", "src", "data", "gameCards.json");

const HUMAN_KEYWORDS = {
	DISCIPLINE: "Discipline",
	FORMATION: "Formation",
	CONTRE_ATTAQUE: "Contre-attaque",
	COMMANDEMENT: "Commandement",
	FORTIFICATION: "Fortification",
};
const UNDEAD_KEYWORDS = {
	PESTIFERE: "Pestiféré",
	NECROPHAGE: "Nécrophage",
	HORDE: "Horde",
	REVENANT: "Revenant",
	CHAIR_MORTE: "Chair morte",
};
const DEMON_KEYWORDS = {
	PACTE: "Pacte",
	CORRUPTION: "Corruption",
	TERREUR: "Terreur",
	RANG_INFERNAL: "Rang infernal",
	CHAIR_DE_SOUFRE: "Chair de soufre",
	SANG_NOIR: "Sang noir",
};
const ABOMINATION_KEYWORDS = {
	MUTATION: "Mutation",
	FUSION: "Fusion",
	VIRULENT: "Virulent",
	CHAIR_ADAPTATIVE: "Chair adaptative",
	ASSIMILATION: "Assimilation",
	INSTABLE: "Instable",
};

function enumIndexMap(orderedKeys) {
	const map = {};
	orderedKeys.forEach((key, i) => (map[i] = key));
	return map;
}

// Ordre des enums Type, voir scripts/data/Keyword*.gd côté card-game.
const HUMAN_ORDER = enumIndexMap(Object.keys(HUMAN_KEYWORDS));
const UNDEAD_ORDER = enumIndexMap(Object.keys(UNDEAD_KEYWORDS));
const DEMON_ORDER = enumIndexMap(Object.keys(DEMON_KEYWORDS));
const ABOMINATION_ORDER = enumIndexMap(Object.keys(ABOMINATION_KEYWORDS));

function findAllTres(dir) {
	const results = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) results.push(...findAllTres(full));
		else if (entry.name.endsWith(".tres")) results.push(full);
	}
	return results;
}

function parseSubResources(text) {
	// id -> { fields: {...} }
	const subResources = {};
	const blockRe = /\[sub_resource type="Resource" id="([^"]+)"\]([\s\S]*?)(?=\n\[|$)/g;
	let m;
	while ((m = blockRe.exec(text))) {
		const [, id, body] = m;
		const fields = {};
		for (const line of body.split("\n")) {
			const kv = line.match(/^(\w+)\s*=\s*(.+)$/);
			if (kv) fields[kv[1]] = kv[2].trim();
		}
		subResources[id] = fields;
	}
	return subResources;
}

function parseArrayRefs(value) {
	if (!value) return [];
	const refs = [];
	const re = /SubResource\("([^"]+)"\)/g;
	let m;
	while ((m = re.exec(value))) refs.push(m[1]);
	return refs;
}

function stripQuotes(v) {
	const m = v.match(/^"(.*)"$/);
	return m ? m[1] : v;
}

function parseCard(filePath) {
	const text = fs.readFileSync(filePath, "utf8");
	const resourceBlockMatch = text.match(/\[resource\]([\s\S]*)$/);
	if (!resourceBlockMatch) return null;
	const body = resourceBlockMatch[1];

	const fields = {};
	for (const line of body.split("\n")) {
		const kv = line.match(/^(\w+)\s*=\s*(.+)$/);
		if (kv) fields[kv[1]] = kv[2].trim();
	}

	const cardName = fields.card_name ? stripQuotes(fields.card_name) : null;
	if (!cardName) return null;

	const isToken = fields.is_token === "true";
	const arenaOnly = fields.arena_only === "true";
	if (isToken || arenaOnly) return null;

	const subResources = parseSubResources(text);
	const keywords = [];

	for (const id of parseArrayRefs(fields.keywords)) {
		const sub = subResources[id];
		if (sub && sub.name_fr) keywords.push(stripQuotes(sub.name_fr));
	}
	for (const [arrayField, order] of [
		["human_keywords", HUMAN_ORDER],
		["undead_keywords", UNDEAD_ORDER],
		["demon_keywords", DEMON_ORDER],
		["abomination_keywords", ABOMINATION_ORDER],
	]) {
		for (const id of parseArrayRefs(fields[arrayField])) {
			const sub = subResources[id];
			if (!sub || sub.keyword_type === undefined) continue;
			const idx = Number(sub.keyword_type);
			const key = order[idx];
			const table =
				arrayField === "human_keywords"
					? HUMAN_KEYWORDS
					: arrayField === "undead_keywords"
						? UNDEAD_KEYWORDS
						: arrayField === "demon_keywords"
							? DEMON_KEYWORDS
							: ABOMINATION_KEYWORDS;
			if (key && table[key]) keywords.push(table[key]);
		}
	}

	const relPath = path
		.relative(cardGameDir, filePath)
		.split(path.sep)
		.join("/");

	return {
		name: cardName,
		path: `res://${relPath}`,
		keywords,
	};
}

const files = findAllTres(cardsDir);
const result = {};
for (const file of files) {
	const card = parseCard(file);
	if (!card) continue;
	if (result[card.name]) {
		console.warn(`Nom de carte en double : "${card.name}" (${card.path} vs ${result[card.name].path})`);
	}
	result[card.name] = { path: card.path, keywords: card.keywords };
}

const sorted = Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b, "fr")));
fs.writeFileSync(outPath, JSON.stringify(sorted, null, "\t") + "\n", "utf8");
console.log(`${Object.keys(sorted).length} cartes écrites dans ${outPath}`);
