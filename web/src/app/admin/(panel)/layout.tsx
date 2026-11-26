import { Suspense } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { countNewLeads } from '@/db/admin/leads';
import { requireAdmin } from '@/lib/auth/dal';

// Verifies the session against the database before rendering anything in the panel.
async function Gate({ children }: { children: React.ReactNode }) {
	const admin = await requireAdmin();
	// New enquiries badge on the Inbox link (admins only).
	const badges = admin.role === 'admin' ? { '/admin/inbox': await countNewLeads() } : undefined;
	return <AdminShell name={admin.name} role={admin.role} badges={badges}>{children}</AdminShell>;
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={<p className="p-8 text-sm text-slate-500">Loading…</p>}>
			<Gate>{children}</Gate>
		</Suspense>
	);
}
