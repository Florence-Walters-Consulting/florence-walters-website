import { mysqlTable, primaryKey, int, varchar, index, mediumtext, unique } from "drizzle-orm/mysql-core"


export const admin = mysqlTable("admin", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 50 }).notNull(),
	email: varchar({ length: 254 }).notNull(),
	username: varchar({ length: 50 }).notNull(),
	password: varchar({ length: 100 }).notNull(),
	adminType: varchar("admin_type", { length: 30 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "admin_id"}),
]);

export const blog = mysqlTable("blog", {
	id: int().autoincrement().notNull(),
	blogId: varchar("blog_id", { length: 50 }).notNull(),
	heading: mediumtext().notNull(),
	slug: mediumtext().notNull(),
	category: int().notNull(),
	preamble: mediumtext().notNull(),
	body: mediumtext().notNull(),
	picture: varchar({ length: 50 }).notNull(),
	featured: varchar({ length: 10 }).notNull(),
	date: varchar({ length: 20 }).notNull(),
	keywords: mediumtext().notNull(),
	commentsAllowed: varchar("comments_allowed", { length: 10 }).notNull(),
},
(table) => [
	index("idx_blog_slug").on(table.slug),
	index("idx_blog_blog_id").on(table.blogId),
	primaryKey({ columns: [table.id], name: "blog_id"}),
]);

export const blogCategories = mysqlTable("blog_categories", {
	id: int().autoincrement().notNull(),
	categoryName: varchar("category_name", { length: 100 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "blog_categories_id"}),
]);

export const categories = mysqlTable("categories", {
	catId: int("cat_id").autoincrement().notNull(),
	catTitle: mediumtext("cat_title").notNull(),
	picture: mediumtext().notNull(),
	featured: mediumtext().notNull(),
},
(table) => [
	primaryKey({ columns: [table.catId], name: "categories_cat_id"}),
]);

export const comments = mysqlTable("comments", {
	id: int().autoincrement().notNull(),
	blogId: varchar("blog_id", { length: 50 }).notNull(),
	name: varchar({ length: 250 }).notNull(),
	email: varchar({ length: 250 }).notNull(),
	comment: mediumtext().notNull(),
	display: varchar({ length: 50 }).notNull(),
	date: varchar({ length: 50 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "comments_id"}),
]);

export const emailSubscribers = mysqlTable("email_subscribers", {
	id: int().autoincrement().notNull(),
	email: varchar({ length: 100 }).notNull(),
	date: mediumtext().notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "email_subscribers_id"}),
	unique("uq_email_subscribers_email").on(table.email),
]);

export const faqs = mysqlTable("faqs", {
	id: int().autoincrement().notNull(),
	question: mediumtext().notNull(),
	body: mediumtext().notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "faqs_id"}),
]);

export const gallery1 = mysqlTable("gallery1", {
	id: int().autoincrement().notNull(),
	heading: varchar({ length: 150 }).notNull(),
	paragraph: mediumtext().notNull(),
	picture: varchar({ length: 350 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "gallery1_id"}),
]);

export const generalImages = mysqlTable("general_images", {
	id: int().autoincrement().notNull(),
	photoOrder: int("photo_order").notNull(),
	picture: varchar({ length: 50 }).notNull(),
	size: varchar({ length: 30 }).notNull(),
	display: varchar({ length: 50 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "general_images_id"}),
]);

export const notifications = mysqlTable("notifications", {
	id: int().autoincrement().notNull(),
	content: mediumtext().notNull(),
	sender: mediumtext().notNull(),
	receiver: mediumtext().notNull(),
	seen: mediumtext().notNull(),
	date: mediumtext().notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "notifications_id"}),
]);

export const partners = mysqlTable("partners", {
	id: int().autoincrement().notNull(),
	picture: varchar({ length: 100 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "partners_id"}),
]);

export const pictureSlider = mysqlTable("picture_slider", {
	id: int().autoincrement().notNull(),
	heading: varchar({ length: 150 }).notNull(),
	paragraph: mediumtext().notNull(),
	picture: varchar({ length: 350 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "picture_slider_id"}),
]);

export const projects = mysqlTable("projects", {
	id: int().autoincrement().notNull(),
	uniqueId: varchar("unique_id", { length: 30 }).notNull(),
	heading: varchar({ length: 255 }).notNull(),
	preamble: mediumtext().notNull(),
	body: mediumtext().notNull(),
	picture: varchar({ length: 100 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "projects_id"}),
]);

export const services = mysqlTable("services", {
	id: int().autoincrement().notNull(),
	uniqueId: mediumtext("unique_id").notNull(),
	heading: mediumtext().notNull(),
	slug: mediumtext().notNull(),
	preamble: mediumtext().notNull(),
	body: mediumtext().notNull(),
	picture: mediumtext().notNull(),
	tag1: varchar({ length: 100 }).notNull(),
	tag2: varchar({ length: 100 }).notNull(),
	tag3: varchar({ length: 100 }).notNull(),
	tag4: varchar({ length: 100 }).notNull(),
},
(table) => [
	index("idx_services_slug").on(table.slug),
	primaryKey({ columns: [table.id], name: "services_id"}),
]);

export const team = mysqlTable("team", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 100 }).notNull(),
	position: varchar({ length: 100 }).notNull(),
	picture: varchar({ length: 100 }).notNull(),
	link: mediumtext().notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "team_id"}),
]);

export const testimonials = mysqlTable("testimonials", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 100 }).notNull(),
	occupation: varchar({ length: 100 }).notNull(),
	body: mediumtext().notNull(),
	picture: varchar({ length: 100 }).notNull(),
	display: varchar({ length: 10 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "testimonials_id"}),
]);
