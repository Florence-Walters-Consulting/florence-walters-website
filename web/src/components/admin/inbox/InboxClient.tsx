'use client';

import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Building2, Download, LayoutGrid, Mail, Phone, Rows3, Search, Trash2, X } from 'lucide-react';
import { addNoteAction, deleteLeadAction, moveLead } from '@/app/admin/(panel)/inbox/actions';
import { cn } from '@/lib/cn';
import { leadStatuses, leadTypes, typeShort, type Detail, type LeadStatus } from '@/lib/leads';
import { toast } from '../toast';
import { ui } from '../ui';

export type LeadView = {
	id: number;
	type: string;
	status: string;
	priority: string;
	name: string;
	email: string;
	phone: string;
	company: string;
	subject: string;
	summary: string;
	details: Detail[];
	ago: string;
	when: string;
	expires: string;
	notes: { id: number; adminName: string; note: string; ago: string }[];
};

type Props = { leads: LeadView[]; view: 'board' | 'table'; type: string; q: string; total: number };

const href = (p: { view?: string; type?: string; q?: string }) => {
	const u = new URLSearchParams();
	if (p.view && p.view !== 'board') u.set('view', p.view);
	if (p.type) u.set('type', p.type);
	if (p.q) u.set('q', p.q);
	const s = u.toString();
	return `/admin/inbox${s ? `?${s}` : ''}`;
};
const dot = (s: string) => leadStatuses.find((x) => x.value === s)?.dot ?? '#94a3b8';

