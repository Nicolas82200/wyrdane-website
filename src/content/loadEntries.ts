import type { Language } from "../i18n/language";

export type StatItem = { value: string; label: string };
export type Section = { heading?: string; paragraphs: string[] };
export type Entry = {
	date: string;
	title: Record<Language, string>;
	lede?: Record<Language, string>;
	stats?: Record<Language, StatItem[]>;
	sections: Record<Language, Section[]>;
};

function sortByDateDesc(modules: Record<string, { default: Entry }>): Entry[] {
	return Object.values(modules)
		.map((m) => m.default)
		.sort((a, b) => b.date.localeCompare(a.date));
}

const newsModules = import.meta.glob<{ default: Entry }>("./news/*.json", { eager: true });
const devLogModules = import.meta.glob<{ default: Entry }>("./devlog/*.json", { eager: true });

export const NEWS_ENTRIES = sortByDateDesc(newsModules);
export const DEVLOG_ENTRIES = sortByDateDesc(devLogModules);
