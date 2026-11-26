import { cn } from '@/lib/cn';
import type { WorkItem } from '@/lib/work';

/** Paper-style certificate preview. Never shows a client name. `size="sm"` is for gallery tiles. */
export function CertificateCard({ c, size = 'lg', className }: { c: Pick<WorkItem, 'code' | 'kind' | 'body' | 'full' | 'logoUrl' | 'certificateUrl'>; size?: 'sm' | 'lg'; className?: string }) {
	const sm = size === 'sm';
	// A real certificate (client details already blurred in the image) is shown as it is.
	if (c.certificateUrl) {
		return (
			<article className={cn('overflow-hidden rounded-card-sm bg-white p-2 shadow-2xl ring-1 ring-line', className)}>
				<img src={c.certificateUrl} alt={`${c.code} certificate. Client details are blurred.`} loading="lazy" decoding="async" className={cn('mx-auto block h-auto w-auto max-w-full rounded-lg object-contain', sm ? 'max-h-[19rem]' : 'max-h-[34rem]')} />
			</article>
		);
	}
	return (
		<article className={cn('rounded-card-sm bg-[#fffdf7] text-ink shadow-2xl', sm ? 'p-2.5' : 'p-3', className)}>
			<div className={cn('rounded-xl border border-accent/30', sm ? 'p-5 sm:p-6' : 'p-8 sm:p-10')}>
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className={cn('font-semibold tracking-[0.2em] text-ink-mute uppercase', sm ? 'text-[0.625rem]' : 'text-xs')}>{c.body}</p>
						<p className={cn('mt-1 tracking-[0.2em] text-accent-deep uppercase', sm ? 'text-[0.625rem]' : 'text-xs')}>Secured by FWC</p>
					</div>
					{c.logoUrl && <img src={c.logoUrl} alt="" className={sm ? 'h-9 w-auto max-w-[7rem] object-contain' : 'h-14 w-auto max-w-[10rem] object-contain'} />}
				</div>
				<p className={cn('tracking-[0.2em] text-ink-mute uppercase', sm ? 'mt-6 text-[0.625rem]' : 'mt-10 text-sm')}>Certificate of {c.kind}</p>
				<p className={cn('mt-2 font-display leading-none text-ink', sm ? 'text-4xl' : 'text-6xl')}>{c.code}</p>
				<p className={cn('mt-3 max-w-sm text-ink-soft', sm ? 'text-xs' : '')}>{c.full}</p>
				<div className={cn('h-px bg-gradient-to-r from-accent/50 to-transparent', sm ? 'my-4' : 'my-8')} />
				<p className={cn('text-ink-mute', sm ? 'text-[0.6875rem]' : 'text-sm')}>This is to certify that</p>
				<p className={cn('mt-1 font-display blur-[5px] select-none', sm ? 'text-xl' : 'text-3xl')} aria-hidden>Client name withheld</p>
				<span className="sr-only">Client name withheld</span>
				<p className={cn('inline-flex items-center gap-2 rounded-full bg-accent/10 font-semibold tracking-widest text-accent-deep', sm ? 'mt-4 px-2.5 py-1 text-[0.625rem]' : 'mt-8 px-3 py-1.5 text-xs')}>✓ ISSUED</p>
			</div>
		</article>
	);
}
