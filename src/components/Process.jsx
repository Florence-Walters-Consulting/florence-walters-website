function Process() {
	const steps = [
		['01', 'Take the Business Assessment', "Free, self-serve, a few minutes. Tells us what you're actually facing."],
		['02', 'Free Discovery Call (15 minutes)', 'Booked directly through our scheduler. This call is for clarity only — we ask questions, you talk. No solutions are given on this call; its only job is understanding the problem properly.'],
		['03', 'Diagnostic Report Quoted', 'We confirm the fee before any work begins — nothing proceeds without your go-ahead.'],
		['04', 'Diagnostic Delivered', 'A full written report: the problem, the solutions, and the specific services — with pricing — needed to address it, including any third-party specialists where relevant.'],
		['05', 'Engagement Begins', "Once you're ready to proceed, everything is formalised in a signed agreement before work starts."],
	];

	return (
		<section className="fwc-section process">
			<div className="process-intro">
				<span className="eyebrow eyebrow-with-line">HOW WE WORK</span>
				<h2>How We Work</h2>
			</div>
			<div className="process-grid">
				{steps.map(([number, title, description]) => (
					<article key={number}>
						<strong>{number}</strong>
						<h3>{title}</h3>
						<p>{description}</p>
					</article>
				))}
			</div>
		</section>
	);
}

export default Process;
