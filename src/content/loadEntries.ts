import type { Language } from "../i18n/language";

export type StatItem = { value: string; label: string };
// `src` est une URL servie depuis public/ (ex. "/devlog/2026-11-25/boutique-packs.png") :
// les JSON de contenu ne passent pas par le bundler, donc pas d'import ici.
export type EntryImage = { src: string; alt?: string; caption?: string };
export type Section = { heading?: string; paragraphs: string[]; images?: EntryImage[] };
export type EntryKind = "news" | "devlog";
export type Entry = {
	date: string;
	title: Record<Language, string>;
	lede?: Record<Language, string>;
	stats?: Record<Language, StatItem[]>;
	sections: Record<Language, Section[]>;
	// Renseigné par NEWS_ENTRIES/DEVLOG_ENTRIES ci-dessous, pas par les fichiers
	// source : sert de badge et de filtre sur la page combinée (voir NewsHub).
	kind?: EntryKind;
};

function sortByDateDesc(modules: Record<string, { default: Entry }>, kind: EntryKind): Entry[] {
	return Object.values(modules)
		.map((m) => ({ ...m.default, kind }))
		.sort((a, b) => b.date.localeCompare(a.date));
}

const newsModules = import.meta.glob<{ default: Entry }>("./news/*.json", { eager: true });
const devLogModules = import.meta.glob<{ default: Entry }>("./devlog/*.json", { eager: true });

export const NEWS_ENTRIES = sortByDateDesc(newsModules, "news");
export const DEVLOG_ENTRIES = sortByDateDesc(devLogModules, "devlog");

export const ALL_ENTRIES: Entry[] = [...NEWS_ENTRIES, ...DEVLOG_ENTRIES].sort((a, b) =>
	b.date.localeCompare(a.date),
);
