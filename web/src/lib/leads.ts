// Shared (client and server) vocabulary for the Inbox.
/** Enquiries are deleted automatically this many days after they arrive (scripts/purge-leads.ts, run daily). */
export const LEAD_RETENTION_DAYS = 90;

export type LeadType = 'contact' | 'assessment' | 'consultation';
export type LeadStatus = 'new' | 'reviewing' | 'qualified' | 'closed';
export type Detail = { label: string; value: string | string[] };

export const leadStatuses: { value: LeadStatus; label: string; dot: string }[] = [
	{ value: 'new', label: 'New', dot: '#6b68f7' },
	{ value: 'reviewing', label: 'Reviewing', dot: '#f2b84b' },
	{ value: 'qualified', label: 'Qualified', dot: '#16a34a' },
	{ value: 'closed', label: 'Closed', dot: '#94a3b8' },
];
export const statusLabel = (s: string) => leadStatuses.find((x) => x.value === s)?.label ?? s;

export const leadTypes: { value: LeadType; label: string; short: string }[] = [
	{ value: 'contact', label: 'Contact enquiry', short: 'Enquiry' },
	{ value: 'assessment', label: 'Business assessment', short: 'Assessment' },
	{ value: 'consultation', label: 'Paid consultation', short: 'Consultation' },
];
export const typeLabel = (t: string) => leadTypes.find((x) => x.value === t)?.label ?? t;
export const typeShort = (t: string) => leadTypes.find((x) => x.value === t)?.short ?? t;

/** Drops empty answers and flattens to what the detail view shows. */
export function cleanDetails(rows: { label: string; value: string | string[] | undefined | null }[]): Detail[] {
	const out: Detail[] = [];
	for (const r of rows) {
		if (Array.isArray(r.value)) {
			const items = r.value.map((v) => v.trim()).filter(Boolean);
			if (items.length) out.push({ label: r.label, value: items });
		} else if (typeof r.value === 'string' && r.value.trim()) out.push({ label: r.label, value: r.value.trim() });
	}
	return out;
}
