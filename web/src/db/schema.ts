import { mysqlTable, primaryKey, int, varchar, index, mediumtext, unique, timestamp, json, text, datetime } from "drizzle-orm/mysql-core"


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
	status: varchar({ length: 10 }).default('published').notNull(),
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
	name: varchar({ length: 100 }).default('').notNull(),
	display: varchar({ length: 10 }).default('Yes').notNull(),
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

/** Who changed what in the admin (see db/migrations/002_activity_log.sql). */
export const adminActivity = mysqlTable("admin_activity", {
	id: int().autoincrement().notNull(),
	adminId: int("admin_id"),
	adminName: varchar("admin_name", { length: 50 }).notNull(),
	kind: varchar({ length: 20 }).default('other').notNull(),
	message: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
},
(table) => [
	index("idx_admin_activity_created").on(table.createdAt),
	primaryKey({ columns: [table.id], name: "admin_activity_id"}),
]);

/** Inbox: enquiries, assessments and consultation requests (see db/migrations/003_inbox.sql). */
export const leads = mysqlTable("leads", {
	id: int().autoincrement().notNull(),
	type: varchar({ length: 20 }).notNull(),
	status: varchar({ length: 20 }).default('new').notNull(),
	priority: varchar({ length: 10 }).default('normal').notNull(),
	name: varchar({ length: 200 }).notNull(),
	email: varchar({ length: 254 }).notNull(),
	phone: varchar({ length: 50 }).default('').notNull(),
	company: varchar({ length: 150 }).default('').notNull(),
	subject: varchar({ length: 255 }).default('').notNull(),
	summary: varchar({ length: 400 }).default('').notNull(),
	details: json().$type<{ label: string; value: string | string[] }[]>().notNull(),
	createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("idx_leads_status").on(table.status),
	index("idx_leads_type").on(table.type),
	index("idx_leads_created").on(table.createdAt),
	primaryKey({ columns: [table.id], name: "leads_id"}),
]);

export const leadNotes = mysqlTable("lead_notes", {
	id: int().autoincrement().notNull(),
	leadId: int("lead_id").notNull(),
	adminName: varchar("admin_name", { length: 50 }).notNull(),
	note: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
},
(table) => [
	index("idx_lead_notes_lead").on(table.leadId),
	primaryKey({ columns: [table.id], name: "lead_notes_id"}),
]);

/** Work highlights shown on /work and the home page (see db/migrations/004_work_highlights.sql). */
export const workHighlights = mysqlTable("work_highlights", {
	id: int().autoincrement().notNull(),
	slug: varchar({ length: 80 }).notNull(),
	code: varchar({ length: 60 }).notNull(),
	kind: varchar({ length: 60 }).notNull(),
	body: varchar({ length: 150 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	logo: varchar({ length: 100 }).default('').notNull(),
	certificate: varchar({ length: 100 }).default('').notNull(),
	problem: varchar({ length: 400 }).default('').notNull(),
	result: varchar({ length: 400 }).default('').notNull(),
	duration: varchar({ length: 80 }).default('').notNull(),
	category: varchar({ length: 40 }).notNull(),
	summary: varchar({ length: 400 }).default('').notNull(),
	scope: json().$type<{ t: string; d: string }[]>().notNull(),
	receive: json().$type<string[]>().notNull(),
	serviceSlug: varchar("service_slug", { length: 80 }).notNull(),
	status: varchar({ length: 10 }).default('published').notNull(),
	sortOrder: int("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	unique("uq_work_slug").on(table.slug),
	index("idx_work_status_order").on(table.status, table.sortOrder),
	primaryKey({ columns: [table.id], name: "work_highlights_id"}),
]);

/** Events and webinars (see db/migrations/009_certificates_events.sql). Times are Lagos time (WAT, UTC+1). */
export const events = mysqlTable("events", {
	id: int().autoincrement().notNull(),
	slug: varchar({ length: 100 }).notNull(),
	title: varchar({ length: 200 }).notNull(),
	summary: varchar({ length: 400 }).default('').notNull(),
	body: mediumtext().notNull(),
	bullets: json().$type<string[]>().notNull(),
	startsAt: datetime("starts_at", { mode: 'string' }).notNull(),
	endsAt: datetime("ends_at", { mode: 'string' }).notNull(),
	venue: varchar({ length: 150 }).default('Virtual').notNull(),
	registerUrl: varchar("register_url", { length: 500 }).default('').notNull(),
	hashtags: varchar({ length: 200 }).default('').notNull(),
	image: varchar({ length: 150 }).default('').notNull(),
	status: varchar({ length: 10 }).default('published').notNull(),
	createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'date' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	unique("uq_event_slug").on(table.slug),
	index("idx_event_status_start").on(table.status, table.startsAt),
	primaryKey({ columns: [table.id], name: "events_id"}),
]);
