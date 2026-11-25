import { listLeads } from '@/db/admin/leads';
import { ForbiddenError, requireAdminAction, UnauthorizedError } from '@/lib/auth/dal';
import { statusLabel, typeLabel } from '@/lib/leads';

const cell = (v: string | number) => {
	let s = String(v ?? '');
	// Spreadsheet formula injection: a cell starting with = + - @ would run as a formula in Excel.
	if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
	return `"${s.replace(/"/g, '""')}"`;
};

// CSV of the enquiries matching the current filters (admins only).
export async function GET(request: Request) {
	try {
		await requireAdminAction(['admin']);
	} catch (e) {
		if (e instanceof UnauthorizedError) return new Response('Please sign in.', { status: 401 });
		if (e instanceof ForbiddenError) return new Response('Not allowed.', { status: 403 });
		throw e;
	}
	const u = new URL(request.url).searchParams;
	const rows = await listLeads({ type: u.get('type') ?? undefined, status: u.get('status') ?? undefined, q: u.get('q')?.trim() || undefined }, 5000);
	const head = ['Received', 'Type', 'Status', 'Priority', 'Name', 'Email', 'Phone', 'Company', 'Subject', 'Summary'];
	const lines = [head.map(cell).join(',')];
	for (const r of rows) {
		lines.push([r.createdAt.toISOString(), typeLabel(r.type), statusLabel(r.status), r.priority, r.name, r.email, r.phone, r.company, r.subject, r.summary].map(cell).join(','));
	}
	return new Response('﻿' + lines.join('\r\n'), {
		headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="fwc-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`, 'Cache-Control': 'no-store' },
	});
}
