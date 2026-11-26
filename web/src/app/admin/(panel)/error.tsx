'use client';

import { ui } from '@/components/admin/ui';

export default function PanelError({ reset }: { error: Error; reset: () => void }) {
	return (
		<div className={`${ui.card} p-6`} role="alert">
			<h1 className="text-lg font-semibold">Something went wrong</h1>
			<p className="mt-1 text-sm text-slate-600">The page could not be loaded. Your changes were not lost if you had already saved them.</p>
			<button onClick={reset} className={`${ui.btn} ${ui.btnPrimary} mt-4`}>
				Try again
			</button>
		</div>
	);
}
