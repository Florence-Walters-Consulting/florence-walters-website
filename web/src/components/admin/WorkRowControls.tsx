'use client';

import { useTransition } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff } from 'lucide-react';
import { moveWorkAction, toggleWorkAction } from '@/app/admin/(panel)/work/actions';
import { toast } from './toast';

const btn = 'grid size-9 place-items-center rounded-full border border-line text-slate-600 transition-colors hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-line disabled:hover:text-slate-600';

/** Move up / down and publish toggle for one row (instant, with a toast). */
export function WorkRowControls({ id, first, last, published }: { id: number; first: boolean; last: boolean; published: boolean }) {
	const [pending, start] = useTransition();
	const run = (fn: () => Promise<{ ok: boolean; message?: string; error?: string } | null>) =>
		start(async () => {
			const r = await fn();
			if (r?.ok) toast(r.message ?? 'Done.');
			else toast(r?.error ?? 'Something went wrong.', 'error');
		});
	return (
		<div className="flex items-center gap-1.5">
			<button type="button" className={btn} disabled={pending || first} onClick={() => run(() => moveWorkAction(id, 'up'))} aria-label="Move up"><ArrowUp className="size-4" /></button>
			<button type="button" className={btn} disabled={pending || last} onClick={() => run(() => moveWorkAction(id, 'down'))} aria-label="Move down"><ArrowDown className="size-4" /></button>
			<button type="button" className={btn} disabled={pending} onClick={() => run(() => toggleWorkAction(id))} aria-label={published ? 'Hide from website' : 'Publish'} title={published ? 'Hide from website' : 'Publish'}>{published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}</button>
		</div>
	);
}
