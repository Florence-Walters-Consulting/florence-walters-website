import type { Metadata } from 'next';

// Favicons come from the file conventions in this folder (favicon.ico, icon.png, apple-icon.png),
// generated from the company logo mark.
// Set SITE_NOINDEX=true on a review/dev deployment so search engines never list it.
export const metadata: Metadata = process.env.SITE_NOINDEX === 'true' ? { robots: { index: false, follow: false } } : {};

// Minimal root layout shared by the public site and the admin. Each area adds its own styles and
// fonts in its nested layout, so neither receives the other's CSS.
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
