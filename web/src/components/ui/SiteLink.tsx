import Link from 'next/link';

type Props = Omit<React.ComponentPropsWithoutRef<'a'>, 'href'> & { href: string };

/**
 * Link used across the site. Internal pages navigate client-side; external URLs, mail and phone links
 * are plain anchors (external ones open in a new tab). The admin has its own styles, so links into it
 * always do a full page load.
 */
export function SiteLink({ href, children, ...rest }: Props) {
	const external = /^https?:/.test(href);
	if (external || /^(mailto:|tel:)/.test(href) || href.startsWith('/admin')) {
		return (
			<a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
				{children}
			</a>
		);
	}
	return (
		<Link href={href} {...rest}>
			{children}
		</Link>
	);
}
