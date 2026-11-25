'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

export const inputClass =
	'w-full rounded-xl border border-line bg-white px-4 py-3.5 text-ink placeholder:text-ink-mute/70 transition-[border-color,box-shadow] duration-300 focus:border-accent focus:shadow-[0_0_0_4px_rgb(75_72_214/0.12)] focus:outline-none';

export function Field({ label, optional, hint, children }: { label: string; optional?: boolean; hint?: string; children: React.ReactNode }) {
	return (
		<label className="block">
			<span className="mb-2 block text-sm font-medium text-ink">
				{label} {optional ? <span className="font-normal text-ink-mute">(optional)</span> : <span className="text-accent-deep">*</span>}
			</span>
			{children}
			{hint && <span className="mt-2 block text-xs text-ink-mute">{hint}</span>}
		</label>
	);
}

export type Option = string | { value: string; label: string; sub?: string };

/** Radio or checkbox group rendered as selectable cards (real inputs underneath, so keyboard and screen readers work). */
export function ChoiceGroup({
	legend,
	hint,
	name,
	options,
	value,
	onChange,
	multiple,
	columns = 2,
}: {
	legend: string;
	hint?: string;
	name: string;
	options: Option[];
	value: string | string[] | undefined;
	onChange: (value: string) => void;
	multiple?: boolean;
	columns?: 1 | 2 | 3;
}) {
	return (
		<fieldset className="mt-8 first:mt-0">
			<legend className="text-[1.0625rem] font-semibold text-ink">{legend}{multiple && <span className="ml-2 text-sm font-normal text-ink-mute">Select all that apply</span>}</legend>
			{hint && <p className="mt-1 text-sm text-ink-mute">{hint}</p>}
			<div className={cn('mt-4 grid gap-3', columns === 2 && 'sm:grid-cols-2', columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3')}>
				{options.map((o) => {
					const v = typeof o === 'string' ? o : o.value;
					const label = typeof o === 'string' ? o : o.label;
					const sub = typeof o === 'string' ? undefined : o.sub;
					const checked = Array.isArray(value) ? value.includes(v) : value === v;
					return (
						<label key={v} className={cn('group relative flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-bright has-[:focus-visible]:ring-offset-2', checked ? 'border-accent bg-accent/[0.06] shadow-[0_8px_24px_-16px_rgb(75_72_214/0.6)]' : 'border-line bg-white hover:border-ink/30')}>
							<input type={multiple ? 'checkbox' : 'radio'} name={name} value={v} checked={checked} onChange={() => onChange(v)} className="sr-only" />
							<span aria-hidden className={cn('mt-0.5 grid size-5 shrink-0 place-items-center border-2 transition-colors', multiple ? 'rounded-md' : 'rounded-full', checked ? 'border-accent bg-accent-btn text-white' : 'border-accent-soft bg-white')}>
								{checked && <Check className="size-3.5" strokeWidth={3.5} />}
							</span>
							<span>
								<span className={cn('block text-[0.9375rem] leading-snug', checked ? 'font-semibold text-ink' : 'text-ink')}>{label}</span>
								{sub && <span className="mt-1 block text-sm text-ink-mute">{sub}</span>}
							</span>
						</label>
					);
				})}
			</div>
		</fieldset>
	);
}

/** Left rail on desktop: numbered steps with done/current state. On mobile it collapses to a progress bar and label. */
export function StepRail({ steps, current }: { steps: string[]; current: number }) {
	const pct = Math.round(((current + 1) / steps.length) * 100);
	return (
		<>
			<div className="lg:hidden" aria-hidden>
				<div className="flex items-baseline justify-between text-sm">
					<span className="font-semibold text-ink">Step {current + 1} of {steps.length} · {steps[current]}</span>
					<span className="text-ink-mute tabular-nums">{pct}%</span>
				</div>
				<div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-accent-btn transition-[width] duration-700 ease-out-expo" style={{ width: `${pct}%` }} /></div>
			</div>
			<ol className="hidden lg:block" aria-label={`Progress, step ${current + 1} of ${steps.length}`}>
				{steps.map((s, i) => (
					<li key={s} className="relative flex gap-4 pb-8 last:pb-0" aria-current={i === current ? 'step' : undefined}>
						{i < steps.length - 1 && <span aria-hidden className={cn('absolute top-9 bottom-0 left-[1.0625rem] w-px transition-colors duration-500', i < current ? 'bg-accent-btn' : 'bg-line')} />}
						<span className={cn('relative grid size-[2.125rem] shrink-0 place-items-center rounded-full border-2 text-sm font-semibold transition-colors duration-500', i < current ? 'border-accent bg-accent-btn text-white' : i === current ? 'border-accent bg-white text-accent-deep' : 'border-line bg-white text-ink-mute')}>
							{i < current ? <Check className="size-4" strokeWidth={3} /> : i + 1}
						</span>
						<span className="pt-1">
							<span className={cn('block text-[0.9375rem] font-semibold transition-colors', i <= current ? 'text-ink' : 'text-ink-mute')}>{s}</span>
							<span className="block text-xs text-ink-mute">{i < current ? 'Done' : i === current ? 'In progress' : 'Up next'}</span>
						</span>
					</li>
				))}
			</ol>
		</>
	);
}

export function FormError({ children }: { children: React.ReactNode }) {
	if (!children) return null;
	return <p role="alert" className="mt-6 rounded-xl border border-[#e8664a]/40 bg-[#e8664a]/10 px-4 py-3 text-sm text-[#a2381f]">{children}</p>;
}
