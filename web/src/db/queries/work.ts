import { cacheLife, cacheTag } from 'next/cache';
import { asc, desc, eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { servicePages } from '@/data/service-pages';
import { getService } from '@/data/services';
import { imageUrl } from '@/lib/images';
import type { WorkItem, WorkStep } from '@/lib/work';

/** The matching service page's standard process, used when a highlight has no steps of its own. */
function standardSteps(serviceSlug: string): WorkStep[] {
	return servicePages[serviceSlug]?.process ?? [];
}

/** '' | built-in key | upload:<file> -> an image URL. */
export function logoUrl(logo: string): string | undefined {
	if (!logo) return undefined;
	if (logo.startsWith('upload:')) return imageUrl('work', logo.slice(7));
	return `/media/regulators/${logo}.webp`;
}

/** Published highlights, in the order set in the admin (newest first within equal order). */
export async function getPublishedWork(): Promise<WorkItem[]> {
	'use cache';
	cacheLife('hours');
	cacheTag('work');
	const rows = await db
		.select()
		.from(schema.workHighlights)
		.where(eq(schema.workHighlights.status, 'published'))
		.orderBy(asc(schema.workHighlights.sortOrder), desc(schema.workHighlights.id));
	return rows.map((r) => ({
		slug: r.slug,
		code: r.code,
		kind: r.kind,
		body: r.body,
		full: r.title,
		logoUrl: logoUrl(r.logo),
		category: r.category,
		summary: r.summary,
		scope: r.scope.length ? r.scope : standardSteps(r.serviceSlug),
		receive: r.receive,
		service: { slug: r.serviceSlug, name: getService(r.serviceSlug)?.heading ?? 'Our services' },
	}));
}
