'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links: [string, string][] = [
	['/', 'Home'],
	['/about', 'About Us'],
	['/services', 'Services'],
	['/blog', 'Blog'],
	['/contact', 'Contact'],
];

// Same rule React Router's NavLink used: "/" matches exactly, others match as a path prefix.
function isActive(pathname: string, to: string) {
	return to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`);
}

export default function NavigationTop() {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	const linkProps = (to: string) => {
		const active = isActive(pathname, to);
		return {
			className: active ? 'active' : undefined,
			'aria-current': active ? ('page' as const) : undefined,
			onClick: () => setOpen(false),
		};
	};

	return (
		<header className="fwc-nav">
			<Link href="/" className="fwc-logo">
				<img src="/img/logo.png" alt="Florence Walters Consulting" />
			</Link>
			<button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
				☰
			</button>
			<nav className={open ? 'open' : ''}>
				{links.map(([to, label]) => (
					<Link key={to} href={to} {...linkProps(to)}>
						{label}
					</Link>
				))}
				<Link
					href="/contact"
					{...linkProps('/contact')}
					className={`${isActive(pathname, '/contact') ? 'active ' : ''}nav-consult`}>
					Book Consultation <span>→</span>
				</Link>
			</nav>
		</header>
	);
}
