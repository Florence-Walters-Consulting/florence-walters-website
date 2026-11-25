import { connection } from 'next/server';
import type { Metadata } from 'next';
import PageTitle from '@/components/admin/PageTitle';
import PasswordForm from './PasswordForm';

export const metadata: Metadata = { title: 'Change password' };

export default async function PasswordPage() {
	// The panel is per-visitor: never rendered at build time, so the queries below wait for the signed-in request.
	await connection();
	return (
		<>
			<PageTitle title="Change password" description="Choose a new password for your admin login." />
			<PasswordForm />
		</>
	);
}
