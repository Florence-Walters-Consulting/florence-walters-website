'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { ui } from '@/components/admin/ui';
import { loginAction, type LoginState } from './actions';

export default function LoginForm() {
	const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, null);
	// Submitting before the page's JavaScript has loaded would send the fields in a form the
	// action cannot read, so the button stays disabled for that first moment.
	const [ready, setReady] = useState(false);
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setReady(true);
	}, []);

	return (
		<form
			// Submitted by hand so a failed attempt keeps the username (React would reset the form).
			onSubmit={(event) => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				startTransition(() => formAction(data));
			}}
			className="space-y-4"
			noValidate>
			{state?.error && (
				<p role="alert" className={ui.error}>
					{state.error}
				</p>
			)}
			<div>
				<label htmlFor="username" className={ui.label}>
					Username
				</label>
				<input id="username" name="username" autoComplete="username" autoFocus required className={ui.input} />
			</div>
			<div>
				<label htmlFor="password" className={ui.label}>
					Password
				</label>
				<input id="password" name="password" type="password" autoComplete="current-password" required className={ui.input} />
			</div>
			<button type="submit" disabled={!ready || pending} className={`${ui.btn} ${ui.btnPrimary} w-full`}>
				{pending ? 'Signing in…' : 'Sign in'}
			</button>
		</form>
	);
}
