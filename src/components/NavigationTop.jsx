import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
export default function NavigationTop() {
	const [open, setOpen] = useState(false);
	return (
		<header className="fwc-nav">
			<Link to="/" className="fwc-logo">
				<img src="/img/logo.png" alt="Florence Walters Consulting" />
			</Link>
			<button
				className="nav-toggle"
				onClick={() => setOpen(!open)}
				aria-label="Toggle navigation">
				☰
			</button>
			<nav className={open ? 'open' : ''}>
				{[
					['/', 'Home'],
					['/about', 'About Us'],
					['/services', 'Services'],
					['/blog', 'Blog'],
					['/contact', 'Contact'],
				].map((x) => (
					<NavLink key={x[0]} onClick={() => setOpen(false)} to={x[0]}>
						{x[1]}
					</NavLink>
				))}
				<NavLink className="nav-consult" to="/contact">
					Book Consultation <span>→</span>
				</NavLink>
			</nav>
		</header>
	);
}