export default function InboxClient({ leads, view, type, q, total }: Props) {
	const router = useRouter();
	const [search, setSearch] = useState(q);
	const [override, setOverride] = useState<Record<number, string>>({});
	const [openId, setOpenId] = useState<number | null>(null);
	const [dragId, setDragId] = useState<number | null>(null);
	const [overCol, setOverCol] = useState<string | null>(null);
	const [, startTransition] = useTransition();

	useEffect(() => {
		const t = search.trim();
		if (t === q) return;
		const id = setTimeout(() => router.replace(href({ view, type, q: t })), 350);
		return () => clearTimeout(id);
	}, [search, q, view, type, router]);

	const statusOf = (l: LeadView) => override[l.id] ?? l.status;
	const open = leads.find((l) => l.id === openId) ?? null;

	// Moves immediately on screen, then confirms with the server (and puts it back on failure).
	function move(id: number, to: string) {
		const lead = leads.find((l) => l.id === id);
		if (!lead || statusOf(lead) === to) return;
		const before = statusOf(lead);
		setOverride((o) => ({ ...o, [id]: to }));
		startTransition(async () => {
			const r = await moveLead(id, to);
			if (r?.ok) toast(r.message);
			else {
				setOverride((o) => ({ ...o, [id]: before }));
				toast(r?.error ?? 'Could not move it.', 'error');
			}
		});
	}

	const live = leadStatuses.map((s) => ({ ...s, count: leads.filter((l) => statusOf(l) === s.value).length }));
	const liveTotal = live.reduce((a, s) => a + s.count, 0) || 1;
	const chip = (active: boolean) => cn('shrink-0 rounded-full border px-4 py-2 text-sm transition-colors', active ? 'border-brand bg-brand font-medium text-white' : 'border-line bg-white text-slate-600 hover:border-slate-300');

	return (
		<>
			<div className="rounded-2xl border border-line bg-white p-6">
				<p className="text-sm font-medium text-brand">Work status</p>
				<div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-line" role="img" aria-label={live.map((s) => `${s.count} ${s.label}`).join(', ')}>
					{live.filter((s) => s.count > 0).map((s) => <span key={s.value} className="transition-[width] duration-500" style={{ width: `${(s.count / liveTotal) * 100}%`, background: s.dot }} />)}
				</div>
				<ul className="mt-4 flex flex-wrap gap-x-10 gap-y-2">
					{live.map((s) => <li key={s.value} className="text-sm text-slate-500"><span className="mr-2 inline-block size-2.5 rounded-full" style={{ background: s.dot }} />{s.label} <strong className="ml-1 text-base font-semibold text-brand">{s.count}</strong></li>)}
				</ul>
			</div>

			<div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
				<div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by type">
					<button className={chip(!type)} aria-pressed={!type} onClick={() => router.push(href({ view, q }))}>All <span className="ml-1.5 text-xs opacity-60">{total}</span></button>
					{leadTypes.map((t) => <button key={t.value} className={chip(type === t.value)} aria-pressed={type === t.value} onClick={() => router.push(href({ view, type: t.value, q }))}>{t.short}</button>)}
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<label className="relative block w-full sm:w-64">
						<span className="sr-only">Search enquiries</span>
						<Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
						<input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, company" className={cn(ui.input, 'rounded-full py-2 pl-10')} />
					</label>
					<div className="flex rounded-full border border-line bg-white p-1" role="group" aria-label="View">
						{([['board', 'Board', LayoutGrid], ['table', 'Table', Rows3]] as const).map(([v, label, Icon]) => (
							<button key={v} aria-pressed={view === v} onClick={() => router.push(href({ view: v, type, q }))} className={cn('inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors', view === v ? 'bg-brand-soft font-medium text-accent' : 'text-slate-500 hover:text-brand')}><Icon className="size-4" />{label}</button>
						))}
					</div>
					<a href={`/admin/inbox/export${href({ type, q }).replace('/admin/inbox', '')}`} className={cn(ui.btn, ui.btnSecondary)}><Download className="size-4" /> Export CSV</a>
				</div>
			</div>

			{leads.length === 0 ? (
				<div className={cn(ui.card, 'mt-6 px-6 py-16 text-center')}>
					<Mail className="mx-auto size-8 text-slate-300" strokeWidth={1.5} />
					<p className="mt-4 font-display text-3xl text-brand">{q || type ? 'Nothing matches' : 'No enquiries yet'}</p>
					<p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{q || type ? 'Try a different search or clear the filter.' : 'Contact enquiries, business assessments and paid consultation requests from the website will appear here, and are still e-mailed to you.'}</p>
				</div>
			) : view === 'board' ? (
				<div className="mt-6 grid gap-4 overflow-x-auto pb-2 lg:grid-cols-4">
					{leadStatuses.map((col) => {
						const items = leads.filter((l) => statusOf(l) === col.value);
						return (
							<section
								key={col.value}
								aria-label={col.label}
								onDragOver={(e) => { e.preventDefault(); setOverCol(col.value); }}
								onDragLeave={() => setOverCol((c) => (c === col.value ? null : c))}
								onDrop={(e) => { e.preventDefault(); setOverCol(null); if (dragId !== null) move(dragId, col.value); setDragId(null); }}
								className={cn('min-w-[14rem] rounded-2xl bg-slate-100/70 p-3 transition-colors', overCol === col.value && 'bg-brand-soft ring-2 ring-accent/30')}>
								<h2 className="flex items-center justify-between px-2 py-2 font-sans text-[0.9375rem] font-semibold text-brand">
									<span className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: col.dot }} />{col.label}</span>
									<span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-500">{items.length}</span>
								</h2>
								<ul className="mt-1 grid gap-3">
									{items.map((l) => (
										<li key={l.id}>
											<button
												draggable
												onDragStart={() => setDragId(l.id)}
												onDragEnd={() => { setDragId(null); setOverCol(null); }}
												onClick={() => setOpenId(l.id)}
												className={cn('w-full cursor-grab rounded-xl border border-line bg-white p-4 text-left shadow-[0_1px_2px_rgb(31_42_68/0.04)] transition-all hover:border-accent/40 hover:shadow-md active:cursor-grabbing', dragId === l.id && 'opacity-40')}>
												<span className="flex items-start justify-between gap-2">
													<span className="font-medium text-brand">{l.name}</span>
													{l.priority === 'urgent' && <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[0.6875rem] font-semibold text-amber-800"><AlertTriangle className="size-3" /> Urgent</span>}
												</span>
												<span className="mt-1 block truncate text-xs text-slate-500">{l.company || l.email}</span>
												<span className="mt-3 block text-sm leading-snug text-slate-700 line-clamp-2">{l.summary || l.subject}</span>
												<span className="mt-3 flex items-center justify-between border-t border-line pt-3 text-xs text-slate-500">
													<span className="rounded-full bg-brand-soft px-2 py-0.5 font-medium text-accent">{typeShort(l.type)}</span>
													<span>{l.ago}{l.notes.length > 0 && ` · ${l.notes.length} note${l.notes.length === 1 ? '' : 's'}`}</span>
												</span>
											</button>
										</li>
									))}
									{items.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-xs text-slate-400">Drop an enquiry here</li>}
								</ul>
							</section>
						);
					})}
				</div>
			) : (
				<div className={cn(ui.card, 'mt-6 overflow-x-auto')}>
					<table className="w-full min-w-[46rem] text-left text-sm">
						<thead className="border-b border-line bg-canvas/60 text-xs tracking-wider text-slate-500 uppercase">
							<tr>{['Name', 'Type', 'About', 'Status', 'Received'].map((h) => <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>)}</tr>
						</thead>
						<tbody className="divide-y divide-line">
							{leads.map((l) => (
								<tr key={l.id} onClick={() => setOpenId(l.id)} className="cursor-pointer transition-colors hover:bg-brand-soft/40">
									<td className="px-4 py-3.5">
										<button className="text-left" onClick={(e) => { e.stopPropagation(); setOpenId(l.id); }}>
											<span className="flex items-center gap-2 font-medium text-brand">{l.name}{l.priority === 'urgent' && <AlertTriangle className="size-3.5 text-amber-600" aria-label="Urgent" />}</span>
											<span className="block text-xs text-slate-500">{l.company || l.email}</span>
										</button>
									</td>
									<td className="px-4 py-3.5 text-slate-600">{typeShort(l.type)}</td>
									<td className="max-w-xs truncate px-4 py-3.5 text-slate-600">{l.subject}</td>
									<td className="px-4 py-3.5">
										<span className="inline-flex items-center gap-2 text-slate-700"><span className="size-2 rounded-full" style={{ background: dot(statusOf(l)) }} />{leadStatuses.find((s) => s.value === statusOf(l))?.label}</span>
									</td>
									<td className="whitespace-nowrap px-4 py-3.5 text-slate-500" title={l.when}>{l.ago}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{open && <Drawer key={open.id} lead={open} status={statusOf(open)} onMove={(to) => move(open.id, to)} onClose={() => setOpenId(null)} />}
		</>
	);
}

function Drawer({ lead, status, onMove, onClose }: { lead: LeadView; status: string; onMove: (to: LeadStatus) => void; onClose: () => void }) {
	const ref = useRef<HTMLDialogElement>(null);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [pending, startTransition] = useTransition();
	const [state, noteAction, notePending] = useActionState(addNoteAction.bind(null, lead.id), null);
	const form = useRef<HTMLFormElement>(null);

	useEffect(() => {
		ref.current?.showModal();
	}, []);
	useEffect(() => {
		if (state?.ok) {
			toast(state.message);
			form.current?.reset();
		}
	}, [state]);

	const remove = () =>
		startTransition(async () => {
			const r = await deleteLeadAction(lead.id);
			if (r?.ok) {
				toast(r.message);
				onClose();
			} else toast(r?.error ?? 'Could not delete it.', 'error');
		});

	return (
		<dialog ref={ref} onClose={onClose} onMouseDown={(e) => e.target === ref.current && ref.current?.close()} aria-label={`Enquiry from ${lead.name}`} className="m-0 mr-0 ml-auto h-dvh max-h-none w-full max-w-xl rounded-l-3xl p-0 shadow-2xl">
			<div className="flex h-full flex-col">
				<div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
					<div className="min-w-0">
						<p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">{typeShort(lead.type)} · {lead.when}</p>
						<h2 className="mt-1 truncate text-3xl text-brand">{lead.name}</h2>
						{lead.priority === 'urgent' && <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"><AlertTriangle className="size-3.5" /> Urgent: reply within 4 business hours</p>}
					</div>
					<button onClick={() => ref.current?.close()} aria-label="Close" className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-slate-500 hover:bg-slate-50"><X className="size-5" /></button>
				</div>

				<div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
					<div className="flex flex-wrap gap-2">
						<a href={`mailto:${lead.email}`} className={cn(ui.btn, ui.btnPrimary)}><Mail className="size-4" /> Reply by email</a>
						{lead.phone && <a href={`tel:${lead.phone.replace(/\s/g, '')}`} className={cn(ui.btn, ui.btnSecondary)}><Phone className="size-4" /> {lead.phone}</a>}
					</div>
					<dl className="mt-5 grid gap-3 rounded-2xl bg-canvas p-5 text-sm">
						<div className="flex gap-3"><dt className="w-20 shrink-0 text-slate-500">Email</dt><dd className="min-w-0 break-all font-medium">{lead.email}</dd></div>
						{lead.phone && <div className="flex gap-3"><dt className="w-20 shrink-0 text-slate-500">Phone</dt><dd className="font-medium">{lead.phone}</dd></div>}
						{lead.company && <div className="flex gap-3"><dt className="w-20 shrink-0 text-slate-500">Company</dt><dd className="flex items-center gap-1.5 font-medium"><Building2 className="size-3.5 text-slate-400" />{lead.company}</dd></div>}
					</dl>

					<fieldset className="mt-6">
						<legend className="text-sm font-semibold text-brand">Status</legend>
						<div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
							{leadStatuses.map((s) => (
								<button key={s.value} type="button" aria-pressed={status === s.value} onClick={() => onMove(s.value)} className={cn('flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors', status === s.value ? 'border-accent bg-brand-soft font-medium text-accent' : 'border-line text-slate-600 hover:border-slate-300')}>
									<span className="size-2 rounded-full" style={{ background: s.dot }} />{s.label}
								</button>
							))}
						</div>
					</fieldset>

					<h3 className="mt-8 font-sans text-sm font-semibold text-brand">Their answers</h3>
					<dl className="mt-3 divide-y divide-line rounded-2xl border border-line">
						{lead.details.map((d) => (
							<div key={d.label} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[10rem_1fr] sm:gap-4">
								<dt className="text-xs tracking-wider text-slate-500 uppercase">{d.label}</dt>
								<dd className="text-sm text-slate-800">
									{Array.isArray(d.value) ? <ul className="grid gap-1">{d.value.map((v) => <li key={v} className="flex gap-2"><span aria-hidden className="mt-2 size-1.5 shrink-0 bg-accent" />{v}</li>)}</ul> : <span className="whitespace-pre-wrap">{d.value}</span>}
								</dd>
							</div>
						))}
					</dl>

					<h3 className="mt-8 font-sans text-sm font-semibold text-brand">Internal notes <span className="font-normal text-slate-500">(only your team sees these)</span></h3>
					<ul className="mt-3 grid gap-3">
						{lead.notes.map((n) => (
							<li key={n.id} className="rounded-xl bg-brand-soft/60 px-4 py-3 text-sm">
								<p className="whitespace-pre-wrap text-slate-800">{n.note}</p>
								<p className="mt-1.5 text-xs text-slate-500">{n.adminName} · {n.ago}</p>
							</li>
						))}
					</ul>
					<form ref={form} action={noteAction} className="mt-3">
						<label htmlFor={`note-${lead.id}`} className="sr-only">Add a note</label>
						<textarea id={`note-${lead.id}`} name="note" rows={3} maxLength={2000} placeholder="Add a note: who you spoke to, what was agreed…" className={ui.input} />
						{state && !state.ok && <p role="alert" className={cn(ui.error, 'mt-2')}>{state.error}</p>}
						<button type="submit" disabled={notePending} className={cn(ui.btn, ui.btnSecondary, 'mt-2')}>{notePending ? 'Saving…' : 'Add note'}</button>
					</form>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-canvas px-6 py-4 sm:px-8">
					{confirmDelete ? (
						<div className="flex w-full items-center justify-between gap-3">
							<p className="text-sm text-slate-600">Delete this enquiry permanently?</p>
							<div className="flex gap-2">
								<button onClick={() => setConfirmDelete(false)} className={cn(ui.btn, ui.btnSecondary)}>Cancel</button>
								<button onClick={remove} disabled={pending} className={cn(ui.btn, ui.btnDanger)}>{pending ? 'Deleting…' : 'Yes, delete'}</button>
							</div>
						</div>
					) : (
						<><button onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-2 text-sm text-red-700 hover:underline"><Trash2 className="size-4" /> Delete enquiry</button><p className="text-xs text-slate-500">Deleted automatically on {lead.expires}</p></>
					)}
				</div>
			</div>
		</dialog>
	);
}
