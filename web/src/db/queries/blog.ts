import { cacheLife, cacheTag } from 'next/cache';
import { and, asc, count, desc, eq, gt, like, lt, ne, or, sql, type SQL } from 'drizzle-orm';
import { db, schema } from '@/db';

const { blog, blogCategories } = schema;
export const BLOG_PAGE_SIZE = 6;

/** Port of api/blogs-featured. */
export async function getFeaturedBlogs() {
	'use cache';
	cacheLife('hours');
	cacheTag('blog');

	return db
		.select({
			id: blog.id,
			heading: blog.heading,
			slug: blog.slug,
			category: blog.category,
			category_name: blogCategories.categoryName,
			preamble: blog.preamble,
			picture: blog.picture,
			date: blog.date,
		})
		.from(blog)
		.leftJoin(blogCategories, eq(blogCategories.id, blog.category))
		.where(eq(blog.featured, 'Yes'))
		.orderBy(desc(blog.id))
		.limit(3);
}

/** Port of api/blog: paginated list, optional search and category filter. */
export async function getBlogList(page: number, search: string, category: number) {
	'use cache';
	cacheLife('hours');
	cacheTag('blog');

	page = Math.max(1, Math.trunc(page) || 1);
	category = Math.max(0, Math.trunc(category) || 0);
	search = search.trim();

	const conditions: SQL[] = [];
	if (search !== '') {
		const term = `%${search}%`;
		conditions.push(
			or(like(blog.heading, term), like(blog.preamble, term), like(blogCategories.categoryName, term))!,
		);
	}
	if (category > 0) conditions.push(eq(blog.category, category));
	const where = conditions.length ? and(...conditions) : undefined;

	const [{ total }] = await db
		.select({ total: count() })
		.from(blog)
		.leftJoin(blogCategories, eq(blogCategories.id, blog.category))
		.where(where);

	const posts = await db
		.select({
			id: blog.id,
			blog_id: blog.blogId,
			heading: blog.heading,
			slug: blog.slug,
			category: blog.category,
			category_name: blogCategories.categoryName,
			preamble: blog.preamble,
			picture: blog.picture,
			featured: blog.featured,
			date: blog.date,
			comments_allowed: blog.commentsAllowed,
		})
		.from(blog)
		.leftJoin(blogCategories, eq(blogCategories.id, blog.category))
		.where(where)
		.orderBy(desc(blog.id))
		.limit(BLOG_PAGE_SIZE)
		.offset((page - 1) * BLOG_PAGE_SIZE);

	return {
		posts,
		pagination: { page, limit: BLOG_PAGE_SIZE, total, totalPages: Math.ceil(total / BLOG_PAGE_SIZE) },
	};
}

/** Categories with post counts (the `categories` part of api/blog). */
export async function getBlogCategories() {
	'use cache';
	cacheLife('hours');
	cacheTag('blog');

	return db
		.select({
			id: blogCategories.id,
			category_name: blogCategories.categoryName,
			count: sql<number>`COUNT(${blog.id})`.mapWith(Number),
		})
		.from(blogCategories)
		.leftJoin(blog, eq(blog.category, blogCategories.id))
		.groupBy(blogCategories.id, blogCategories.categoryName)
		.orderBy(asc(blogCategories.categoryName));
}

/** Port of api/blog-single. Returns null when the slug does not exist. */
export async function getBlogBySlug(slug: string) {
	'use cache';
	cacheLife('hours');
	cacheTag('blog');

	const [post] = await db
		.select({
			id: blog.id,
			blog_id: blog.blogId,
			heading: blog.heading,
			slug: blog.slug,
			category: blog.category,
			category_name: blogCategories.categoryName,
			preamble: blog.preamble,
			body: blog.body,
			picture: blog.picture,
			date: blog.date,
			comments_allowed: blog.commentsAllowed,
		})
		.from(blog)
		.leftJoin(blogCategories, eq(blogCategories.id, blog.category))
		.where(eq(blog.slug, slug))
		.limit(1);
	if (!post) return null;

	const [previous] = await db
		.select({ id: blog.id, heading: blog.heading, slug: blog.slug })
		.from(blog)
		.where(lt(blog.id, post.id))
		.orderBy(desc(blog.id))
		.limit(1);

	const [next] = await db
		.select({ id: blog.id, heading: blog.heading, slug: blog.slug })
		.from(blog)
		.where(gt(blog.id, post.id))
		.orderBy(asc(blog.id))
		.limit(1);

	const related = await db
		.select({
			id: blog.id,
			heading: blog.heading,
			slug: blog.slug,
			preamble: blog.preamble,
			picture: blog.picture,
			date: blog.date,
		})
		.from(blog)
		.where(and(eq(blog.category, post.category), ne(blog.id, post.id)))
		.orderBy(desc(blog.id))
		.limit(3);

	return { blog: post, previous: previous ?? null, next: next ?? null, related };
}

/** Slugs for generateStaticParams. */
export async function getAllBlogSlugs() {
	'use cache';
	cacheLife('hours');
	cacheTag('blog');
	return db.select({ slug: blog.slug }).from(blog);
}
