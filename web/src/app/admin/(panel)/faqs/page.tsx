import { connection } from 'next/server';
import type { Metadata } from 'next';
import DeleteButton from '@/components/admin/DeleteButton';
import { ListControls, Pager } from '@/components/admin/ListControls';
import PageTitle from '@/components/admin/PageTitle';
import ResourceDialog from '@/components/admin/ResourceDialog';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { DataTable, EmptyState } from '@/components/admin/bits';
import { TextField } from '@/components/admin/fields';
import { listFaqs } from '@/db/admin/simple';
import { PAGE_SIZE, matches, pageFrom, paginate } from '@/lib/admin/list';
import { deleteFaqAction, saveFaq } from './actions';

export const metadata: Metadata = { title: 'FAQs' };

type Faq = Awaited<ReturnType<typeof listFaqs>>[number];

function FaqFields({ faq }: { faq?: Faq }) {
	return (
		<>
			{faq && <input type="hidden" name="id" value={faq.id} />}
			<TextField name="question" label="Question" required maxLength={1000} defaultValue={faq?.question} />
			<RichTextEditor name="body" label="Answer" required defaultValue={faq?.body} />
		</>
	);
}

export default async function FaqsAdminPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
	// The panel is per-visitor: never rendered at build time, so the queries below wait for the signed-in request.
	await connection();
	const sp = await searchParams;
	const q = (sp.q ?? '').trim().slice(0, 100);
	const all = await listFaqs();
	const { rows: faqs, total, pages, page } = paginate(all.filter((f) => matches(q, f.question, f.body)), pageFrom(sp.page));

	return (
		<>
			<PageTitle
				title="FAQs"
				description="Questions and answers shown in “Got Questions?” on the home page, in this order."
				actions={
					<ResourceDialog title="Add FAQ" triggerLabel="Add FAQ" variant="primary" action={saveFaq} wide>
						<FaqFields />
					</ResourceDialog>
				}
			/>
			{all.length > PAGE_SIZE && <ListControls placeholder="Search FAQs" />}
			{faqs.length === 0 ? (
				<EmptyState title={q ? 'No FAQs match' : 'No FAQs yet'}>{q ? 'Try a different search.' : 'Use “Add FAQ” to add the first question.'}</EmptyState>
			) : (
				<><DataTable head={['Question', 'Actions']}>
					{faqs.map((faq) => (
						<tr key={faq.id}>
							<td className="px-4 py-3 font-medium text-slate-900">{faq.question}</td>
							<td className="px-4 py-3">
								<div className="flex gap-2">
									<ResourceDialog title="Edit FAQ" triggerLabel="Edit" action={saveFaq} wide>
										<FaqFields faq={faq} />
									</ResourceDialog>
									<DeleteButton action={deleteFaqAction.bind(null, faq.id)} confirmText="This question and its answer will be permanently deleted." />
								</div>
							</td>
						</tr>
					))}
				</DataTable>
				<Pager page={page} pages={pages} total={total} size={PAGE_SIZE} /></>
			)}
		</>
	);
}
