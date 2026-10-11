'use client';

import { useRef, useState, useTransition } from 'react';
import type { ActionState } from '@/lib/admin/action';
import { toast } from './toast';
import { ui } from './ui';

type Props = { action: () => Promise<ActionState>; confirmText: string; label?: string };

/** Delete button with a confirmation dialog. `action` is a Server Action bound to the row id. */
export default function DeleteButton({ action, confirmText, label = 'Delete' }: Props) {
	const dialog = useRef<HTMLDialogElement>(null);
	const [error, setError] = useState('');
	const [pending, startTransition] = useTransition();

	const confirm = () =>
		startTransition(async () => {
			const result = await action();
			if (result?.ok) {
				toast(result.message);
				dialog.current?.close();
			} else setError(result?.error ?? 'Something went wrong.');
		});

	return (
		<>
			<button
				type="button"
				onClick={() => {
					setError('');
					dialog.current?.showModal();
				}}
				className={`${ui.btn} border border-red-200 bg-white text-red-700 hover:bg-red-50`}>
				{label}
			</button>
			<dialog ref={dialog} className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-lg p-0 shadow-xl backdrop:bg-slate-900/50">
				<div className="space-y-3 p-5">
					<h2 className="text-lg font-semibold">Are you sure?</h2>
					<p className="text-sm text-slate-600">{confirmText}</p>
					{error && (
						<p role="alert" className={ui.error}>
							{error}
						</p>
					)}
				</div>
				<div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
					<button type="button" onClick={() => dialog.current?.close()} className={`${ui.btn} ${ui.btnSecondary}`}>
						Cancel
					</button>
					<button type="button" onClick={confirm} disabled={pending} className={`${ui.btn} ${ui.btnDanger}`}>
						{pending ? 'Deleting…' : 'Yes, delete'}
					</button>
				</div>
			</dialog>
		</>
	);
}
