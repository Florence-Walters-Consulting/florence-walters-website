import type { Metadata } from 'next';
import InboxClient from '@/components/admin/inbox/InboxClient';
import PageTitle from '@/components/admin/PageTitle';
import { leadStatusCounts, listLeads } from '@/db/admin/leads';
import { requireAdmin } from '@/lib/auth/dal';
import { timeAgo } from '@/lib/format';
import { LEAD_RETENTION_DAYS, leadTypes } from '@/lib/leads';

export const metadata: Metadata = { title: 'Inbox' };

export default async function InboxPage({ searchParams }: { searchParams: Promise<{ view?: string; type?: string; q?: string }> }) {
	await requireAdmin(['admin']);
	const p = await searchParams;
	const view = p.view === 'table' ? 'table' : 'board';
	const type = leadTypes.some((t) => t.value === p.type) ? p.type! : '';
	const q = (p.q ?? '').trim().slice(0, 100);

	const [rows, counts] = await Promise.all([listLeads({ type: type || undefined, q: q || undefined }), leadStatusCounts()]);
	const now = new Date();
	const when = (d: Date) => d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
	const leads = rows.map((r) => ({
		id: r.id, type: r.type, status: r.status, priority: r.priority, name: r.name, email: r.email, phone: r.phone, company: r.company,
		subject: r.subject, summary: r.summary, details: r.details,
		ago: timeAgo(r.createdAt, now), when: when(r.createdAt),
		expires: new Date(r.createdAt.getTime() + LEAD_RETENTION_DAYS * 86400000).toLocaleDateString('en-GB', { dateStyle: 'medium' }),
		notes: r.notes.map((n) => ({ id: n.id, adminName: n.adminName, note: n.note, ago: timeAgo(n.createdAt, now) })),
	}));
	const total = Object.values(counts).reduce((a, b) => a + b, 0);

	return (
		<>
			<PageTitle title="Inbox" description={`Every contact enquiry, business assessment and paid consultation request from the website. They are still e-mailed to you as well. Enquiries are deleted automatically ${LEAD_RETENTION_DAYS} days after they arrive, so copy anything you need to keep into your own records.`} />
			<InboxClient leads={leads} view={view} type={type} q={q} total={total} />
		</>
	);
}
