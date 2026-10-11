'use client';

import { startTransition, useActionState, useEffect, useId, useRef, useState } from 'react';
import type { ActionState } from '@/lib/admin/action';
import { toast } from './toast';
import { ui } from './ui';

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

type Props = {
	title: string;
	triggerLabel: string;
	variant?: 'primary' | 'secondary';
	action: Action;
	submitLabel?: string;
	wide?: boolean;
	children: React.ReactNode;
};

/** A button that opens a modal form. The fields (children) are only mounted while it is open. */
export default function ResourceDialog({ title, triggerLabel, variant = 'secondary', action, submitLabel = 'Save', wide, children }: Props) {
	const dialog = useRef<HTMLDialogElement>(null);
	const [openCount, setOpenCount] = useState(0);
	const [open, setOpen] = useState(false);
	const titleId = useId();

	useEffect(() => {
		const el = dialog.current;
		if (open && el && !el.open) el.showModal();
		if (!open && el?.open) el.close();
	}, [open]);

	return (
		<>
			<button
				type="button"
				onClick={() => {
					setOpenCount((n) => n + 1);
					setOpen(true);
				}}
				className={`${ui.btn} ${variant === 'primary' ? ui.btnPrimary : ui.btnSecondary}`}>
				{triggerLabel}
			</button>
			<dialog
				ref={dialog}
				aria-labelledby={titleId}
				onClose={() => setOpen(false)}
				onMouseDown={(event) => {
					// Click on the backdrop (the dialog element itself) closes it.
					if (event.target === dialog.current) setOpen(false);
				}}
				className={`m-auto w-[calc(100%-2rem)] rounded-lg p-0 shadow-xl backdrop:bg-slate-900/50 ${wide ? 'max-w-3xl' : 'max-w-lg'}`}>
				{open && (
					<FormBody
						key={openCount}
						titleId={titleId}
						title={title}
						action={action}
						submitLabel={submitLabel}
						onDone={() => setOpen(false)}>
						{children}
					</FormBody>
				)}
			</dialog>
		</>
	);
}

function FormBody({
	titleId,
	title,
	action,
	submitLabel,
	onDone,
	children,
}: {
	titleId: string;
	title: string;
	action: Action;
	submitLabel: string;
	onDone: () => void;
	children: React.ReactNode;
}) {
	const [state, formAction, pending] = useActionState(action, null);

	useEffect(() => {
		if (state?.ok) {
			toast(state.message);
			onDone();
		}
	}, [state, onDone]);

	return (
		<form
			// Submitted by hand (not via the `action` prop) on purpose: React resets a form after its
			// action finishes, even on an error, which would wipe everything the admin had typed.
			onSubmit={(event) => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				startTransition(() => formAction(data));
			}}
			className="flex max-h-[90vh] flex-col">
			<div className="border-b border-slate-200 px-5 py-4">
				<h2 id={titleId} className="text-lg font-semibold">
					{title}
				</h2>
			</div>
			<div className="space-y-4 overflow-y-auto px-5 py-4">
				{state && !state.ok && (
					<p role="alert" className={ui.error}>
						{state.error}
					</p>
				)}
				{children}
			</div>
			<div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
				<button type="button" onClick={onDone} className={`${ui.btn} ${ui.btnSecondary}`}>
					Cancel
				</button>
				<button type="submit" disabled={pending} className={`${ui.btn} ${ui.btnPrimary}`}>
					{pending ? 'Saving…' : submitLabel}
				</button>
			</div>
		</form>
	);
}
