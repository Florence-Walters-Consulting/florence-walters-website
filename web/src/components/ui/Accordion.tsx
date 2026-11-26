'use client';

import * as RadixAccordion from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

export type AccordionItem = { id: string; title: string; content: React.ReactNode };

/** Accessible accordion (Radix) with the round plus/minus marker. One item open at a time. */
export function Accordion({ items, className, defaultOpen }: { items: AccordionItem[]; className?: string; defaultOpen?: string }) {
	return (
		<RadixAccordion.Root type="single" collapsible defaultValue={defaultOpen} className={cn('border-t border-line', className)}>
			{items.map((item) => (
				<RadixAccordion.Item key={item.id} value={item.id} className="border-b border-line">
					<RadixAccordion.Header className="font-sans">
						<RadixAccordion.Trigger className="group flex w-full items-center justify-between gap-6 py-5 text-left text-lg text-ink transition-colors hover:text-accent-deep">
							{item.title}
							<span className="grid size-8 shrink-0 place-items-center rounded-full border border-ink/30 transition-colors group-hover:border-accent group-data-[state=open]:border-accent group-data-[state=open]:bg-accent group-data-[state=open]:text-white">
								<Plus className="size-4 transition-transform duration-300 ease-out-expo group-data-[state=open]:rotate-45" strokeWidth={1.75} />
							</span>
						</RadixAccordion.Trigger>
					</RadixAccordion.Header>
					<RadixAccordion.Content className="overflow-hidden data-[state=closed]:animate-[acc-up_300ms_var(--ease-soft)] data-[state=open]:animate-[acc-down_400ms_var(--ease-out-expo)]">
						<div className="max-w-2xl pb-6 text-ink-soft">{item.content}</div>
					</RadixAccordion.Content>
				</RadixAccordion.Item>
			))}
		</RadixAccordion.Root>
	);
}
