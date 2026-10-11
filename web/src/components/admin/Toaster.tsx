'use client';

import { useEffect, useState } from 'react';
import type { ToastDetail } from './toast';

type Item = ToastDetail & { id: number };

export default function Toaster() {
	const [items, setItems] = useState<Item[]>([]);

	useEffect(() => {
		let next = 0;
		const onToast = (event: Event) => {
			const id = next++;
			setItems((current) => [...current, { id, ...(event as CustomEvent<ToastDetail>).detail }]);
			setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), 4500);
		};
		window.addEventListener('admin:toast', onToast);
		return () => window.removeEventListener('admin:toast', onToast);
	}, []);

	return (
		<div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-72 flex-col gap-2">
			{items.map((item) => (
				<p
					key={item.id}
					role={item.kind === 'error' ? 'alert' : 'status'}
					className={`pointer-events-auto rounded-md px-4 py-3 text-sm shadow-lg ${
						item.kind === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
					}`}>
					{item.message}
				</p>
			))}
		</div>
	);
}
