import 'server-only';
import { and, asc, count, desc, eq, ne, sql } from 'drizzle-orm';
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
};

export async function listPosts() {
	return db
		.select({
			id: blog.id,
			heading: blog.heading,
			preamble: blog.preamble,
			body: blog.body,
			picture: blog.picture,
			featured: blog.featured,
			date: blog.date,
			categoryId: blog.category,
			categoryName: blogCategories.categoryName,
			commentsAllowed: blog.commentsAllowed,
		})
		.from(blog)
		.leftJoin(blogCategories, eq(blogCategories.id, blog.category))
		.orderBy(desc(blog.id));
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
