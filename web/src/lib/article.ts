/** Words per minute used for reading-time estimates. */
const WPM = 220;

export function readingMinutes(html: string) {
	const words = html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(words / WPM));
}

const slugify = (text: string) =>
	text.toLowerCase().replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'section';

export type TocItem = { id: string; text: string; level: 2 | 3 };

/**
 * Adds an id to every h2/h3 of the article HTML and returns the table of contents.
 * The HTML is already sanitised when saved in the admin; only the id attribute is added here.
 */
export function prepareArticle(html: string) {
	const toc: TocItem[] = [];
	const seen = new Map<string, number>();
	const out = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_m, level: string, attrs: string, inner: string) => {
		const text = inner.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();
		let id = slugify(text);
		const n = (seen.get(id) ?? 0) + 1;
		seen.set(id, n);
		if (n > 1) id = `${id}-${n}`;
		toc.push({ id, text, level: Number(level) as 2 | 3 });
		return `<h${level}${attrs.replace(/\sid="[^"]*"/i, '')} id="${id}">${inner}</h${level}>`;
	});
	return { html: out, toc };
}
