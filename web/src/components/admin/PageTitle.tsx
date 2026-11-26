export default function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
	return (
		<div className="mb-8 flex flex-wrap items-end justify-between gap-4">
			<div>
				<h1 className="text-4xl leading-none text-brand">{title}</h1>
				{description && <p className="mt-3 max-w-2xl text-sm text-slate-600">{description}</p>}
			</div>
			{actions}
		</div>
	);
}
