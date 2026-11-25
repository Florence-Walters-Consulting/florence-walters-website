// Global 404 for URLs that match no route. It is deliberately self-contained (inline styles, no
// stylesheet imports): CSS imported here is attached to every route, which would load the legacy
// Bootstrap bundle on the new pages and the admin. Restyle it once the last legacy page is migrated.
export default function NotFound() {
	return (
		<main
			style={{
				minHeight: '100vh',
				display: 'grid',
				placeItems: 'center',
				padding: '2rem',
				background: '#161e33',
				color: '#fff',
				fontFamily: 'system-ui, sans-serif',
				textAlign: 'center',
			}}>
			<div>
				<p style={{ margin: 0, letterSpacing: '0.2em', fontSize: 13, opacity: 0.6 }}>404</p>
				<h1 style={{ margin: '12px 0', fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 40 }}>Page not found</h1>
				<p style={{ margin: '0 0 28px', opacity: 0.75 }}>The page you are looking for does not exist.</p>
				{/* Full page load on purpose: Home uses a different stylesheet from legacy pages. */}
				{/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
				<a href="/" style={{ color: '#161e33', background: '#fff', padding: '12px 24px', borderRadius: 999, textDecoration: 'none', fontWeight: 600 }}>
					Back to home
				</a>
			</div>
		</main>
	);
}
