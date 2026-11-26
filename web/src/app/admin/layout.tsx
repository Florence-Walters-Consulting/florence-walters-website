import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './admin.css';

// Self-hosted at build time by next/font (same typefaces as the public site).
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-cormorant', display: 'swap' });

export const metadata: Metadata = {
	title: { template: '%s · Admin', default: 'Admin' },
	robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
	return <div className={`${dmSans.variable} ${cormorant.variable} min-h-screen bg-canvas font-sans text-slate-900 antialiased`}>{children}</div>;
}
