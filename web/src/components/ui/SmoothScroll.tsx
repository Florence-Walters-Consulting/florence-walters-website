'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Inertial scrolling (the soft, weighted feel of premium sites). Mouse and trackpad only:
 * touch keeps native scrolling. Off entirely for reduced-motion visitors.
 */
export function SmoothScroll() {
	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const lenis = new Lenis({ lerp: 0.1, anchors: true });
		let frame = requestAnimationFrame(function raf(time) {
			lenis.raf(time);
			frame = requestAnimationFrame(raf);
		});
		return () => {
			cancelAnimationFrame(frame);
			lenis.destroy();
		};
	}, []);
	return null;
}
