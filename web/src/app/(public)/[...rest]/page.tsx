import { notFound } from 'next/navigation';

// Catches every URL that matches no page and renders the branded 404 (app/(public)/not-found.tsx)
// inside the site layout, with a real 404 status.
export default function NoMatch() {
	notFound();
}
