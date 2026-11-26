// Content for the paid-consultation form (types, topics and follow-up questions).
// Keys of `Question.name` and `type` match the API schema in consultation.ts.

export type ConsultationType = 'formation' | 'strategy' | 'legal' | 'tax' | 'marketing';
export const consultationTypeKeys: ConsultationType[] = ['formation', 'strategy', 'legal', 'tax', 'marketing'];

export type TextKey =
	| 'otherTopic' | 'deadlineDetails' | 'contactMethod' | 'firstname' | 'company' | 'email' | 'phone' | 'contactTime' | 'additionalNotes'
	| 'registrationNext' | 'formationTimeline' | 'strategyFrequency' | 'strategyTimeline' | 'legalDeadline' | 'legalFrequency'
	| 'taxComplexity' | 'taxTimeline' | 'marketingStartingPoint';

export type Question = { name: TextKey; label: string; options: string[] };

export const consultationTypes: { value: ConsultationType; tag: string; label: string; description: string; intro: string; topics: string[]; questions: Question[] }[] = [
	{
		value: 'formation', tag: 'Structure', label: 'Business Formation & Structuring Advice',
		description: 'Advice on choosing or changing the right entity structure before registration.',
		intro: "Not sure which entity structure actually fits? We'll work through the right choice before you commit. This is advice, not the registration itself.",
		topics: ['Which entity type fits my business: Ltd, LLP, LP, Plc, or Ltd/Gte', 'Structuring for multiple founders or investors', 'Converting from one structure to another', 'Structuring for a foreign shareholder or foreign entity entering Nigeria', 'NGO / Incorporated Trustees vs. Company Limited by Guarantee', 'Something else'],
		questions: [
			{ name: 'registrationNext', label: 'Once decided, do you want us to handle the registration too?', options: ["Just the advice for now. I'll decide separately", 'Advice now, likely to move straight into registration after'] },
			{ name: 'formationTimeline', label: 'How soon do you need this?', options: ['This week', 'Within 2 weeks', 'Flexible'] },
		],
	},
	{
		value: 'strategy', tag: 'Strategy', label: 'Business & Strategy Consultation',
		description: 'A focused session around a specific decision, plan, or growth question.',
		intro: 'A session built around a specific decision, plan, or growth question, not a general business chat.',
		topics: ['Business plan or financial projections', 'Investor readiness: pitch deck, data room, cap table', 'Feasibility study for a new venture or project', 'Market entry strategy', 'Operational review and process improvement', 'Organisational restructuring or change management', 'Bid or tender preparation', 'Grant or donor proposal development (NGOs)', 'Something else'],
		questions: [
			{ name: 'strategyFrequency', label: 'Is this a one-off question, or an ongoing need?', options: ['One-off, a single session', "Ongoing. I'd consider a retainer if it's the right fit"] },
			{ name: 'strategyTimeline', label: 'How soon do you need this?', options: ['This week', 'Within 2 weeks', 'Flexible'] },
		],
	},
	{
		value: 'legal', tag: 'Legal', label: 'Legal Advice',
		description: 'Legal advice, provided through our partner lawyers.',
		intro: 'Legal advice is provided through our partner lawyers. Court cases are outside our scope.',
		topics: ['A contract I need reviewed or drafted', 'Employment contracts or a staff handbook', 'Trademark, copyright, patent, or industrial design protection', 'NDPA / data protection compliance', 'AML/CFT compliance', 'Corporate governance or board structure', "Shareholders' or founders' agreement", 'Risk register or business continuity planning', 'Due diligence for an investment, acquisition, or partnership', 'A dispute or potential dispute', 'Something else'],
		questions: [
			{ name: 'legalDeadline', label: 'Is there a deadline attached to this?', options: ['Yes', 'No, I want proper advice before proceeding'] },
			{ name: 'legalFrequency', label: 'Single session, or ongoing support?', options: ['Single session', "Ongoing. I'd consider the monthly retainer"] },
		],
	},
	{
		value: 'tax', tag: 'Tax', label: 'Tax Planning & Structuring Advisory',
		description: 'Strategic advice for a specific tax structure, transaction, or decision.',
		intro: 'Strategic advisory, not routine monthly filing. This is for a specific structuring question or decision.',
		topics: ['Restructuring the business for tax efficiency', 'Planning for a sale, merger, or investment', 'Cross-border or international structuring', 'Reducing ongoing tax exposure', 'Preparing for a tax audit or regulatory review', 'Transfer pricing', 'Something else'],
		questions: [
			{ name: 'taxComplexity', label: 'Roughly how complex is the structure involved?', options: ['Single entity', 'Multiple entities / subsidiaries', 'Cross-border element involved'] },
			{ name: 'taxTimeline', label: 'What is the timeline?', options: ["Immediate: there's a transaction or deadline in motion", 'Planning ahead, no fixed date yet'] },
		],
	},
	{
		value: 'marketing', tag: 'Marketing', label: 'Marketing Consultation',
		description: 'Advice and written direction on brand, website, social, or go-to-market strategy.',
		intro: "Advice and direction only: a session and written recommendations. If you need the work delivered, that's our separate Marketing service.",
		topics: ['Brand strategy and positioning', 'Social media strategy: direction, not execution', 'Website strategy and structure', 'Reviewing an existing marketing campaign or approach', 'A go-to-market plan for a new product or service', 'Something else'],
		questions: [{ name: 'marketingStartingPoint', label: 'Do you have existing marketing activity to review?', options: ['Existing. I want a review', 'Starting fresh. I want direction before I begin'] }],
	},
];
