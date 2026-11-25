'use server';

import { z } from 'zod';
import { addLeadNote, deleteLead, getLeadLite, setLeadStatus } from '@/db/admin/leads';
import { refresh, runAdminAction, type ActionState } from '@/lib/admin/action';
import { UserError } from '@/lib/admin/errors';
import { rowId } from '@/lib/admin/schemas';
import { leadStatuses, statusLabel, type LeadStatus } from '@/lib/leads';

// Inbox is admin-only. Messages are deliberately generic: they go into the activity feed that editors
// can read, and must never contain a lead's name or details.
const ONLY = ['admin' as const];
const done = () => refresh('/admin/inbox');
const status = z.enum(leadStatuses.map((s) => s.value) as [LeadStatus, ...LeadStatus[]]);

export async function moveLead(id: number, to: string): Promise<ActionState> {
	return runAdminAction(async () => {
		const next = status.parse(to);
		const lead = await getLeadLite(rowId.parse(id));
		if (!lead) throw new UserError('That enquiry no longer exists.');
		if (lead.status !== next) await setLeadStatus(lead.id, next);
		done();
		return `Enquiry moved to ${statusLabel(next)}.`;
	}, ONLY);
}

export async function addNoteAction(id: number, _prev: ActionState, formData: FormData): Promise<ActionState> {
	return runAdminAction(async (admin) => {
		const note = z.string().trim().min(1, 'Please write a note.').max(2000, 'The note is too long.').safeParse(formData.get('note'));
		if (!note.success) throw new UserError(note.error.issues[0].message);
		const lead = await getLeadLite(rowId.parse(id));
		if (!lead) throw new UserError('That enquiry no longer exists.');
		await addLeadNote(lead.id, admin.name, note.data);
		done();
		return 'Note added to an enquiry.';
	}, ONLY);
}

export async function deleteLeadAction(id: number): Promise<ActionState> {
	return runAdminAction(async () => {
		const lead = await getLeadLite(rowId.parse(id));
		if (!lead) throw new UserError('That enquiry no longer exists.');
		await deleteLead(lead.id);
		done();
		return 'Enquiry deleted.';
	}, ONLY);
}
