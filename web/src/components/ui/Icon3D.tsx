import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

type Tone = 'blue' | 'white' | 'navy';

const face: Record<Tone, string> = {
	blue: 'bg-[linear-gradient(145deg,#9391ff_0%,#6b68f7_48%,#4a46d6_100%)] text-white',
	white: 'bg-[linear-gradient(145deg,#ffffff_0%,#f1f1ff_55%,#dcdcfb_100%)] text-accent-deep',
	navy: 'bg-[linear-gradient(145deg,#3a4770_0%,#1f2a44_55%,#161e33_100%)] text-white',
};
const edge: Record<Tone, string> = { blue: 'bg-[#3c39b8]', white: 'bg-[#c9c9ee]', navy: 'bg-[#0d1224]' };

/**
 * A soft, glossy 3D tile with a glyph on it: stacked layers rotated in 3D give the thickness, so it needs no image.
 * `badge` adds a small second glyph floating in front (a stamp on a document, a tick on a shield).
 * To use a designer's own artwork instead, pass `src` (transparent PNG or WebP): it replaces the whole tile.
 */
export function Icon3D({
	icon: Icon,
	badge: Badge,
	tone = 'blue',
	size = 96,
	src,
	label,
	className,
}: {
	icon: LucideIcon;
	badge?: LucideIcon;
	tone?: Tone;
	size?: number;
	src?: string;
	label?: string;
	className?: string;
}) {
	const r = Math.round(size * 0.28);
	const aria = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
	if (src) {
		return (
			<span className={cn('float-on-hover inline-block', className)} style={{ width: size, height: size }} {...aria}>
				<img src={src} alt="" width={size} height={size} loading="lazy" decoding="async" className="float-target size-full object-contain" />
			</span>
		);
	}
	return (
		<span className={cn('float-on-hover perspective-1000 relative inline-block', className)} style={{ width: size, height: size }} {...aria}>
			<span className="float-target preserve-3d absolute inset-0 block" style={{ transform: 'rotateX(16deg) rotateY(-24deg) rotateZ(3deg)' }}>
				{[-18, -12, -6].map((z) => (
					<span key={z} className={cn('absolute inset-0 block', edge[tone])} style={{ borderRadius: r, transform: `translateZ(${z}px)` }} />
				))}
				<span className={cn('absolute inset-0 grid place-items-center overflow-hidden', face[tone])} style={{ borderRadius: r, boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.55), inset 0 -8px 16px rgb(0 0 0 / 0.12)' }}>
					<span aria-hidden className="absolute -top-1/3 -left-1/4 h-2/3 w-[130%] -rotate-12 bg-gradient-to-b from-white/45 to-transparent" />
					<Icon className="relative drop-shadow-[0_3px_3px_rgb(0_0_0/0.22)]" style={{ width: size * 0.46, height: size * 0.46 }} strokeWidth={1.9} />
				</span>
				{Badge && (
					<span className="absolute grid place-items-center rounded-[28%] bg-white text-accent-deep shadow-[0_6px_14px_-4px_rgb(31_42_68/0.4)]" style={{ width: size * 0.36, height: size * 0.36, right: -size * 0.1, bottom: -size * 0.08, transform: 'translateZ(26px)' }}>
						<Badge style={{ width: size * 0.2, height: size * 0.2 }} strokeWidth={2.2} />
					</span>
				)}
			</span>
			<span aria-hidden className="absolute inset-x-[12%] -bottom-3 h-3 rounded-[50%] bg-ink/25 blur-md" />
		</span>
	);
}
