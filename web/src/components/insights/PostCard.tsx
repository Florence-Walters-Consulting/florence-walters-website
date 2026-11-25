import { ArrowUpRight } from 'lucide-react';
import { SiteLink } from '@/components/ui/SiteLink';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format';
import { imageUrl } from '@/lib/images';

export type Post = { id: number; heading: string; slug: string; preamble: string; picture: string; date: string; category_name?: string | null };

/** Article card for the insights index and "related" lists. `featured` is the wide first card. */
export function PostCard({ post, featured, category }: { post: Post; featured?: boolean; category?: string | null }) {
	const cat = category ?? post.category_name;
	const href = `/blog/${post.slug}`;
	return (
		<article className={cn('group', featured && 'md:grid md:grid-cols-[1.25fr_1fr] md:items-center md:gap-12')}>
			<SiteLink href={href} className={cn('relative block overflow-hidden rounded-card bg-ink-deep', featured ? 'aspect-[16/10]' : 'aspect-[4/3]')} aria-label={post.heading} tabIndex={-1}>
				<img src={imageUrl('blog', post.picture)} alt="" loading={featured ? 'eager' : 'lazy'} decoding="async" className="size-full object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-105" />
				{cat && <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-ink uppercase">{cat}</span>}
			</SiteLink>
			<div className={cn(featured ? 'mt-6 md:mt-0' : 'mt-5')}>
				<p className="text-sm text-ink-mute">{formatDate(post.date)}</p>
				<h2 className={cn('mt-2 font-display', featured ? 'text-[clamp(2rem,3.4vw,3rem)]' : 'text-[1.75rem]', 'leading-[1.08]')}>
					<SiteLink href={href} className="transition-colors group-hover:text-accent-deep">{post.heading}</SiteLink>
				</h2>
				<p className={cn('mt-3 text-ink-soft', featured ? 'text-lead' : 'line-clamp-3 text-[0.9375rem]')}>{post.preamble}</p>
				<SiteLink href={href} className="mt-5 inline-flex items-center gap-2 border-b border-ink/25 pb-0.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent-deep">
					Read article <ArrowUpRight className="size-4" />
				</SiteLink>
			</div>
		</article>
	);
}
