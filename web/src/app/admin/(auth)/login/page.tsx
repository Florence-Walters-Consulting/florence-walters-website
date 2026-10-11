import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAdminOrNull } from '@/lib/auth/dal';
import { ui } from '@/components/admin/ui';
import LoginForm from './LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

async function LoginGate() {
	if (await getAdminOrNull()) redirect('/admin');
	return <LoginForm />;
}

export default function LoginPage() {
	return (
		<main className="flex min-h-screen items-center justify-center px-4 py-10">
			<div className={`${ui.card} w-full max-w-sm p-6 sm:p-8`}>
				<h1 className="text-xl font-semibold text-brand">Florence Walters Consulting</h1>
				<p className="mb-6 mt-1 text-sm text-slate-500">Admin sign in</p>
				<Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
					<LoginGate />
				</Suspense>
			</div>
		</main>
	);
}
