'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

/** Shown when a page fails to render. The visitor sees a calm message, never the error itself. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error(error);
	}, [error]);
	return (
		<section className="grid min-h-[60svh] place-items-center bg-mist px-6 py-20 text-center">
			<div className="max-w-xl">
				<p className="label-dot text-sm font-semibold tracking-[0.16em] text-accent-deep uppercase">Something went wrong</p>
				<h1 className="mt-5 text-display text-ink">That didn&apos;t <span className="text-accent-deep">work.</span></h1>
				<p className="mx-auto mt-6 max-w-md text-lead text-ink-soft">We hit a problem loading this page. Please try again. If it keeps happening, let us know.</p>
				<div className="mt-9 flex flex-wrap justify-center gap-3">
					<Button onClick={reset} size="lg">Try again</Button>
					<Button href="/contact" variant="outline" size="lg" arrow={false}>Contact us</Button>
				</div>
			</div>
		</section>
	);
}
