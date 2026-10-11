import type { Metadata } from 'next';
import SiteShell from '@/components/SiteShell';
import '../site-styles';

export const metadata: Metadata = {
	title: {
		template: '%s - Florence Walters Consulting',
		default: 'Home - Florence Walters Consulting',
	},
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
	return <SiteShell>{children}</SiteShell>;
}
