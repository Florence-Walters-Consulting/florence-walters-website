/** Shared Tailwind class strings for the admin UI. */
export const ui = {
	input:
		'block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:bg-slate-100',
	label: 'mb-1 block text-sm font-medium text-slate-700',
	hint: 'mt-1 text-xs text-slate-500',
	btn: 'inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
	btnPrimary: 'bg-brand text-white hover:bg-brand/90',
	btnSecondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
	btnDanger: 'bg-red-600 text-white hover:bg-red-700',
	card: 'rounded-lg border border-slate-200 bg-white shadow-sm',
	error: 'rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800',
	success: 'rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800',
} as const;
