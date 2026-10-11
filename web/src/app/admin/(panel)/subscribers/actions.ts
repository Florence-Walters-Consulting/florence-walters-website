'use server';

import { deleteSubscriber } from '@/db/admin/simple';
import { refresh, runAdminAction, type ActionState } from '@/lib/admin/action';
import { rowId } from '@/lib/admin/schemas';

export async function deleteSubscriberAction(id: number): Promise<ActionState> {
	return runAdminAction(async () => {
		await deleteSubscriber(rowId.parse(id));
		refresh('/admin/subscribers');
		return 'Subscriber removed.';
	});
}
