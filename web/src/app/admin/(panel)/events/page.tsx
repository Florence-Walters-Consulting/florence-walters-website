import { connection } from 'next/server';
import type { Metadata } from 'next';
import DeleteButton from '@/components/admin/DeleteButton';
import ImageField from '@/components/admin/ImageField';
import PageTitle from '@/components/admin/PageTitle';
import ResourceDialog from '@/components/admin/ResourceDialog';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Badge, DataTable, EmptyState } from '@/components/admin/bits';
import { SelectField, TextAreaField, TextField } from '@/components/admin/fields';
import { listEvents } from '@/db/admin/events';
import { eventImageUrl, formatEventDayShort, formatEventTimes, nowWat, toInput } from '@/lib/events';
import { deleteEventAction, saveEvent } from './actions';

export const metadata: Metadata = { title: 'Events' };

type Row = Awaited<ReturnType<typeof listEvents>>[number];

const statusOptions = [
	{ value: 'published', label: 'Published: shown on the website' },
	{ value: 'draft', label: 'Draft: hidden from the website' },
];

function EventFields({ item }: { item?: Row }) {
	return (
		<>
			{item && <input type="hidden" name="id" value={item.id} />}
			<TextField name="title" label="Title" required maxLength={200} defaultValue={item?.title} />
			<TextAreaField name="summary" label="Short summary" rows={2} defaultValue={item?.summary} hint="One or two sentences shown on the home page banner and the events list." />
			<div className="grid gap-4 sm:grid-cols-2">
				<TextField name="starts_at" label="Starts (Lagos time)" type="datetime-local" required defaultValue={item ? toInput(item.startsAt) : undefined} />
				<TextField name="ends_at" label="Ends (Lagos time)" type="datetime-local" required defaultValue={item ? toInput(item.endsAt) : undefined} hint="The event disappears from the website after this time." />
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<TextField name="venue" label="Venue" required maxLength={150} defaultValue={item?.venue ?? 'Virtual'} />
				<TextField name="register_url" label="Registration link" maxLength={500} defaultValue={item?.registerUrl} hint="The full link, starting with https://. Leave empty if there is no sign-up." />
			</div>
			<RichTextEditor name="body" label="Details" required defaultValue={item?.body} />
			<TextAreaField name="bullets" label="What people will learn" rows={4} defaultValue={item?.bullets.join('\n')} hint="One point per line. Shown as a tick list." />
			<TextField name="hashtags" label="Hashtags" maxLength={200} defaultValue={item?.hashtags} hint="Optional, e.g. #TaxReady2026 #FWCWebinar" />
			<ImageField currentUrl={item ? eventImageUrl(item.image) : undefined} hint="The flyer. Shown in full, so a portrait image works well. JPG, PNG or WebP, up to 5 MB." />
			<SelectField name="status" label="Visibility" required defaultValue={item?.status ?? 'published'} options={statusOptions} />
		</>
	);
}

export default async function EventsAdminPage() {
	// The panel is per-visitor: never rendered at build time, so the queries below wait for the signed-in request.
	await connection();
	const items = await listEvents();
	const now = nowWat();
	return (
		<>
			<PageTitle
				title="Events"
				description="Webinars and events shown on the home page and the Insights & events page. An event is hidden automatically once it has ended."
				actions={
					<ResourceDialog title="Add event" triggerLabel="Add event" variant="primary" action={saveEvent} wide>
						<EventFields />
					</ResourceDialog>
				}
			/>
			{items.length === 0 ? (
				<EmptyState title="No events yet">Use “Add event” to add the first one.</EmptyState>
			) : (
				<DataTable head={['Event', 'When', 'Status', 'Actions']}>
					{items.map((item) => {
						const ended = item.endsAt < now;
						const image = eventImageUrl(item.image);
						return (
							<tr key={item.id}>
								<td className="px-4 py-3">
									<div className="flex items-center gap-3">
										<span className="grid h-14 w-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-white">
											{image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-slate-400">No flyer</span>}
										</span>
										<span className="min-w-0">
											<span className="block font-medium text-slate-900">{item.title}</span>
											<span className="block max-w-xs truncate text-slate-500">{item.venue}</span>
										</span>
									</div>
								</td>
								<td className="px-4 py-3 text-slate-600">
									{formatEventDayShort(item.startsAt)}
									<span className="block text-xs text-slate-500">{formatEventTimes(item.startsAt, item.endsAt)}</span>
								</td>
								<td className="px-4 py-3">
									<Badge tone={item.status === 'draft' ? 'gray' : ended ? 'gray' : 'green'}>{item.status === 'draft' ? 'Draft' : ended ? 'Ended' : 'Upcoming'}</Badge>
								</td>
								<td className="px-4 py-3">
									<div className="flex gap-2">
										<ResourceDialog title="Edit event" triggerLabel="Edit" action={saveEvent} wide>
											<EventFields item={item} />
										</ResourceDialog>
										<DeleteButton action={deleteEventAction.bind(null, item.id)} confirmText={`“${item.title}” will be removed from the website.`} />
									</div>
								</td>
							</tr>
						);
					})}
				</DataTable>
			)}
		</>
	);
}
