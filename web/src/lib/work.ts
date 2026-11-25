// Shared (client and server) vocabulary for work highlights.
export const workCategories = ['Company formation', 'Licences & registrations', 'Intellectual property', 'Other'] as const;
export type WorkCategory = string;

export type WorkStep = { t: string; d: string };

/** What the public pages use. Never contains a client name. */
export type WorkItem = {
	slug: string;
	code: string;
	kind: string;
	body: string;
	full: string;
	/** Ready-to-use image URL for the regulator's logo, if any. */
	logoUrl?: string;
	category: WorkCategory;
	summary: string;
	scope: WorkStep[];
	receive: string[];
	service: { slug: string; name: string };
};

/** Logos we already hold for regulators (public/media/regulators/<key>.webp). */
export const builtinLogos: { key: string; label: string }[] = [
	{ key: 'cac', label: 'Corporate Affairs Commission (CAC)' },
	{ key: 'nrs', label: 'Nigeria Revenue Service (NRS)' },
	{ key: 'scuml', label: 'SCUML / EFCC' },
	{ key: 'nafdac', label: 'NAFDAC' },
	{ key: 'cbn', label: 'Central Bank of Nigeria (CBN)' },
	{ key: 'sec', label: 'Securities and Exchange Commission (SEC)' },
	{ key: 'naicom', label: 'NAICOM' },
	{ key: 'pencom', label: 'PenCom' },
	{ key: 'ncc', label: 'Nigerian Communications Commission (NCC)' },
	{ key: 'nerc', label: 'NERC' },
	{ key: 'ndpc', label: 'NDPC' },
	{ key: 'nuprc', label: 'NUPRC' },
	{ key: 'nmdpra', label: 'NMDPRA' },
	{ key: 'nimasa', label: 'NIMASA' },
];

/** "Title | what happened" per line, to and from the admin textarea. */
export function parseScope(text: string): WorkStep[] {
	return text
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter(Boolean)
		.map((l) => {
			const i = l.indexOf('|');
			return i === -1 ? { t: l, d: '' } : { t: l.slice(0, i).trim(), d: l.slice(i + 1).trim() };
		})
		.filter((s) => s.t);
}
export const formatScope = (scope: WorkStep[]) => scope.map((s) => (s.d ? `${s.t} | ${s.d}` : s.t)).join('\n');
export const parseLines = (text: string) => text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
