import 'server-only';
import { and, asc, eq, ne } from 'drizzle-orm';
import { db, schema } from '@/db';

const { services } = schema;

export type ServiceValues = {
	uniqueId?: string;
	heading: string;
	slug: string;
	preamble: string;
	body: string;
	picture?: string;
	tag1: string;
	tag2: string;
	tag3: string;
	tag4: string;
};

export const listServices = () => db.select().from(services).orderBy(asc(services.id));

export async function getService(id: number) {
	const [row] = await db.select().from(services).where(eq(services.id, id)).limit(1);
	return row;
}

export async function insertService(values: Required<ServiceValues>) {
	await db.insert(services).values(values);
}

export async function updateService(id: number, values: Omit<ServiceValues, 'uniqueId'>) {
	await db.update(services).set(values).where(eq(services.id, id));
}

export async function deleteService(id: number) {
	await db.delete(services).where(eq(services.id, id));
}

export async function serviceSlugTaken(slug: string, excludeId?: number) {
	const [row] = await db
		.select({ id: services.id })
		.from(services)
		.where(excludeId ? and(eq(services.slug, slug), ne(services.id, excludeId)) : eq(services.slug, slug))
		.limit(1);
	return Boolean(row);
}
