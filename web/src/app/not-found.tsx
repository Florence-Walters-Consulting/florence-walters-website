import NotFoundContent from '@/components/NotFoundContent';
import SiteShell from '@/components/SiteShell';
import './site-styles';

// Unmatched URLs have no (site) layout around them, so this page carries the public chrome itself.
export default function NotFound() {
	return (
		<SiteShell>
			<NotFoundContent />
		</SiteShell>
	);
}
