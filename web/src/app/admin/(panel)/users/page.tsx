import type { Metadata } from 'next';
import DeleteButton from '@/components/admin/DeleteButton';
import PageTitle from '@/components/admin/PageTitle';
import ResourceDialog from '@/components/admin/ResourceDialog';
import { Badge, DataTable } from '@/components/admin/bits';
import { SelectField, TextField } from '@/components/admin/fields';
import { listAdmins } from '@/db/admin/admins';
import { requireAdmin } from '@/lib/auth/dal';
import { roleHint, roleLabel, toRole } from '@/lib/auth/roles';
import { deleteUserAction, saveUser } from './actions';

export const metadata: Metadata = { title: 'Users' };

type User = Awaited<ReturnType<typeof listAdmins>>[number];

const roleOptions = [
	{ value: 'admin', label: `${roleLabel.admin}: ${roleHint.admin}` },
	{ value: 'editor', label: `${roleLabel.editor}: ${roleHint.editor}` },
];

function UserFields({ user }: { user?: User }) {
	return (
		<>
			{user && <input type="hidden" name="id" value={user.id} />}
			<TextField name="name" label="Full name" required maxLength={50} defaultValue={user?.name} />
			<TextField name="email" label="Email address" type="email" required maxLength={254} defaultValue={user?.email} />
			{user ? (
				<p className="text-sm text-slate-600">Username: <strong>{user.username}</strong> (cannot be changed)</p>
			) : (
				<TextField name="username" label="Username" required maxLength={50} hint="Lowercase letters, numbers, dots, dashes or underscores. They sign in with this." />
			)}
			<SelectField name="role" label="Role" required defaultValue={user ? toRole(user.adminType) : 'editor'} options={roleOptions} />
			<TextField name="password" label={user ? 'New password' : 'Password'} type="password" required={!user} hint={user ? 'Leave blank to keep their current password. At least 10 characters.' : 'At least 10 characters. Share it with them securely; they can change it after signing in.'} />
		</>
	);
}

export default async function UsersPage() {
	const me = await requireAdmin(['admin']);
	const users = await listAdmins();

	return (
		<>
			<PageTitle
				title="Users"
				description="Who can sign in to this admin. Admins have full access; Editors can write and edit website content only."
				actions={
					<ResourceDialog title="Add user" triggerLabel="Add user" variant="primary" action={saveUser}>
						<UserFields />
					</ResourceDialog>
				}
			/>
			<DataTable head={['User', 'Username', 'Role', 'Actions']}>
				{users.map((u) => {
					const role = toRole(u.adminType);
					return (
						<tr key={u.id}>
							<td className="px-4 py-3">
								<p className="font-medium text-slate-900">{u.name}{u.id === me.id && <span className="ml-2 text-xs font-normal text-slate-500">(you)</span>}</p>
								<p className="text-slate-500">{u.email}</p>
							</td>
							<td className="px-4 py-3 text-slate-600">{u.username}</td>
							<td className="px-4 py-3"><Badge tone={role === 'admin' ? 'blue' : 'gray'}>{roleLabel[role]}</Badge></td>
							<td className="px-4 py-3">
								<div className="flex gap-2">
									<ResourceDialog title="Edit user" triggerLabel="Edit" action={saveUser}>
										<UserFields user={u} />
									</ResourceDialog>
									{u.id !== me.id && <DeleteButton action={deleteUserAction.bind(null, u.id)} confirmText={`${u.name} will no longer be able to sign in.`} />}
								</div>
							</td>
						</tr>
					);
				})}
			</DataTable>
		</>
	);
}
