'use client';

import * as m from 'motion/react-m';
import { cn } from '@/lib/cn';

/** Fades and lifts its children into view once (0.4 s, a short distance), the first time they scroll on screen. */
export function Reveal({
	children,
	delay = 0,
	y = 16,
	className,
	as = 'div',
}: {
	children: React.ReactNode;
	delay?: number;
	y?: number;
	className?: string;
	as?: 'div' | 'li' | 'section' | 'article';
}) {
	const Tag = m[as];
	return (
		<Tag
			className={cn(className)}
			initial={{ opacity: 0, y }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '0px 0px -10% 0px' }}
			transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}>
			{children}
		</Tag>
	);
}
