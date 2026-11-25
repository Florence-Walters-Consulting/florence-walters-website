import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DM_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { WhatsAppButton } from '@/components/site/WhatsAppButton';
import { BodyClass } from '@/components/ui/BodyClass';
import { MotionProvider } from '@/components/ui/MotionProvider';
import { SmoothScroll } from '@/components/ui/SmoothScroll';
import '@/styles/fwc.css';

// Self-hosted at build time by next/font: no request to Google from the visitor's browser.
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });
// Satoshi (Fontshare, free for commercial use) is the headline face, from the brand guidelines.
const satoshi = localFont({
	src: [
		{ path: '../../fonts/Satoshi-400.woff2', weight: '400' },
		{ path: '../../fonts/Satoshi-500.woff2', weight: '500' },
		{ path: '../../fonts/Satoshi-700.woff2', weight: '700' },
		{ path: '../../fonts/Satoshi-900.woff2', weight: '900' },
	],
	variable: '--font-satoshi',
	display: 'swap',
});

export const metadata: Metadata = {
	title: {
		template: '%s - Florence Walters Consulting',
		default: 'Florence Walters Consulting',
	},
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className={`${dmSans.variable} ${satoshi.variable} font-sans`}>
			<BodyClass className={`${dmSans.variable} ${satoshi.variable} font-sans`} />
			<MotionProvider>
				<SmoothScroll />
				{/* The header reads the current path; dynamic routes (draft previews) need it inside Suspense. */}
				<Suspense fallback={null}>
					<Header />
				</Suspense>
				<main>{children}</main>
				<Footer />
				<WhatsAppButton />
				<Toaster position="bottom-center" />
			</MotionProvider>
		</div>
	);
}
