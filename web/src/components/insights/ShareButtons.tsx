'use client';

import { useEffect, useState } from 'react';
import { Link2, Mail, MessageCircle, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/cn';

const btn = 'grid size-11 place-items-center rounded-full border border-ink/15 bg-white text-ink transition-colors duration-300 hover:border-accent hover:bg-accent-btn hover:text-white focus-visible:border-accent';

/** Share an article: the device's share sheet where available, plus LinkedIn, X, Facebook, WhatsApp, email and copy link. */
export function ShareButtons({ title, vertical, className }: { title: string; vertical?: boolean; className?: string }) {
	const [canShare, setCanShare] = useState(false);
	useEffect(() => {
		const t = window.setTimeout(() => setCanShare(typeof navigator.share === 'function'), 0);
		return () => window.clearTimeout(t);
	}, []);

	const url = () => window.location.href.split('#')[0];
	const open = (build: (u: string, t: string) => string) => () => {
		window.open(build(encodeURIComponent(url()), encodeURIComponent(title)), '_blank', 'noopener,noreferrer,width=640,height=560');
	};
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(url());
			toast.success('Link copied');
		} catch {
			toast.error('Could not copy the link');
		}
	};
	const nativeShare = () => navigator.share({ title, url: url() }).catch(() => {});

	return (
		<div className={cn('flex gap-2.5', vertical ? 'flex-col' : 'flex-wrap items-center', className)} role="group" aria-label="Share this article">
			{canShare && (
				<button type="button" onClick={nativeShare} aria-label="Share" title="Share" className={cn(btn, 'bg-ink text-white hover:bg-accent-btn sm:hidden')}><Share2 className="size-[1.125rem]" /></button>
			)}
			<button type="button" onClick={open((u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`)} aria-label="Share on LinkedIn" title="LinkedIn" className={cn(btn, 'text-sm font-semibold')}>in</button>
			<button type="button" onClick={open((u, t) => `https://twitter.com/intent/tweet?text=${t}&url=${u}`)} aria-label="Share on X" title="X" className={cn(btn, 'text-base')}>𝕏</button>
			<button type="button" onClick={open((u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`)} aria-label="Share on Facebook" title="Facebook" className={cn(btn, 'text-base font-semibold')}>f</button>
			<button type="button" onClick={open((u, t) => `https://wa.me/?text=${t}%20${u}`)} aria-label="Share on WhatsApp" title="WhatsApp" className={btn}><MessageCircle className="size-[1.125rem]" /></button>
			<button type="button" onClick={() => { window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url())}`; }} aria-label="Share by email" title="Email" className={btn}><Mail className="size-[1.125rem]" /></button>
			<button type="button" onClick={copy} aria-label="Copy link" title="Copy link" className={btn}><Link2 className="size-[1.125rem]" /></button>
		</div>
	);
}
