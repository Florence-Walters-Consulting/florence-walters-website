import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Registers the design system's custom font sizes (see styles/fwc.css). Without this,
// tailwind-merge reads `text-heading` as a colour and drops it next to `text-ink`.
const twMerge = extendTailwindMerge({
	extend: { classGroups: { 'font-size': [{ text: ['display', 'title', 'heading', 'statement', 'lead'] }] } },
});

/** Joins class names and resolves conflicting Tailwind utilities (last one wins). */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
