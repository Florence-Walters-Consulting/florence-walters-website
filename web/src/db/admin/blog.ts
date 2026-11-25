import 'server-only';
import { and, asc, count, desc, eq, like, ne, or, sql, type SQL } from 'drizzle-orm';
import { db, schema } from '@/db';

const { blog, blogCategories } = schema;

export type BlogValues = {
	blogId?: string;
	heading: string;
	slug: string;
	category: number;
	preamble: string;
	body: string;
	picture?: string;
	featured: string;
	date: string;
	keywords: string;
	commentsAllowed: string;
	status: 'published' | 'draft';
};

export type PostFilters = { q?: string; status?: string; category?: number };

/** One page of posts (any status), newest first, plus the total that matches the filters. */
export async function listPosts(f: PostFilters, page: number, size: number) {
	const conds: SQL[] = [];
	if (f.q) {
		const t = `%${f.q}%`;
		conds.push(or(like(blog.heading, t), like(blog.preamble, t), like(blogCategories.categoryName, t))!);
	}
	if (f.status === 'published' || f.status === 'draft') conds.push(eq(blog.status, f.status));
	if (f.category) conds.push(eq(blog.category, f.category));
	const where = conds.length ? and(...conds) : undefined;

	const [{ total }] = await db.select({ total: count() }).from(blog).leftJoin(blogCategories, eq(blogCategories.id, blog.category)).where(where);
	const rows = await db
		.select({
			id: blog.id,
			heading: blog.heading,
			slug: blog.slug,
			preamble: blog.preamble,
			body: blog.body,
			picture: blog.picture,
			featured: blog.featured,
			date: blog.date,
			status: blog.status,
			categoryId: blog.category,
			categoryName: blogCategories.categoryName,
			commentsAllowed: blog.commentsAllowed,
		})
		.from(blog)
		.leftJoin(blogCategories, eq(blogCategories.id, blog.category))
		.where(where)
		.orderBy(desc(blog.id))
		.limit(size)
		.offset((page - 1) * size);
	return { rows, total };
}

export async function getPost(id: number) {
	const [row] = await db.select().from(blog).where(eq(blog.id, id)).limit(1);
	return row;
}

export async function insertPost(values: Required<BlogValues>) {
	await db.insert(blog).values(values);
}

export async function updatePost(id: number, values: Omit<BlogValues, 'blogId'>) {
	await db.update(blog).set(values).where(eq(blog.id, id));
}

export async function deletePost(id: number) {
	await db.delete(blog).where(eq(blog.id, id));
}

export async function blogSlugTaken(slug: string, excludeId?: number) {
	const [row] = await db
		.select({ id: blog.id })
		.from(blog)
		.where(excludeId ? and(eq(blog.slug, slug), ne(blog.id, excludeId)) : eq(blog.slug, slug))
		.limit(1);
	return Boolean(row);
}

// ---- categories

export async function listCategories() {
	return db
		.select({ id: blogCategories.id, name: blogCategories.categoryName, posts: sql<number>`COUNT(${blog.id})`.mapWith(Number) })
		.from(blogCategories)
		.leftJoin(blog, eq(blog.category, blogCategories.id))
		.groupBy(blogCategories.id, blogCategories.categoryName)
		.orderBy(asc(blogCategories.categoryName));
}

export async function getCategory(id: number) {
	const [row] = await db.select().from(blogCategories).where(eq(blogCategories.id, id)).limit(1);
	return row;
}

export async function insertCategory(name: string) {
	await db.insert(blogCategories).values({ categoryName: name });
}

export async function updateCategory(id: number, name: string) {
	await db.update(blogCategories).set({ categoryName: name }).where(eq(blogCategories.id, id));
}

export async function deleteCategory(id: number) {
	await db.delete(blogCategories).where(eq(blogCategories.id, id));
}

export async function countPostsInCategory(id: number) {
	const [row] = await db.select({ total: count() }).from(blog).where(eq(blog.category, id));
	return row.total;
}
