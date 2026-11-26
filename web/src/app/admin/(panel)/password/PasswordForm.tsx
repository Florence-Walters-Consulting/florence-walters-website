'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { ui } from '@/components/admin/ui';
import { toast } from '@/components/admin/toast';
import { changePassword } from './actions';

export default function PasswordForm() {
	const [state, formAction, pending] = useActionState(changePassword, null);
	const [formKey, setFormKey] = useState(0);

	useEffect(() => {
		if (state?.ok) {
			toast(state.message);
			// Remount to empty the fields after a successful change.
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setFormKey((k) => k + 1);
		}
	}, [state]);

	return (
		<form
			key={formKey}
			onSubmit={(event) => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				startTransition(() => formAction(data));
			}}
			className="max-w-md space-y-4">
			{state && !state.ok && (
				<p role="alert" className={ui.error}>
					{state.error}
				</p>
			)}
			{(
				[
					['current', 'Current password', 'current-password'],
					['next', 'New password', 'new-password'],
					['confirm', 'Repeat new password', 'new-password'],
				] as const
			).map(([name, label, autoComplete]) => (
				<div key={name}>
					<label htmlFor={name} className={ui.label}>
						{label}
					</label>
					<input id={name} name={name} type="password" autoComplete={autoComplete} required className={ui.input} />
					{name === 'next' && <p className={ui.hint}>At least 10 characters.</p>}
				</div>
			))}
			<button type="submit" disabled={pending} className={`${ui.btn} ${ui.btnPrimary}`}>
				{pending ? 'Saving…' : 'Change password'}
			</button>
		</form>
	);
}
