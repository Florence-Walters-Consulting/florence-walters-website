import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ArticleRail } from '@/components/insights/ArticleRail';
import { NewsletterBand } from '@/components/insights/NewsletterBand';
import { PostCard } from '@/components/insights/PostCard';
import { ReadingProgress } from '@/components/insights/ReadingProgress';
import { ShareButtons } from '@/components/insights/ShareButtons';
import { Toc } from '@/components/insights/Toc';
import { Container } from '@/components/ui/Container';
import { SiteLink } from '@/components/ui/SiteLink';
import type { getBlogBySlug } from '@/db/queries/blog';
import { prepareArticle, readingMinutes } from '@/lib/article';
import { formatDate } from '@/lib/format';
import { imageUrl } from '@/lib/images';

type Live = NonNullable<Awaited<ReturnType<typeof getBlogBySlug>>>;
type Neighbour = { id: number; heading: string; slug: string; picture: string };
// The previous and next posts can be missing (and always are in a draft preview).
type Article = Omit<Live, 'previous' | 'next' | 'blog'> & { blog: Omit<Live['blog'], 'comments_allowed'> & { comments_allowed?: string }; previous: Neighbour | null; next: Neighbour | null };

/** The full article page (header, body, share rail, contents, previous/next, related). Used for the live page and the draft preview. */
export function ArticleView({ data, preview }: { data: Article; preview?: boolean }) {
	const { blog, previous, next, related } = data;
	const minutes = readingMinutes(blog.body ?? '');
	// Article body is admin-authored HTML (rich-text editor, sanitised on save). Headings get ids for the contents list.
	const { html, toc } = prepareArticle(blog.body ?? '');

	return (
		<>
			{preview && <p className="fixed inset-x-0 bottom-0 z-[90] bg-amber-400 px-4 py-2.5 text-center text-sm font-semibold text-ink">Draft preview: only people with this link can see this page. It is not published.</p>}
			<ReadingProgress targetId="article-body" />

			<header className="bg-canvas pt-40 pb-12">
				<Container>
					<div className="max-w-4xl">
						<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-soft">
							<SiteLink href="/blog" className="rounded-full bg-mist px-3.5 py-1.5 text-xs font-semibold tracking-wider text-accent-deep uppercase transition-colors hover:bg-accent-btn hover:text-white">{blog.category_name}</SiteLink>
							<span>{formatDate(blog.date)}</span>
							<span aria-hidden className="size-1 rounded-full bg-ink-mute" />
							<span>{minutes} min read</span>
						</div>
						<h1 className="hero-in mt-6 text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[1.02] tracking-[-0.015em]">{blog.heading}</h1>
						<p className="hero-in mt-6 max-w-3xl text-lead text-ink-soft" style={{ animationDelay: '140ms' }}>{blog.preamble}</p>
						<div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
							<div className="flex items-center gap-3">
								<span className="grid size-11 place-items-center rounded-full bg-ink font-display text-lg text-white">FW</span>
								<div>
									<p className="font-semibold">Florence Walters</p>
									<p className="text-sm text-ink-mute">Florence Walters Consulting</p>
								</div>
							</div>
							<ShareButtons title={blog.heading} className="lg:hidden" />
						</div>
					</div>
				</Container>
			</header>

			<Container>
				<figure className="relative overflow-hidden rounded-card bg-ink-deep">
					<img src={imageUrl('blog', blog.picture)} alt={blog.heading} fetchPriority="high" className="aspect-[16/8] w-full object-cover" />
				</figure>
			</Container>

			<article className="section-space pt-14 lg:pt-20">
				<Container className="grid justify-center gap-x-14 gap-y-10 lg:grid-cols-[4.5rem_minmax(0,44rem)] xl:grid-cols-[4.5rem_minmax(0,44rem)_16rem]">
					<ArticleRail targetId="article-body" minutes={minutes} title={blog.heading} />
					<div>
						<div id="article-body" className="article-body" dangerouslySetInnerHTML={{ __html: html }} />

						<footer className="mt-14 border-t border-line pt-8">
							<div className="flex flex-wrap items-center justify-between gap-6">
								<p className="text-sm text-ink-soft">Filed under <SiteLink href="/blog" className="font-semibold text-ink underline decoration-accent-soft underline-offset-4 hover:text-accent-deep">{blog.category_name}</SiteLink></p>
								<div className="flex items-center gap-4">
									<span className="text-sm font-semibold">Share this article</span>
									<ShareButtons title={blog.heading} />
								</div>
							</div>
						</footer>
					</div>
					<Toc items={toc} />
				</Container>
			</article>

			{(previous || next) && (
				<nav aria-label="More articles" className="border-y border-line">
					<Container className="grid md:grid-cols-2 md:divide-x md:divide-line">
						{previous ? (
							<SiteLink href={`/blog/${previous.slug}`} className="group flex items-center gap-5 py-8 md:pr-10">
								<img src={imageUrl('blog', previous.picture)} alt="" loading="lazy" className="hidden size-20 shrink-0 rounded-card-sm object-cover sm:block" />
								<span>
									<span className="flex items-center gap-2 text-xs tracking-wider text-ink-mute uppercase"><ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" /> Previous insight</span>
									<span className="mt-2 block font-display text-2xl leading-tight transition-colors group-hover:text-accent-deep">{previous.heading}</span>
								</span>
							</SiteLink>
						) : <span />}
						{next ? (
							<SiteLink href={`/blog/${next.slug}`} className="group flex items-center justify-end gap-5 border-t border-line py-8 text-right md:border-t-0 md:pl-10">
								<span>
									<span className="flex items-center justify-end gap-2 text-xs tracking-wider text-ink-mute uppercase">Next insight <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" /></span>
									<span className="mt-2 block font-display text-2xl leading-tight transition-colors group-hover:text-accent-deep">{next.heading}</span>
								</span>
								<img src={imageUrl('blog', next.picture)} alt="" loading="lazy" className="hidden size-20 shrink-0 rounded-card-sm object-cover sm:block" />
							</SiteLink>
						) : <span />}
					</Container>
				</nav>
			)}

			{related.length > 0 && (
				<section className="section-space">
					<Container>
						<div className="flex flex-wrap items-end justify-between gap-6">
							<div>
								<p className="label-dot text-sm font-medium tracking-wide text-ink-soft">Continue reading</p>
								<h2 className="mt-4 text-title">Related insights<span className="stop">.</span></h2>
							</div>
							<SiteLink href="/blog" className="text-sm font-semibold underline decoration-accent-soft underline-offset-4 hover:text-accent-deep">View all insights →</SiteLink>
						</div>
						<div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
							{related.map((p) => <PostCard key={p.id} post={p} category={blog.category_name} />)}
						</div>
					</Container>
				</section>
			)}

			<NewsletterBand />
		</>
	);
}
