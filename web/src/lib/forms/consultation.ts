import { z } from 'zod';
import { emailField, field, firstMessage, textLength } from './text';

export const consultationTypeLabels = {
	formation: 'Business Formation & Structuring Advice',
	strategy: 'Business & Strategy Consultation',
	legal: 'Legal Advice',
	tax: 'Tax Planning & Structuring Advisory',
	marketing: 'Marketing Consultation',
} as const;

const CONTACT_METHODS = ['Phone call', 'WhatsApp', 'Email only'];

/** Label shown in the email for each optional follow-up answer (order preserved from PHP). */
export const consultationQuestionLabels = {
	registrationNext: 'Registration after advice',
	formationTimeline: 'Timeline',
	strategyFrequency: 'Engagement frequency',
	strategyTimeline: 'Timeline',
	legalDeadline: 'Deadline attached',
	legalFrequency: 'Engagement frequency',
	taxComplexity: 'Structure complexity',
	taxTimeline: 'Timeline',
	marketingStartingPoint: 'Starting point',
} as const;


export const consultationSchema = z
	.object({
		type: field(30, { required: true }),
		firstname: field(150, { required: true }),
		company: field(150, { required: true }),
		email: field(254, { required: true }),
		phone: field(50, { required: true }),
		contactMethod: field(30, { required: true }),
		contactTime: field(150, { required: true }),
		otherTopic: field(1000),
		deadlineDetails: field(1000),
		additionalNotes: field(3000),
		captchaToken: field(4096, { required: true }),
		topics: z.unknown(),
		registrationNext: field(500),
		formationTimeline: field(500),
		strategyFrequency: field(500),
		strategyTimeline: field(500),
		legalDeadline: field(500),
		legalFrequency: field(500),
		taxComplexity: field(500),
		taxTimeline: field(500),
		marketingStartingPoint: field(500),
	})
	.superRefine((d, ctx) => {
		const fail = (message: string) => ctx.addIssue({ code: 'custom', message });
		if (!(d.type in consultationTypeLabels) || !CONTACT_METHODS.includes(d.contactMethod))
			return fail('Please check your consultation selections.');
		if (!emailField.safeParse(d.email).success) return fail('Please enter a valid email address.');
		if (!Array.isArray(d.topics) || d.topics.length < 1 || d.topics.length > 20)
			return fail('Please select at least one consultation topic.');
		if (d.topics.some((t) => typeof t === 'object' && t !== null)) return fail('Please check your consultation topics.');
		const topics = d.topics.map((t) => String(t ?? '').trim());
		if (topics.some((t) => t === '' || textLength(t) > 250)) return fail('Please check your consultation topics.');
	})
	.transform((d) => ({
		...d,
		type: d.type as keyof typeof consultationTypeLabels,
		topics: (d.topics as unknown[]).map((t) => String(t ?? '').trim()),
	}));

export { firstMessage };
export type ConsultationInput = z.infer<typeof consultationSchema>;
