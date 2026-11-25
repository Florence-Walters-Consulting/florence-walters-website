import { company } from '@/lib/site';

/** Floating WhatsApp chat button, on every page. */
export function WhatsAppButton() {
	return (
		<a href={company.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" className="fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-lift transition-transform duration-300 ease-out-expo hover:scale-105">
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-7">
				<path d="M12.04 2a9.9 9.9 0 00-8.5 14.9L2 22l5.25-1.5A9.9 9.9 0 1012.04 2zm0 1.8a8.1 8.1 0 11-4.2 15l-.3-.18-3.12.9.93-3.04-.2-.31a8.1 8.1 0 016.9-12.37zM8.6 7.6c-.2 0-.5.07-.75.35-.25.27-.97.95-.97 2.3s1 2.7 1.13 2.88c.14.18 1.95 3.05 4.78 4.15 2.36.93 2.84.74 3.35.7.5-.05 1.65-.68 1.88-1.33.23-.65.23-1.2.16-1.33-.07-.12-.25-.2-.52-.34-.28-.13-1.65-.8-1.9-.9-.26-.1-.44-.14-.63.14-.18.27-.72.9-.88 1.08-.16.18-.32.2-.6.07-.27-.14-1.17-.43-2.22-1.37-.82-.73-1.37-1.63-1.53-1.9-.16-.28-.02-.43.12-.56.12-.12.28-.32.41-.48.14-.16.18-.27.28-.46.09-.18.04-.34-.02-.48-.07-.14-.62-1.5-.86-2.05-.22-.52-.45-.45-.62-.46z" />
			</svg>
		</a>
	);
}
