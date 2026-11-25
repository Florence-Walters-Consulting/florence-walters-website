import { ArrowRight } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { SiteLink } from './SiteLink';

/**
 * The site's one button: a single pill whose label is followed by a small round arrow
 * inside the same shape (set `arrow={false}` for a plain pill). The arrow nudges forward on hover.
 */
const pill = cva(
	'group inline-flex items-center justify-center gap-3 rounded-full text-center font-medium transition-colors duration-300 ease-soft',
	{
		variants: {
			variant: {
				primary: 'bg-accent-btn text-white hover:bg-accent-hover',
				dark: 'bg-ink text-white hover:bg-ink-deep',
				light: 'bg-white text-ink hover:bg-mist',
				outline: 'border border-ink/25 text-ink hover:border-accent-btn hover:bg-accent-btn hover:text-white',
				'outline-light': 'border border-white/35 text-white hover:bg-white hover:text-ink',
			},
			size: { md: 'min-h-11 text-[0.9375rem]', lg: 'min-h-14 text-[0.9375rem] leading-tight sm:text-base' },
			arrow: { true: '', false: '' },
		},
		compoundVariants: [
			{ size: 'md', arrow: true, class: 'py-1.5 pr-1.5 pl-5' },
			{ size: 'md', arrow: false, class: 'px-6 py-2' },
			{ size: 'lg', arrow: true, class: 'py-2 pr-2 pl-6 sm:pl-7' },
			{ size: 'lg', arrow: false, class: 'px-7 py-3 sm:px-8' },
		],
		defaultVariants: { variant: 'primary', size: 'md', arrow: true },
	},
);

const dot = {
	primary: 'bg-white/20',
	dark: 'bg-white/15',
	light: 'bg-accent-btn text-white',
	outline: 'bg-ink/10 group-hover:bg-white/20',
	'outline-light': 'bg-white/15 group-hover:bg-ink/10',
} as const;

type ButtonProps = Pick<VariantProps<typeof pill>, 'variant' | 'size'> & {
	children: React.ReactNode;
	arrow?: boolean;
	className?: string;
} & (
		| { href: string; type?: never; onClick?: never }
		| { href?: never; type?: 'button' | 'submit'; onClick?: React.MouseEventHandler<HTMLButtonElement> }
	);

export function Button({ children, variant = 'primary', size = 'md', arrow = true, className, href, type = 'button', onClick }: ButtonProps) {
	const v = variant ?? 'primary';
	const classes = cn(pill({ variant, size, arrow }), className);
	const content = (
		<>
			<span>{children}</span>
			{arrow && (
				<span aria-hidden className={cn('grid shrink-0 place-items-center rounded-full', size === 'lg' ? 'size-10' : 'size-8', dot[v])}>
					<ArrowRight className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5" strokeWidth={2} />
				</span>
			)}
		</>
	);

	if (href === undefined) {
		return (
			<button type={type} onClick={onClick} className={classes}>
				{content}
			</button>
		);
	}
	return (
		<SiteLink href={href} className={classes}>
			{content}
		</SiteLink>
	);
}
