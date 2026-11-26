import { cn } from '@/lib/cn';

type P = { className?: string };
const base = 'size-[1.125rem]';

export const LinkedInIcon = ({ className }: P) => (
	<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn(base, className)}>
		<path d="M6.94 8.5H3.56V20h3.38zM5.25 3a2 2 0 100 4 2 2 0 000-4zM20 20h-3.37v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.97V20H9.25V8.5h3.24v1.57h.05c.45-.85 1.55-1.75 3.19-1.75 3.41 0 4.04 2.25 4.04 5.17z" />
	</svg>
);
export const InstagramIcon = ({ className }: P) => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden className={cn(base, className)}>
		<rect x="3" y="3" width="18" height="18" rx="5" />
		<circle cx="12" cy="12" r="4" />
		<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
	</svg>
);
export const FacebookIcon = ({ className }: P) => (
	<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn(base, className)}>
		<path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.6V21z" />
	</svg>
);
export const XIcon = ({ className }: P) => (
	<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn(base, className)}>
		<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
	</svg>
);
