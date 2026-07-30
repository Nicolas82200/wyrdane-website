// Regenerates public/feed.json from src/content/news and src/content/devlog.
// Run automatically before dev/build (see package.json) so the game client
// (E:\card-game, MainMenu.gd) always sees the latest posts after a deploy —
// no manual sync step.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const contentDir = path.join(rootDir, "src", "content");
const outFile = path.join(rootDir, "public", "feed.json");

const MAX_BODY_LENGTH = 600;

function readEntries(kind) {
	const dir = path.join(contentDir, kind);
	return readdirSync(dir)
		.filter((f) => f.endsWith(".json"))
		.map((f) => {
			const entry = JSON.parse(readFileSync(path.join(dir, f), "utf-8"));
			return { kind, entry };
		});
}

function bodyFor(entry, lang) {
	if (entry.lede) return entry.lede[lang];
	const paragraphs = (entry.sections[lang] ?? []).flatMap((s) => s.paragraphs);
	const text = paragraphs.join(" ");
	return text.length > MAX_BODY_LENGTH ? text.slice(0, MAX_BODY_LENGTH - 1).trimEnd() + "…" : text;
}

const feed = [...readEntries("news"), ...readEntries("devlog")]
	.map(({ kind, entry }) => ({
		kind,
		date: entry.date,
		title: entry.title,
		body: { en: bodyFor(entry, "en"), fr: bodyFor(entry, "fr") },
	}))
	.sort((a, b) => b.date.localeCompare(a.date));

writeFileSync(outFile, JSON.stringify(feed, null, "\t") + "\n");
console.log(`Wrote ${feed.length} entries to ${path.relative(rootDir, outFile)}`);
