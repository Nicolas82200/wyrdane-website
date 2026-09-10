// Régénère src/data/cardTranslations.json à partir de translations/game.csv
// de card-game (table FR -> EN, voir le commentaire d'en-tête de
// src/i18n/cardText.ts). Usage :
//   node scripts/generate-card-translations.mjs [chemin-vers-card-game]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cardGameDir = process.argv[2] ?? "E:/card-game";
const csvPath = path.join(cardGameDir, "translations", "game.csv");
const outPath = path.join(__dirname, "..", "src", "data", "cardTranslations.json");

function parseCsv(text) {
	// Parseur CSV minimal mais correct pour le format produit par Godot :
	// virgule comme séparateur, champs entre guillemets doubles pouvant
	// contenir virgules/retours à la ligne, "" pour un guillemet littéral.
	const rows = [];
	let row = [];
	let field = "";
	let inQuotes = false;
	let i = 0;
	if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // BOM
	while (i < text.length) {
		const c = text[i];
		if (inQuotes) {
			if (c === '"') {
				if (text[i + 1] === '"') {
					field += '"';
					i += 2;
					continue;
				}
				inQuotes = false;
				i++;
				continue;
			}
			field += c;
			i++;
			continue;
		}
		if (c === '"') {
			inQuotes = true;
			i++;
			continue;
		}
		if (c === ",") {
			row.push(field);
			field = "";
			i++;
			continue;
		}
		if (c === "\r") {
			i++;
			continue;
		}
		if (c === "\n") {
			row.push(field);
			field = "";
			rows.push(row);
			row = [];
			i++;
			continue;
		}
		field += c;
		i++;
	}
	if (field.length > 0 || row.length > 0) {
		row.push(field);
		rows.push(row);
	}
	return rows;
}

const text = fs.readFileSync(csvPath, "utf8");
const rows = parseCsv(text).filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ""));
const header = rows[0];
const frIdx = header.indexOf("fr");
const enIdx = header.indexOf("en");
if (frIdx === -1 || enIdx === -1) {
	throw new Error(`Colonnes fr/en introuvables dans l'en-tête : ${header.join(",")}`);
}

const table = {};
for (const row of rows.slice(1)) {
	const fr = row[frIdx];
	const en = row[enIdx];
	if (!fr || !en) continue;
	table[fr] = en;
}

const sorted = Object.fromEntries(Object.entries(table).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(outPath, JSON.stringify(sorted, null, "\t") + "\n", "utf8");
console.log(`Écrit ${Object.keys(sorted).length} entrées dans ${outPath}`);
