import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAdminOrNull } from '@/lib/auth/dal';
import LoginForm from './LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

async function LoginGate() {
	if (await getAdminOrNull()) redirect('/admin');
	return <LoginForm />;
}

const words = ['Structure.', 'Strategy.', 'Excellence.'];

/**
 * Split screen: a full-height brand panel (slowly drifting photograph, the three words the firm is
 * built on, rising in one by one) beside a calm sign-in column. On phones the panel becomes a band.
 */
export default function LoginPage() {
	return (
		<main className="grid min-h-screen lg:grid-cols-[1.15fr_1fr]">
			<section className="relative isolate flex flex-col justify-between overflow-hidden bg-brand-deep px-6 py-8 text-white sm:px-12 sm:py-12 lg:min-h-screen lg:px-16 lg:py-14">
				<div aria-hidden className="absolute inset-0 -z-20">
					<Image src="/media/images/lagos-office-building.webp" alt="" fill priority sizes="(min-width: 1024px) 58vw, 100vw" quality={70} className="drift object-cover object-[62%_40%]" />
				</div>
				<div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-deep/95 via-brand-deep/70 to-brand-deep/30" />
				<div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-brand-deep to-transparent" />
				<span aria-hidden className="pointer-events-none absolute -right-6 -bottom-16 -z-10 hidden font-display text-[22rem] leading-none text-transparent select-none [-webkit-text-stroke:1px_rgb(255_255_255/0.1)] lg:block">FWC</span>

				<img src="/media/logo-white.webp" alt="Florence Walters Consulting" className="rise h-14 w-auto self-start sm:h-16" />

				<div className="my-12 lg:my-0">
					<p className="rise text-xs font-medium tracking-[0.28em] text-accent-soft uppercase" style={{ animationDelay: '150ms' }}>
						<span aria-hidden className="mr-3 inline-block size-2 bg-[#6b68f7]" />
						Admin
					</p>
					<h1 className="mt-5 text-[clamp(3rem,7.4vw,6.5rem)] leading-[0.95] tracking-[-0.015em]">
						{words.map((w, i) => (
							<span key={w} className={`rise block ${i === 2 ? 'text-accent-soft italic' : ''}`} style={{ animationDelay: `${300 + i * 170}ms` }}>
								{w}
							</span>
						))}
					</h1>
					<span aria-hidden className="grow mt-9 block h-px w-24 bg-accent-soft" />
					<p className="rise mt-6 max-w-sm text-lg leading-relaxed text-white/70" style={{ animationDelay: '950ms' }}>
						Where the work behind the website gets done.
					</p>
				</div>

				<p className="rise text-sm text-white/45" style={{ animationDelay: '1100ms' }}>
					Private area. Authorised users only.
				</p>
			</section>

			<section className="flex items-center justify-center bg-canvas px-6 py-14 sm:px-12">
				<div className="w-full max-w-sm">
					<h2 className="rise text-5xl leading-none text-brand" style={{ animationDelay: '250ms' }}>
						Welcome back<span className="text-accent">.</span>
					</h2>
					<p className="rise mt-4 text-slate-600" style={{ animationDelay: '350ms' }}>
						Sign in to manage your website.
					</p>
					<div className="rise mt-10" style={{ animationDelay: '450ms' }}>
						<Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
							<LoginGate />
						</Suspense>
					</div>
					{/* The website has its own stylesheet, so this must be a full page load. */}
					{/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
					<a href="/" className="rise mt-10 inline-block text-sm text-slate-500 underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent" style={{ animationDelay: '550ms' }}>
						← Back to the website
					</a>
				</div>
			</section>
		</main>
	);
}
