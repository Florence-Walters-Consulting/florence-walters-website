import type { Metadata } from 'next';

export const metadata: Metadata = {
	icons: { icon: '/img/favicon.png' },
};

// Minimal root layout shared by the public site and the admin. Each area adds its own
// styles in its nested layout, so the admin never receives the public site's CSS.
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://api.fontshare.com" />
				<link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
				{/* Satoshi is distributed by Fontshare under the ITF Free Font License. */}
				<link
					rel="stylesheet"
					href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700&display=swap"
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
