/**
 * Two roles, stored in admin.admin_type:
 *  - admin:  everything, including leads, subscribers and managing users
 *  - editor: writes and edits website content only (posts, FAQs, team, work highlights...)
 * The original account has the legacy type "superadmin", which counts as admin.
 */
export type Role = 'admin' | 'editor';

export const toRole = (adminType: string): Role => (adminType === 'editor' ? 'editor' : 'admin');
export const roleLabel: Record<Role, string> = { admin: 'Admin', editor: 'Editor' };
export const roleHint: Record<Role, string> = {
	admin: 'Full access, including enquiries, subscribers and users.',
	editor: 'Can write and edit website content. Cannot see enquiries or subscribers, or manage users.',
};
