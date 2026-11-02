// Writes one dist/<route>/index.html per route listed below, each with its own
// og:image / title / description. Runs after the Vite build (see package.json).
//
// Why a build step and not react-helmet: link crawlers (Discord, X, Facebook,
// Slack) never run JavaScript. They read the raw HTML, which is the same
// index.html shell for every SPA route — so meta tags set at runtime by React
// stay invisible to them. A real file per route is the only way to give each
// page its own link preview.
//
// Nginx resolves /lore to /lore/index.html (try_files $uri $uri/) before
// falling back to the SPA index, and that shell loads the same bundle, so React
// Router takes over exactly as before. A route missing from this list simply
// keeps the default preview — nothing breaks.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const distDir = path.join(rootDir, "dist");
const SITE = "https://wyrdane.com";

const ROUTES = [
	{
		path: "lore",
		title: "Le Journal d'Aldrenia — Wyrdane",
		description:
			"Les archives d'Aldrenia : l'histoire du monde de Wyrdane, consignée âge après âge.",
		image: "/og-lore.jpg",
	},
];

const shell = readFileSync(path.join(distDir, "index.html"), "utf-8");

// Replaces the content of one meta tag, whichever attribute names it
// (property= for Open Graph, name= for Twitter) and however it is wrapped —
// the source index.html splits long tags over several lines.
function setMeta(html, key, value) {
	const re = new RegExp(`(<meta[^>]*?(?:property|name)="${key}"[^>]*?content=")[^"]*(")`, "g");
	const out = html.replace(re, `$1${value}$2`);
	if (out === html) throw new Error(`meta "${key}" not found in dist/index.html`);
	return out;
}

for (const route of ROUTES) {
	const url = `${SITE}/${route.path}`;
	let html = shell
		.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
		.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);

	html = setMeta(html, "description", route.description);
	for (const key of ["og:title", "twitter:title"]) html = setMeta(html, key, route.title);
	for (const key of ["og:description", "twitter:description"])
		html = setMeta(html, key, route.description);
	for (const key of ["og:image", "twitter:image"]) html = setMeta(html, key, SITE + route.image);
	html = setMeta(html, "og:url", url);

	const outDir = path.join(distDir, route.path);
	mkdirSync(outDir, { recursive: true });
	writeFileSync(path.join(outDir, "index.html"), html);
	console.log(`Wrote dist/${route.path}/index.html (${route.image})`);
}
