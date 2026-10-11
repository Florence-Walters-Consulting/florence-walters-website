import 'server-only';
import sanitizeHtml from 'sanitize-html';

const common = { allowedSchemes: ['http', 'https', 'mailto', 'tel'], allowProtocolRelative: false };

/**
 * Admin-authored HTML is rendered on public pages with dangerouslySetInnerHTML, so it is
 * cleaned before it is stored. 'rich' is for article-style bodies (blog, FAQ, testimonials,
 * services); 'inline' is for short text where only simple formatting makes sense (home slider).
 */
export function sanitizeRich(html: string): string {
	return sanitizeHtml(html, {
		...common,
		allowedTags: [
			'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup',
			'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img', 'figure', 'figcaption', 'table', 'thead',
			'tbody', 'tr', 'th', 'td', 'div', 'span', 'section', 'aside', 'details', 'summary',
		],
		allowedAttributes: {
			a: ['href', 'target', 'rel', 'title'],
			img: ['src', 'alt', 'title', 'width', 'height'],
			'*': ['class'],
			td: ['colspan', 'rowspan'],
			th: ['colspan', 'rowspan'],
		},
		transformTags: {
			a: (tag, attribs) => ({
				tagName: tag,
				attribs: attribs.target === '_blank' ? { ...attribs, rel: 'noopener noreferrer' } : attribs,
			}),
		},
	});
}

export function sanitizeInline(html: string): string {
	return sanitizeHtml(html, {
		...common,
		allowedTags: ['b', 'strong', 'i', 'em', 'u', 'br', 'span', 'a'],
		allowedAttributes: { a: ['href', 'target', 'rel'], span: ['class'] },
	});
}
