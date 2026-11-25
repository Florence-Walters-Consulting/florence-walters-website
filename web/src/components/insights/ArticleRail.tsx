'use client';

import { useReadingProgress } from './useReadingProgress';
import { ShareButtons } from './ShareButtons';

const R = 26;
const C = 2 * Math.PI * R;

/** Sticky side rail: reading-progress ring with minutes left, then the share buttons. Desktop only. */
export function ArticleRail({ targetId, minutes, title }: { targetId: string; minutes: number; title: string }) {
	const p = useReadingProgress(targetId);
	const left = p >= 0.995 ? 0 : Math.max(1, Math.ceil(minutes * (1 - p)));
	return (
		<div className="sticky top-32 hidden flex-col items-center gap-8 lg:flex">
			<div className="text-center">
				<div className="relative size-16">
					<svg viewBox="0 0 64 64" className="-rotate-90" aria-hidden>
						<circle cx="32" cy="32" r={R} fill="none" stroke="var(--color-line)" strokeWidth="3" />
						<circle cx="32" cy="32" r={R} fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} />
					</svg>
					<span className="absolute inset-0 grid place-items-center text-sm font-semibold tabular-nums text-ink">{Math.round(p * 100)}%</span>
				</div>
				<p className="mt-2 text-xs text-ink-mute" aria-live="off">{left === 0 ? 'Finished' : `${left} min left`}</p>
			</div>
			<ShareButtons title={title} vertical />
		</div>
	);
}
