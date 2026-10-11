import { ui } from './ui';

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
	return (
		<div className={`${ui.card} px-6 py-12 text-center`}>
			<p className="font-medium text-slate-900">{title}</p>
			{children && <p className="mt-1 text-sm text-slate-500">{children}</p>}
		</div>
	);
}

export function Badge({ tone = 'gray', children }: { tone?: 'gray' | 'green' | 'blue'; children: React.ReactNode }) {
	const tones = { gray: 'bg-slate-100 text-slate-700', green: 'bg-emerald-100 text-emerald-800', blue: 'bg-brand-soft text-brand' };
	return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function Thumb({ src, alt, className = 'h-12 w-16' }: { src: string; alt: string; className?: string }) {
	return <img src={src} alt={alt} loading="lazy" className={`${className} shrink-0 rounded-md border border-slate-200 bg-slate-100 object-cover`} />;
}

/** Table shell that scrolls sideways on small screens instead of breaking the page. */
export function DataTable({ head, children }: { head: string[]; children: React.ReactNode }) {
	return (
		<div className={`${ui.card} overflow-x-auto`}>
			<table className="w-full min-w-[36rem] text-left text-sm">
				<thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
					<tr>
						{head.map((h) => (
							<th key={h} scope="col" className="px-4 py-3 font-medium">
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100">{children}</tbody>
			</table>
		</div>
	);
}
