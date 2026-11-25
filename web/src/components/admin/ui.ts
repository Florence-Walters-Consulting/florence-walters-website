/** Shared Tailwind class strings for the admin UI. */
export const ui = {
	input:
		'block w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm placeholder:text-slate-400 transition-[border-color,box-shadow] focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10 disabled:bg-slate-100',
	label: 'mb-1.5 block text-sm font-medium text-slate-700',
	hint: 'mt-1.5 text-xs text-slate-500',
	btn: 'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
	btnPrimary: 'bg-accent text-white hover:bg-[#3b38b8]',
	btnSecondary: 'border border-line bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
	btnDanger: 'bg-red-600 text-white hover:bg-red-700',
	card: 'rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgb(31_42_68/0.04)]',
	error: 'rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800',
	success: 'rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-800',
} as const;
