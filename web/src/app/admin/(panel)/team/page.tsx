import type { Metadata } from 'next';
import DeleteButton from '@/components/admin/DeleteButton';
import ImageField from '@/components/admin/ImageField';
import PageTitle from '@/components/admin/PageTitle';
import ResourceDialog from '@/components/admin/ResourceDialog';
import { DataTable, EmptyState, Thumb } from '@/components/admin/bits';
import { TextField } from '@/components/admin/fields';
import { listTeam } from '@/db/admin/simple';
import { imageUrl } from '@/lib/images';
import { deleteTeamMemberAction, saveTeamMember } from './actions';

export const metadata: Metadata = { title: 'Team' };

type Member = Awaited<ReturnType<typeof listTeam>>[number];

function MemberFields({ member }: { member?: Member }) {
	return (
		<>
			{member && <input type="hidden" name="id" value={member.id} />}
			<TextField name="name" label="Name" required maxLength={100} defaultValue={member?.name} />
			<TextField name="position" label="Position" required maxLength={100} defaultValue={member?.position} />
			<TextField name="link" label="LinkedIn or social link" maxLength={500} defaultValue={member?.link} hint="Optional. Starts with https://. Shows a button on the About page." />
			<ImageField required={!member} currentUrl={member ? imageUrl('team', member.picture) : undefined} />
		</>
	);
}

export default async function TeamAdminPage() {
	const team = await listTeam();

	return (
		<>
			<PageTitle
				title="Team"
				description="People shown in “Meet Our Experts” on the About page."
				actions={
					<ResourceDialog title="Add team member" triggerLabel="Add member" variant="primary" action={saveTeamMember}>
						<MemberFields />
					</ResourceDialog>
				}
			/>
			{team.length === 0 ? (
				<EmptyState title="No team members yet">Use “Add member” to add the first person.</EmptyState>
			) : (
				<DataTable head={['Member', 'Position', 'Actions']}>
					{team.map((member) => (
						<tr key={member.id}>
							<td className="px-4 py-3">
								<div className="flex items-center gap-3">
									<Thumb src={imageUrl('team', member.picture)} alt="" className="h-12 w-12" />
									<span className="font-medium text-slate-900">{member.name}</span>
								</div>
							</td>
							<td className="px-4 py-3 text-slate-600">{member.position}</td>
							<td className="px-4 py-3">
								<div className="flex gap-2">
									<ResourceDialog title="Edit team member" triggerLabel="Edit" action={saveTeamMember}>
										<MemberFields member={member} />
									</ResourceDialog>
									<DeleteButton action={deleteTeamMemberAction.bind(null, member.id)} confirmText={`${member.name} will be removed from the website.`} />
								</div>
							</td>
						</tr>
					))}
				</DataTable>
			)}
		</>
	);
}
