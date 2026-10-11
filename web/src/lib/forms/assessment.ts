import { z } from 'zod';
import { emailField, field, firstMessage, textLength } from './text';

const STAGES = ['Idea / pre-launch', 'Newly registered (under 12 months)', 'Operating, 1–5 years', 'Established, 5+ years', 'NGO / non-profit', 'Foreign entity entering Nigeria'];
const SECTORS = ['Fintech & payments', 'Oil, gas & energy', 'NGO / foundation', 'Education', 'Healthcare & pharma', 'Construction & contracting', 'Professional services', 'Manufacturing', 'Technology', 'Other'];
const BUDGETS = ['Below ₦250,000', '₦250,000–₦1m', '₦1m–₦5m', 'Above ₦5m'];
const TIMELINES = ['Immediately', 'Within 30 days', 'Within 90 days', 'Exploring options'];

export const branchLabels = {
	formation: 'Business Formation & Corporate Services',
	licensing: 'Regulatory Licensing & Compliance',
	contracts: 'Contracts, IP & Governance',
	marketing: 'Marketing',
	advisory: 'Business Advisory & Growth',
	unsure: 'Not sure / diagnostic conversation',
} as const;
type Branch = keyof typeof branchLabels;

/** Label shown in the email for each optional detail (order preserved from PHP). */
export const assessmentDetailLabels = {
	turnover: 'Turnover band',
	employees: 'Employee count',
	years: 'Years trading',
	formationDriver: 'Formation driver',
	formationCurrent: 'Current structure',
	foreignPartner: 'Foreign shareholder/partner',
	cofounders: 'Co-founders/partners',
	licensingState: 'Licensing position',
	regulatorAction: 'Regulatory action',
	licensingDuration: 'Time unresolved',
	customerData: 'Stores customer data',
	marketingNeed: 'Marketing need',
	socialPresence: 'Social media presence',
	growthGoal: 'Growth goal',
	financials: 'Financials/projections',
} as const;


export const assessmentSchema = z
	.object({
		firstname: field(100, { required: true }),
		lastname: field(100, { required: true }),
		email: field(254, { required: true }),
		phone: field(50, { required: true }),
		company: field(150),
		stage: field(100, { required: true }),
		sector: field(100, { required: true }),
		budget: field(100, { required: true }),
		timeline: field(100, { required: true }),
		mainProblem: field(3000, { required: true }),
		captchaToken: field(4096, { required: true }),
		branches: z.unknown(),
		contractsConcerns: z.unknown().optional(),
		turnover: field(500),
		employees: field(500),
		years: field(500),
		formationDriver: field(500),
		formationCurrent: field(500),
		foreignPartner: field(500),
		cofounders: field(500),
		licensingState: field(500),
		regulatorAction: field(500),
		licensingDuration: field(500),
		customerData: field(500),
		marketingNeed: field(500),
		socialPresence: field(500),
		growthGoal: field(500),
		financials: field(500),
	})
	.superRefine((d, ctx) => {
		const fail = (message: string) => ctx.addIssue({ code: 'custom', message });
		if (!emailField.safeParse(d.email).success) return fail('Please enter a valid email address.');
		if (!STAGES.includes(d.stage) || !SECTORS.includes(d.sector) || !BUDGETS.includes(d.budget) || !TIMELINES.includes(d.timeline))
			return fail('Please check your assessment selections.');
		const allowed = Object.keys(branchLabels);
		if (!Array.isArray(d.branches) || d.branches.length < 1 || d.branches.length > allowed.length)
			return fail('Please select at least one business challenge.');
		if (d.branches.some((b) => typeof b !== 'string' || !allowed.includes(b)))
			return fail('Please check your business challenge selections.');
		const concerns = d.contractsConcerns ?? [];
		if (!Array.isArray(concerns) || concerns.length > 20) return fail('Please check your contract concern selections.');
		if (concerns.some((c) => typeof c === 'object' && c !== null)) return fail('Please check your contract concern selections.');
		const cleaned = concerns.map((c) => String(c ?? '').trim());
		if (cleaned.some((c) => c === '' || textLength(c) > 300)) return fail('Please check your contract concern selections.');
	})
	.transform((d) => ({
		...d,
		branches: d.branches as Branch[],
		contractsConcerns: ((d.contractsConcerns ?? []) as unknown[]).map((c) => String(c ?? '').trim()),
	}));

export { firstMessage };
export type AssessmentInput = z.infer<typeof assessmentSchema>;
