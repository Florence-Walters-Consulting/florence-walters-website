export default function ServiceIcon({ type }: { type: 'briefcase' | 'shield' | 'trend' }) {
	const props = {
		viewBox: '0 0 24 24',
		fill: 'none',
		stroke: 'currentColor',
		strokeWidth: 1.7,
		strokeLinecap: 'round' as const,
		strokeLinejoin: 'round' as const,
		'aria-hidden': true,
	};
	if (type === 'briefcase')
		return (
			<svg {...props}>
				<path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
				<rect x="3" y="7" width="18" height="13" rx="2" />
				<path d="M3 12.5c5.8 2 12.2 2 18 0M10 13h4" />
			</svg>
		);
	if (type === 'shield')
		return (
			<svg {...props}>
				<path d="M12 3 20 6v5.5c0 4.7-3.2 8-8 9.5-4.8-1.5-8-4.8-8-9.5V6l8-3Z" />
				<path d="m8.5 12 2.2 2.2 4.8-5" />
			</svg>
		);
	return (
		<svg {...props}>
			<path d="M4 19h16M5 16l5-5 3 3 6-7" />
			<path d="M14 7h5v5" />
		</svg>
	);
}
