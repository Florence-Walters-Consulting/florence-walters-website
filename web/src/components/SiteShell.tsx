import NavigationTop from './NavigationTop';
import Footer from './Footer';
import AosInit from './AosInit';

/** Public-site chrome: header, page content, footer. */
export default function SiteShell({ children }: { children: React.ReactNode }) {
	return (
		<>
			<AosInit />
			<main id="wrapper">
				<NavigationTop />
				{children}
				<Footer />
			</main>
		</>
	);
}
