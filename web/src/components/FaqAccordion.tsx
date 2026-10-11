'use client';

import { useState } from 'react';

type Faq = { id: number; question: string; body: string };

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
	const [open, setOpen] = useState(0);

	return (
		<>
			{faqs.map((faq, i) => (
				<article className={open === i ? 'open' : ''} key={faq.id}>
					<button onClick={() => setOpen(open === i ? -1 : i)}>
						<span>{faq.question}</span>
						<b>{open === i ? '−' : '+'}</b>
					</button>
					{/* Answers are admin-authored HTML, as in the legacy site. */}
					{open === i && <div className="faq-answer" dangerouslySetInnerHTML={{ __html: faq.body }} />}
				</article>
			))}
		</>
	);
}
