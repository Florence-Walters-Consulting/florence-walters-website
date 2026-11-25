/**
 * Every photo and video the public pages use, in one place, so a picture can be swapped without touching
 * the components. Files live in public/media (WebP images, WebM video; scripts/optimize-media.sh converts new ones).
 * The brief (FWC Website Content Pack) asks for Nigerian founders at work, hands holding documents and 3D icons:
 * no scales, gavels or courtrooms.
 */
export const media = {
	heroStructure: { poster: '/media/video/hero-structure.webp', video: '/media/video/hero-structure.webm' }, // signing papers
	heroStrategy: { poster: '/media/video/hero-strategy.webp', video: '/media/video/hero-strategy.webm' }, // team with charts
	heroExcellence: { poster: '/media/video/hero-excellence.webp', video: '/media/video/hero-excellence.webm' }, // team at a table
	about: '/media/images/client-documents-laptop.webp',
	aboutStory: '/media/images/contract-review-hands.webp',
	lagos: '/media/images/lagos-office-building.webp',
} as const;
