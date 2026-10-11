import type { Metadata } from 'next';
import PageTitle from '@/components/admin/PageTitle';
import PasswordForm from './PasswordForm';

export const metadata: Metadata = { title: 'Change password' };

export default function PasswordPage() {
	return (
		<>
			<PageTitle title="Change password" description="Choose a new password for your admin login." />
			<PasswordForm />
		</>
	);
}
