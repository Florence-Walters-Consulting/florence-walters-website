import 'server-only';
import { and, count, desc, eq, inArray, lt, like, or, type SQL } from 'drizzle-orm';
import { db, schema } from '@/db';
import type { Detail, LeadStatus, LeadType } from '@/lib/leads';

const { leads, leadNotes } = schema;

export type NewLead = {
	type: LeadType;
	priority: 'normal' | 'urgent';
	name: string;
	email: string;
	phone: string;
	company: string;
	subject: string;
	summary: string;
	details: Detail[];
};

/** Saves a submission. Returns the new id, or null if saving failed (callers must still deliver the e-mail). */
export async function insertLead(lead: NewLead): Promise<number | null> {
	try {
		const [res] = await db.insert(leads).values({ ...lead, summary: lead.summary.slice(0, 400), subject: lead.subject.slice(0, 255) });
		return res.insertId;
	} catch (error) {
		console.error('Could not save lead to the inbox:', error);
		return null;
	}
}

export type LeadFilters = { type?: string; status?: string; q?: string };

export async function listLeads(f: LeadFilters, limit = 300) {
	const conds: SQL[] = [];
	if (f.type) conds.push(eq(leads.type, f.type));
	if (f.status) conds.push(eq(leads.status, f.status));
	if (f.q) {
		const t = `%${f.q}%`;
		conds.push(or(like(leads.name, t), like(leads.email, t), like(leads.company, t), like(leads.subject, t), like(leads.summary, t))!);
	}
	const rows = await db.select().from(leads).where(conds.length ? and(...conds) : undefined).orderBy(desc(leads.id)).limit(limit);
	const notes = rows.length
		? await db.select().from(leadNotes).where(inArray(leadNotes.leadId, rows.map((r) => r.id))).orderBy(desc(leadNotes.id))
		: [];
	return rows.map((r) => ({ ...r, notes: notes.filter((n) => n.leadId === r.id) }));
}
export type LeadRow = Awaited<ReturnType<typeof listLeads>>[number];

export async function leadStatusCounts() {
	const rows = await db.select({ status: leads.status, total: count() }).from(leads).groupBy(leads.status);
	const map: Record<string, number> = {};
	for (const r of rows) map[r.status] = r.total;
	return map;
}

export async function countNewLeads() {
	const [row] = await db.select({ total: count() }).from(leads).where(eq(leads.status, 'new'));
	return row.total;
}

/** New enquiries that have waited more than `hours` hours (for "needs a reply"). */
export async function countStaleNewLeads(hours: number) {
	const cutoff = new Date(Date.now() - hours * 3600_000);
	const [row] = await db.select({ total: count() }).from(leads).where(and(eq(leads.status, 'new'), lt(leads.createdAt, cutoff)));
	return row.total;
}

export async function getLeadLite(id: number) {
	const [row] = await db.select({ id: leads.id, status: leads.status }).from(leads).where(eq(leads.id, id)).limit(1);
	return row;
}
export const setLeadStatus = (id: number, status: LeadStatus) => db.update(leads).set({ status }).where(eq(leads.id, id));
export const addLeadNote = (leadId: number, adminName: string, note: string) => db.insert(leadNotes).values({ leadId, adminName: adminName.slice(0, 50), note });
export const deleteLead = (id: number) => db.delete(leads).where(eq(leads.id, id));
