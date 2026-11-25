'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { ArrowRight, Eye, EyeOff, Loader2, TriangleAlert } from 'lucide-react';
import { loginAction, type LoginState } from './actions';

const field =
	'peer block w-full rounded-xl border border-line bg-white px-4 py-3.5 text-[0.9375rem] text-slate-900 placeholder:text-slate-400 transition-[border-color,box-shadow] focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10';

export default function LoginForm() {
	const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, null);
	const [show, setShow] = useState(false);
	const [caps, setCaps] = useState(false);
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
			className="space-y-5"
			noValidate>
			{state?.error && (
				<p role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
					<TriangleAlert className="mt-0.5 size-4 shrink-0" /> {state.error}
				</p>
			)}
			<div>
				<label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-700">Username</label>
				<input id="username" name="username" autoComplete="username" autoFocus required className={field} placeholder="Your username" />
			</div>
			<div>
				<label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
				<div className="relative">
					<input
						id="password"
						name="password"
						type={show ? 'text' : 'password'}
						autoComplete="current-password"
						required
						className={`${field} pr-12`}
						placeholder="Your password"
						onKeyUp={(e) => setCaps(e.getModifierState('CapsLock'))}
						onBlur={() => setCaps(false)}
					/>
					<button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} className="absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-400 transition-colors hover:text-accent">
						{show ? <EyeOff className="size-[1.125rem]" /> : <Eye className="size-[1.125rem]" />}
					</button>
				</div>
				{caps && <p role="status" className="mt-2 text-xs font-medium text-amber-700">Caps Lock is on.</p>}
			</div>
			<button type="submit" disabled={!ready || pending} className="group inline-flex min-h-14 w-full items-center justify-between rounded-full bg-brand-deep py-2 pr-2 pl-7 text-base font-medium text-white transition-colors hover:bg-accent disabled:cursor-wait disabled:opacity-70">
				{pending ? 'Signing in…' : 'Sign in'}
				<span className="grid size-10 place-items-center rounded-full bg-white/15">
					{pending ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5" />}
				</span>
			</button>
		</form>
	);
}
