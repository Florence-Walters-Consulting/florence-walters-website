'use client';

import { useRef, useState } from 'react';
import { Play } from 'lucide-react';

/** The 18-second brand film. It shows a poster with a play button and only loads and plays when asked, with sound controls. */
export function BrandFilm({ src, poster, title }: { src: string; poster: string; title: string }) {
	const [on, setOn] = useState(false);
	const ref = useRef<HTMLVideoElement>(null);
	return (
		<div className="relative aspect-video w-full overflow-hidden rounded-card bg-ink-deep shadow-lift ring-1 ring-line">
			{on ? (
				<video ref={ref} src={src} poster={poster} controls autoPlay playsInline className="size-full object-cover" aria-label={title} />
			) : (
				<button type="button" onClick={() => setOn(true)} aria-label={`Play: ${title}`} className="group absolute inset-0 block size-full">
					<img src={poster} alt="" className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]" />
					<span className="absolute inset-0 grid place-items-center bg-ink-deep/25 transition-colors group-hover:bg-ink-deep/10">
						<span className="grid size-20 place-items-center rounded-full bg-white text-accent-deep shadow-2xl transition-transform duration-300 group-hover:scale-110"><Play className="ml-1 size-8 fill-current" /></span>
					</span>
				</button>
			)}
		</div>
	);
}
