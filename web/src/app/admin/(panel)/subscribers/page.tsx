import type { Metadata } from 'next';
import DeleteButton from '@/components/admin/DeleteButton';
import PageTitle from '@/components/admin/PageTitle';
import { DataTable, EmptyState } from '@/components/admin/bits';
import { listSubscribers } from '@/db/admin/simple';
import { deleteSubscriberAction } from './actions';

export const metadata: Metadata = { title: 'Email subscribers' };

export default async function SubscribersAdminPage() {
	const subscribers = await listSubscribers();

	return (
		<>
			<PageTitle title="Email subscribers" description={`${subscribers.length} ${subscribers.length === 1 ? 'person has' : 'people have'} subscribed through the website footer.`} />
			{subscribers.length === 0 ? (
				<EmptyState title="No subscribers yet">People who sign up in the website footer will appear here.</EmptyState>
			) : (
				<DataTable head={['Email', 'Subscribed', 'Actions']}>
					{subscribers.map((s) => (
						<tr key={s.id}>
							<td className="px-4 py-3 font-medium text-slate-900">{s.email}</td>
							<td className="whitespace-nowrap px-4 py-3 text-slate-600">{s.date}</td>
							<td className="px-4 py-3">
								<DeleteButton label="Remove" action={deleteSubscriberAction.bind(null, s.id)} confirmText={`${s.email} will be removed from the list.`} />
							</td>
						</tr>
					))}
				</DataTable>
			)}
		</>
	);
}
