'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon } from '@/components/ui/SocialIcons';
import { SiteLink } from '@/components/ui/SiteLink';
import { cn } from '@/lib/cn';
import { assessmentHref, company, serviceSlugFromPath, socials } from '@/lib/site';
import { ServicesMenu } from './MegaMenus';
import { mainNav } from './nav-data';

const socialIcons = { LinkedIn: LinkedInIcon, Instagram: InstagramIcon, Facebook: FacebookIcon, X: XIcon } as const;

const item = 'flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2.5 text-[0.9rem] font-medium transition-colors hover:bg-mist hover:text-accent-deep';

/**
 * A light header (white glass) so the page keeps its white-and-lilac feel. The Services mega-menu opens on hover
 * (with a short grace period) or click and closes on Escape. The slim top bar folds away once the page scrolls.
 */
export function Header() {
	const pathname = usePathname();
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);
	const [menu, setMenu] = useState(false);
	const timer = useRef<number | undefined>(undefined);
	const root = useRef<HTMLElement>(null);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 40);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	const show = () => {
		window.clearTimeout(timer.current);
		setMenu(true);
	};
	const keepOpen = () => window.clearTimeout(timer.current);
	const scheduleClose = () => {
		window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => setMenu(false), 180);
	};
	const closeNow = () => {
		window.clearTimeout(timer.current);
		setMenu(false);
	};

	// On a service page the assessment buttons carry that service, so the form does not ask for it again.
	const assess = assessmentHref(serviceSlugFromPath(pathname));

	return (
		<header
			ref={root}
			className="sticky top-0 z-50"
			onMouseEnter={keepOpen}
			onMouseLeave={scheduleClose}
			onKeyDown={(e) => e.key === 'Escape' && closeNow()}
			onBlur={(e) => {
				if (!root.current?.contains(e.relatedTarget as Node | null)) closeNow();
			}}>
			<div className={cn('hidden bg-mist text-[0.8125rem] text-ink-soft transition-all duration-300 ease-out-expo lg:block', scrolled ? 'h-0 overflow-hidden opacity-0' : 'h-9 opacity-100')}>
				<div className="page-container flex h-9 items-center justify-between">
					<p>
						Lagos, Nigeria · <a className="hover:text-accent-deep" href={`mailto:${company.email}`}>{company.email}</a> · <a className="hover:text-accent-deep" href={`tel:${company.phone.replace(/\s/g, '')}`}>{company.phone}</a>
					</p>
					<ul className="flex items-center gap-1">
						{socials.map(({ label, href }) => {
							const Icon = socialIcons[label];
							return (
								<li key={label}>
									<a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-7 place-items-center rounded-full text-ink-soft transition-colors hover:bg-white hover:text-accent-deep">
										<Icon className="size-4" />
									</a>
								</li>
							);
						})}
					</ul>
				</div>
			</div>

			<div className={cn('relative border-b bg-white/95 text-ink backdrop-blur-xl transition-shadow duration-300', scrolled || menu ? 'border-line shadow-[0_8px_24px_-18px_rgb(31_42_68/0.35)]' : 'border-line/70')}>
				<nav aria-label="Main" className="page-container flex h-[4.5rem] items-center justify-between gap-4">
					<SiteLink href="/" aria-label="Florence Walters Consulting, home" className="block shrink-0">
						<img src="/brand/logo.svg" alt="Florence Walters Consulting" className="h-14 w-auto" />
					</SiteLink>

					<ul className="hidden items-center gap-0.5 lg:flex">
						<li>
							<button type="button" aria-expanded={menu} aria-controls="menu-services" onMouseEnter={show} onClick={() => (menu ? closeNow() : show())} className={cn(item, menu && 'bg-mist text-accent-deep')}>
								Services
								<ChevronDown className={cn('size-4 transition-transform duration-300', menu && 'rotate-180')} />
							</button>
						</li>
						{mainNav.map((n) => (
							<li key={n.label}><SiteLink href={n.href} onMouseEnter={closeNow} className={item}>{n.label}</SiteLink></li>
						))}
					</ul>

					<div className="hidden items-center gap-2 lg:flex" onMouseEnter={closeNow}>
						<Button href={company.discoveryCall} arrow={false} variant="outline" className="hidden whitespace-nowrap xl:inline-flex">Book a free 15-min call</Button>
						<Button href={assess} className="whitespace-nowrap">Take the free assessment</Button>
					</div>

					<Dialog.Root open={open} onOpenChange={setOpen}>
						<Dialog.Trigger aria-label="Open menu" className="grid size-11 place-items-center rounded-full border border-ink/25 text-ink transition-colors lg:hidden">
							<Menu className="size-5" />
						</Dialog.Trigger>
						<Dialog.Portal>
							<Dialog.Overlay className="fixed inset-0 z-[60] bg-ink-deep/50 backdrop-blur-sm data-[state=open]:animate-[fade-in_300ms_ease-out]" />
							<Dialog.Content className="fixed inset-y-0 right-0 z-[70] flex w-[min(24rem,100vw)] flex-col overflow-y-auto bg-white p-6 text-ink data-[state=open]:animate-[sheet-in_350ms_var(--ease-out-expo)]" aria-describedby={undefined}>
								<div className="flex items-center justify-between">
									<Dialog.Title className="text-sm tracking-widest text-ink-mute uppercase">Menu</Dialog.Title>
									<Dialog.Close aria-label="Close menu" className="grid size-11 place-items-center rounded-full border border-ink/25"><X className="size-5" /></Dialog.Close>
								</div>
								<ul className="mt-6 grid text-2xl font-bold">
									{[['Services', '/services'], ...mainNav.map((n) => [n.label, n.href])].map(([label, href]) => (
										<li key={label}>
											<SiteLink href={href} onClick={() => setOpen(false)} className="block border-b border-line py-3.5">{label}</SiteLink>
										</li>
									))}
								</ul>
								<div className="mt-auto grid gap-3 pt-8">
									<Button href={assess} size="lg">Take the free assessment</Button>
									<Button href={company.discoveryCall} variant="outline" arrow={false} size="lg">Book a free 15-min call</Button>
								</div>
							</Dialog.Content>
						</Dialog.Portal>
					</Dialog.Root>
				</nav>

				{menu && (
					<div id="menu-services" className="absolute inset-x-0 top-full animate-[menu-in_250ms_var(--ease-out-expo)]">
						<ServicesMenu onNavigate={closeNow} />
					</div>
				)}
			</div>
		</header>
	);
}
