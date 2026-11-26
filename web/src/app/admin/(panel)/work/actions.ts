'use server';

import { z } from 'zod';
import { deleteWork, getWork, insertWork, moveWork, setWorkStatus, slugTaken, updateWork } from '@/db/admin/work';
import { parseForm, refresh, runAdminAction, type ActionState } from '@/lib/admin/action';
import { UserError } from '@/lib/admin/errors';
import { optionalRowId, rowId, text } from '@/lib/admin/schemas';
import { makeSlug, uniqueSlug } from '@/lib/admin/slug';
import { isUpload, removeImage, saveImage } from '@/lib/admin/uploads';
import { homeServices } from '@/data/home';
import { builtinCertificates, builtinLogos, parseLines, parseScope, workCategories } from '@/lib/work';

const done = () => refresh('/admin/work', 'work');
const services = homeServices.map((s) => s.slug);
const logoKeys = builtinLogos.map((l) => l.key);
const certificateKeys = builtinCertificates.map((c) => c.key);

const schema = z.object({
	id: optionalRowId,
	code: text('Short name', 60),
	kind: text('Type', 60),
	body: text('Issuing body', 150),
	title: text('Full name', 255),
	category: z.enum(workCategories, { message: 'Please choose a category.' }),
	summary: z.string().trim().max(400, 'The summary is too long (maximum 400 characters).').default(''),
	problem: z.string().trim().max(400, 'The problem is too long (maximum 400 characters).').default(''),
	result: z.string().trim().max(400, 'The result is too long (maximum 400 characters).').default(''),
	duration: z.string().trim().max(80, 'The time taken is too long (maximum 80 characters).').default(''),
	scope: z.string().default(''),
	receive: z.string().default(''),
	service: z.string().refine((s) => services.includes(s), 'Please choose the related service.'),
	status: z.enum(['published', 'draft'], { message: 'Please choose published or draft.' }),
	logo: z.string().default(''),
	certificate: z.string().default(''),
});

const uploadName = (logo: string) => (logo.startsWith('upload:') ? logo.slice(7) : undefined);

export async function saveWork(_prev: ActionState, formData: FormData): Promise<ActionState> {
	return runAdminAction(async () => {
		const input = parseForm(schema, formData);
		const scope = parseScope(input.scope);
		const receive = parseLines(input.receive);
		if (scope.some((s) => s.t.length > 120 || s.d.length > 400)) throw new UserError('A step is too long. Keep each title under 120 and each description under 400 characters.');
		if (scope.length > 12 || receive.length > 12) throw new UserError('Please keep it to 12 steps and 12 items at most.');
		if (receive.some((r) => r.length > 200)) throw new UserError('Each “what the client received” line must be under 200 characters.');

		const file = formData.get('logo_image');
		const existing = input.id !== undefined ? await getWork(input.id) : undefined;
		if (input.id !== undefined && !existing) throw new UserError('That highlight no longer exists.');

		// Logo: a new upload wins; otherwise the chosen built-in logo, none, or the current custom one.
		const oldUpload = existing ? uploadName(existing.logo) : undefined;
		let logo = '';
		let newUpload: string | undefined;
		if (isUpload(file)) {
			newUpload = await saveImage(file, 'work', { kind: 'original' });
			logo = `upload:${newUpload}`;
		} else if (input.logo === '__custom' && oldUpload) logo = existing!.logo;
		else if (logoKeys.includes(input.logo)) logo = input.logo;

		// Certificate image: same rules as the logo.
		const oldCert = existing ? uploadName(existing.certificate) : undefined;
		let certificate = '';
		let newCert: string | undefined;
		const certFile = formData.get('certificate_image');
		if (isUpload(certFile)) {
			newCert = await saveImage(certFile, 'work', { kind: 'original' });
			certificate = `upload:${newCert}`;
		} else if (input.certificate === '__custom' && oldCert) certificate = existing!.certificate;
		else if (certificateKeys.includes(input.certificate)) certificate = input.certificate;

		const values = { code: input.code, kind: input.kind, body: input.body, title: input.title, logo, certificate, category: input.category, summary: input.summary, problem: input.problem, result: input.result, duration: input.duration, scope, receive, serviceSlug: input.service, status: input.status };
		try {
			if (!existing) {
				await insertWork(await uniqueSlug(makeSlug(input.code) || 'highlight', slugTaken), values);
			} else await updateWork(existing.id, values);
		} catch (error) {
			if (newUpload) await removeImage('work', newUpload);
			if (newCert) await removeImage('work', newCert);
			throw error;
		}
		// The old custom logo is no longer used if it was replaced or switched off.
		if (oldUpload && uploadName(logo) !== oldUpload) await removeImage('work', oldUpload);
		if (oldCert && uploadName(certificate) !== oldCert) await removeImage('work', oldCert);
		done();
		return existing ? 'Work highlight updated.' : 'Work highlight added.';
	});
}

export async function deleteWorkAction(id: number): Promise<ActionState> {
	return runAdminAction(async () => {
		const existing = await getWork(rowId.parse(id));
		if (!existing) throw new UserError('That highlight no longer exists.');
		await deleteWork(existing.id);
		await removeImage('work', uploadName(existing.logo));
		await removeImage('work', uploadName(existing.certificate));
		done();
		return 'Work highlight deleted.';
	});
}

export async function moveWorkAction(id: number, dir: 'up' | 'down'): Promise<ActionState> {
	return runAdminAction(async () => {
		await moveWork(rowId.parse(id), dir === 'up' ? 'up' : 'down');
		done();
		return 'Work highlight order changed.';
	});
}

export async function toggleWorkAction(id: number): Promise<ActionState> {
	return runAdminAction(async () => {
		const existing = await getWork(rowId.parse(id));
		if (!existing) throw new UserError('That highlight no longer exists.');
		const next = existing.status === 'published' ? 'draft' : 'published';
		await setWorkStatus(existing.id, next);
		done();
		return next === 'published' ? 'Work highlight published.' : 'Work highlight hidden from the website.';
	});
}
