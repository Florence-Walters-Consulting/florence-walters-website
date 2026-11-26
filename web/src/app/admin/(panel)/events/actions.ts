'use server';

import { z } from 'zod';
import { deleteEvent, eventSlugTaken, getEvent, insertEvent, updateEvent } from '@/db/admin/events';
import { parseForm, refresh, runAdminAction, type ActionState } from '@/lib/admin/action';
import { UserError } from '@/lib/admin/errors';
import { hasContent, optionalRowId, optionalText, rowId, text } from '@/lib/admin/schemas';
import { sanitizeRich } from '@/lib/admin/sanitize';
import { makeSlug, uniqueSlug } from '@/lib/admin/slug';
import { isUpload, removeImage, saveImage } from '@/lib/admin/uploads';
import { fromInput } from '@/lib/events';
import { parseLines } from '@/lib/work';

const done = () => refresh('/admin/events', 'events');
const when = (label: string) => z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, `Please choose the ${label}.`);

const schema = z.object({
	id: optionalRowId,
	title: text('Title', 200),
	summary: optionalText('Summary', 400),
	body: z.string().max(200_000, 'The details are too long.'),
	bullets: z.string().default(''),
	starts_at: when('start date and time'),
	ends_at: when('end date and time'),
	venue: text('Venue', 150),
	register_url: z.string().trim().max(500, 'The registration link is too long.').refine((u) => u === '' || /^https?:\/\//i.test(u), 'The registration link must start with https://').default(''),
	hashtags: optionalText('Hashtags', 200),
	status: z.enum(['published', 'draft'], { message: 'Please choose published or draft.' }),
});

/** Uploaded file name when the stored value is an upload (not '' or a built-in media: file). */
const uploadName = (image: string) => (image && !image.startsWith('media:') ? image : undefined);

export async function saveEvent(_prev: ActionState, formData: FormData): Promise<ActionState> {
	return runAdminAction(async () => {
		const input = parseForm(schema, formData);
		const body = sanitizeRich(input.body);
		if (!hasContent(body)) throw new UserError('The details are required.');
		const bullets = parseLines(input.bullets);
		if (bullets.length > 8 || bullets.some((b) => b.length > 200)) throw new UserError('Please keep it to 8 points of at most 200 characters each.');
		const startsAt = fromInput(input.starts_at);
		const endsAt = fromInput(input.ends_at);
		if (endsAt <= startsAt) throw new UserError('The end time must be after the start time.');

		const existing = input.id !== undefined ? await getEvent(input.id) : undefined;
		if (input.id !== undefined && !existing) throw new UserError('That event no longer exists.');

		const file = formData.get('image');
		let image = existing?.image ?? '';
		let newUpload: string | undefined;
		if (isUpload(file)) {
			newUpload = await saveImage(file, 'events', { kind: 'original' });
			image = newUpload;
		}
		const values = { title: input.title, summary: input.summary, body, bullets, startsAt, endsAt, venue: input.venue, registerUrl: input.register_url, hashtags: input.hashtags, image, status: input.status };
		try {
			if (!existing) {
				const base = makeSlug(input.title);
				if (!base) throw new UserError('The title needs at least one letter or number.');
				await insertEvent(await uniqueSlug(base, (s) => eventSlugTaken(s)), values);
			} else await updateEvent(existing.id, values);
		} catch (error) {
			if (newUpload) await removeImage('events', newUpload);
			throw error;
		}
		// A replaced flyer is no longer used.
		const old = existing ? uploadName(existing.image) : undefined;
		if (old && newUpload) await removeImage('events', old);
		done();
		return existing ? 'Event updated.' : 'Event added.';
	});
}

export async function deleteEventAction(id: number): Promise<ActionState> {
	return runAdminAction(async () => {
		const existing = await getEvent(rowId.parse(id));
		if (!existing) throw new UserError('That event no longer exists.');
		await deleteEvent(existing.id);
		await removeImage('events', uploadName(existing.image));
		done();
		return 'Event deleted.';
	});
}
