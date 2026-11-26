import { ui } from './ui';

type Common = { name: string; label: string; required?: boolean; hint?: string };

function Label({ name, label, required }: Common) {
	return (
		<label htmlFor={name} className={ui.label}>
			{label}
			{required && <span aria-hidden="true"> *</span>}
		</label>
	);
}

export function TextField({ name, label, required, hint, defaultValue, maxLength, type = 'text' }: Common & { defaultValue?: string; maxLength?: number; type?: string }) {
	return (
		<div>
			<Label name={name} label={label} required={required} />
			<input id={name} name={name} type={type} defaultValue={defaultValue} required={required} maxLength={maxLength} className={ui.input} />
			{hint && <p className={ui.hint}>{hint}</p>}
		</div>
	);
}

export function TextAreaField({ name, label, required, hint, defaultValue, rows = 4, mono }: Common & { defaultValue?: string; rows?: number; mono?: boolean }) {
	return (
		<div>
			<Label name={name} label={label} required={required} />
			<textarea id={name} name={name} rows={rows} defaultValue={defaultValue} required={required} className={`${ui.input} ${mono ? 'font-mono text-xs' : ''}`} />
			{hint && <p className={ui.hint}>{hint}</p>}
		</div>
	);
}

export function SelectField({ name, label, required, hint, defaultValue, options, placeholder }: Common & { defaultValue?: string; options: { value: string; label: string }[]; placeholder?: string }) {
	return (
		<div>
			<Label name={name} label={label} required={required} />
			<select id={name} name={name} defaultValue={defaultValue ?? ''} required={required} className={ui.input}>
				{placeholder !== undefined && <option value="">{placeholder}</option>}
				{options.map((o) => (
					<option key={o.value} value={o.value}>
						{o.label}
					</option>
				))}
			</select>
			{hint && <p className={ui.hint}>{hint}</p>}
		</div>
	);
}

export const YES_NO = [
	{ value: 'Yes', label: 'Yes' },
	{ value: 'No', label: 'No' },
];
