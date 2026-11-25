/**
 * Every photo and video the public pages use, in one place, so a picture can be swapped without touching
 * the components. Files live in public/media (WebP images, WebM video). The brief (FWC Website Content Pack)
 * asks for Nigerian founders at work, hands holding documents, and 3D icons: no scales, gavels or courtrooms.
 * Slots marked "placeholder" hold the best existing photo until the new footage is delivered.
 */
export const media = {
	heroStructure: { poster: '/media/video/hero-laptop-work.webp', video: '/media/video/hero-laptop-work.webm' }, // placeholder: hands at a laptop. Wanted: founder / signing / stamp
	heroStrategy: { poster: '/media/images/lagos-office-building.webp' }, // placeholder: team planning, Lagos street or market
	heroExcellence: { poster: '/media/images/team-high-five.webp' }, // placeholder: hands receiving a finished document pack
	about: '/media/images/lagos-office-building.webp',
	aboutStory: '/media/images/team-high-five.webp',
	laptop: '/media/images/laptop-work.webp',
	lagos: '/media/images/lagos-office-building.webp',
} as const;
