'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

/**
 * Tilts its children a little toward the pointer (the 3D scene from Busola's hero). Touch and reduced-motion visitors get a still scene.
 */
export function TiltStage({ children, max = 10, className }: { children: React.ReactNode; max?: number; className?: string }) {
	const outer = useRef<HTMLDivElement>(null);
	const inner = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const host = outer.current;
		const el = inner.current;
		if (!host || !el) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(hover: hover)').matches) return;
		let frame = 0;
		const move = (e: PointerEvent) => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const r = host.getBoundingClientRect();
				const x = (e.clientX - r.left) / r.width - 0.5;
				const y = (e.clientY - r.top) / r.height - 0.5;
				el.style.transform = `rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max * 1.4).toFixed(2)}deg)`;
			});
		};
		const leave = () => {
			cancelAnimationFrame(frame);
			el.style.transform = '';
		};
		host.addEventListener('pointermove', move);
		host.addEventListener('pointerleave', leave);
		return () => {
			cancelAnimationFrame(frame);
			host.removeEventListener('pointermove', move);
			host.removeEventListener('pointerleave', leave);
		};
	}, [max]);

	return (
		<div ref={outer} className={cn('perspective-1000', className)}>
			<div ref={inner} className="preserve-3d transition-transform duration-500 ease-out-expo">{children}</div>
		</div>
	);
}
