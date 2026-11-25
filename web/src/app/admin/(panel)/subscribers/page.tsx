import type { Metadata } from 'next';
import DeleteButton from '@/components/admin/DeleteButton';
import { ListControls, Pager } from '@/components/admin/ListControls';
import PageTitle from '@/components/admin/PageTitle';
import { DataTable, EmptyState } from '@/components/admin/bits';
import { listSubscribers } from '@/db/admin/simple';
import { PAGE_SIZE, pageFrom } from '@/lib/admin/list';
import { requireAdmin } from '@/lib/auth/dal';
import { deleteSubscriberAction } from './actions';

export const metadata: Metadata = { title: 'Email subscribers' };

export default async function SubscribersAdminPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
	await requireAdmin(['admin']);
	const sp = await searchParams;
	const q = (sp.q ?? '').trim().slice(0, 100);
	const page = pageFrom(sp.page);
	const { rows, total } = await listSubscribers(q, page, PAGE_SIZE);
	const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

	return (
		<>
			<PageTitle title="Email subscribers" description={`${total} ${total === 1 ? 'person' : 'people'} ${q ? 'match your search' : 'subscribed through the website footer'}.`} />
			{(total > 0 || q) && <ListControls placeholder="Search by email" />}
			{rows.length === 0 ? (
				<EmptyState title={q ? 'No subscribers match' : 'No subscribers yet'}>{q ? 'Try a different search.' : 'People who sign up in the website footer will appear here.'}</EmptyState>
			) : (
				<>
					<DataTable head={['Email', 'Subscribed', 'Actions']}>
						{rows.map((s) => (
							<tr key={s.id}>
								<td className="px-4 py-3 font-medium text-slate-900">{s.email}</td>
								<td className="whitespace-nowrap px-4 py-3 text-slate-600">{s.date}</td>
								<td className="px-4 py-3">
									<DeleteButton label="Remove" action={deleteSubscriberAction.bind(null, s.id)} confirmText={`${s.email} will be removed from the list.`} />
								</td>
							</tr>
						))}
					</DataTable>
					<Pager page={Math.min(page, pages)} pages={pages} total={total} size={PAGE_SIZE} />
				</>
			)}
		</>
	);
}
