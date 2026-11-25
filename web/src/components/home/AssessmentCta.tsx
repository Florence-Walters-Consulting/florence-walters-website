import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { FloatingShapes } from '@/components/ui/FloatingShapes';
import { Reveal } from '@/components/ui/Reveal';

/** The closing Electric Blue band. Pass a `serviceSlug`-aware `href` from a service page to skip the "which service?" question. */
export function AssessmentCta({
	title = 'Not sure what your business needs?',
	text = 'Take the free assessment, about 5 minutes.',
	href = '/business-assessment',
}: { title?: string; text?: string; href?: string } = {}) {
	return (
		<section id="assessment" className="relative isolate overflow-hidden bg-accent-btn text-white">
			<FloatingShapes />
			<Container className="relative py-16 sm:py-20">
				<Reveal className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
					<div className="max-w-2xl">
						<h2 className="text-title">{title}</h2>
						<p className="mt-4 text-lead text-white/85">{text}</p>
					</div>
					<Button href={href} size="lg" variant="light" className="bg-white text-ink hover:bg-mist [&>span:last-child]:bg-ink [&>span:last-child]:text-white">Start now</Button>
				</Reveal>
			</Container>
		</section>
	);
}
