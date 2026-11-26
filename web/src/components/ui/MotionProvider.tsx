'use client';

import { LazyMotion, MotionConfig } from 'motion/react';

// The animation features load after first paint so they never block rendering.
const loadFeatures = () => import('@/lib/motion-features').then((m) => m.default);

/** Wrap the app once. `reducedMotion="user"` turns movement off for visitors who ask for less motion. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
	return (
		<MotionConfig reducedMotion="user">
			<LazyMotion features={loadFeatures} strict>
				{children}
			</LazyMotion>
		</MotionConfig>
	);
}
