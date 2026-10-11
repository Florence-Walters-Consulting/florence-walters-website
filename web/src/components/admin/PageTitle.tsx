export default function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
	return (
		<div className="mb-6 flex flex-wrap items-start justify-between gap-3">
			<div>
				<h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
				{description && <p className="mt-1 max-w-2xl text-sm text-slate-600">{description}</p>}
			</div>
			{actions}
		</div>
	);
}
