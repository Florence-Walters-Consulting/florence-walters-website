import type { LucideIcon } from 'lucide-react';
import { DocMock } from './DocMock';
import { Icon3D } from './Icon3D';

/**
 * The hero artwork used on service pages and the page banners: one large 3D icon, two document mock-ups fanned behind
 * it and two small tiles. All of it is made in CSS, and can be replaced with the designer's own 3D images later.
 */
export function Scene3D({ icon, badge, docs, tiles }: { icon: LucideIcon; badge?: LucideIcon; docs: [string, string]; tiles?: [LucideIcon, LucideIcon] }) {
	return (
		<div className="relative mx-auto aspect-[6/5] w-full max-w-lg" aria-hidden>
			<div className="absolute inset-[8%] rounded-full bg-accent/20 blur-3xl" />
			<DocMock title={docs[0]} kind="Document" rotate={-8} className="absolute top-[6%] left-[2%] w-[44%]" />
			<DocMock title={docs[1]} kind="Document" lines={5} rotate={7} className="absolute right-[2%] bottom-[4%] w-[46%]" />
			<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[56%]"><Icon3D icon={icon} badge={badge} size={150} className="float-always" /></span>
			{tiles && (
				<>
					<span className="absolute top-[4%] right-[10%]"><Icon3D icon={tiles[0]} size={56} tone="white" /></span>
					<span className="absolute bottom-[10%] left-[8%]"><Icon3D icon={tiles[1]} size={52} tone="navy" /></span>
				</>
			)}
		</div>
	);
}
