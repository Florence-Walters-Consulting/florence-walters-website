import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Swal from 'sweetalert2';

const consultationTypes = [
	{ value: 'formation', label: 'Business Formation & Structuring Advice', description: 'Advice on choosing or changing the right entity structure before registration.' },
	{ value: 'strategy', label: 'Business & Strategy Consultation', description: 'A focused session around a specific decision, plan, or growth question.' },
	{ value: 'legal', label: 'Legal Advice', description: 'Professional legal advice delivered through our retained counsel.' },
	{ value: 'tax', label: 'Tax Planning & Structuring Advisory', description: 'Strategic advice for a specific tax structure, transaction, or decision.' },
	{ value: 'marketing', label: 'Marketing Consultation', description: 'Advice and written direction on brand, website, social, or go-to-market strategy.' },
];

const branchContent = {
	formation: {
		intro: "Not sure which entity structure actually fits? We'll work through the right choice before you commit. This is advice, not the registration itself.",
		topics: ['Which entity type fits my business — Ltd, LLP, LP, Plc, or Ltd/Gte', 'Structuring for multiple founders or investors', 'Converting from one structure to another', 'Structuring for a foreign shareholder or foreign entity entering Nigeria', 'NGO / Incorporated Trustees vs. Company Limited by Guarantee', 'Something else'],
		questions: [
			{ name: 'registrationNext', label: 'Once decided, do you want us to handle the registration too?', options: ["Just the advice for now — I'll decide separately", 'Advice now, likely to move straight into registration after'] },
			{ name: 'formationTimeline', label: 'How soon do you need this?', options: ['This week', 'Within 2 weeks', 'Flexible'] },
		],
	},
	strategy: {
		intro: 'A session built around a specific decision, plan, or growth question — not a general business chat.',
		topics: ['Business plan or financial projections', 'Investor readiness — pitch deck, data room, cap table', 'Feasibility study for a new venture or project', 'Market entry strategy', 'Operational review and process improvement', 'Organisational restructuring or change management', 'Bid or tender preparation', 'Grant or donor proposal development (NGOs)', 'Something else'],
		questions: [
			{ name: 'strategyFrequency', label: 'Is this a one-off question, or an ongoing need?', options: ['One-off — a single session', "Ongoing — I'd consider a retainer if it's the right fit"] },
			{ name: 'strategyTimeline', label: 'How soon do you need this?', options: ['This week', 'Within 2 weeks', 'Flexible'] },
		],
	},
	legal: {
		intro: 'Delivered through our retained counsel — real legal advice under proper professional responsibility, not general business guidance.',
		topics: ['A contract I need reviewed or drafted', 'Employment contracts or a staff handbook', 'Trademark, copyright, patent, or industrial design protection', 'NDPA / data protection compliance', 'AML/CFT compliance', 'Corporate governance or board structure', "Shareholders' or founders' agreement", 'Risk register or business continuity planning', 'Due diligence for an investment, acquisition, or partnership', 'A dispute or potential dispute', 'Something else'],
		questions: [
			{ name: 'legalDeadline', label: 'Is there a deadline attached to this?', options: ['Yes', 'No, I want proper advice before proceeding'] },
			{ name: 'legalFrequency', label: 'Single session, or ongoing support?', options: ['Single session', "Ongoing — I'd consider the monthly retainer"] },
		],
	},
	tax: {
		intro: 'Strategic advisory — not routine monthly filing. This is for a specific structuring question or decision.',
		topics: ['Restructuring the business for tax efficiency', 'Planning for a sale, merger, or investment', 'Cross-border or international structuring', 'Reducing ongoing tax exposure', 'Preparing for a tax audit or regulatory review', 'Transfer pricing', 'Something else'],
		questions: [
			{ name: 'taxComplexity', label: 'Roughly how complex is the structure involved?', options: ['Single entity', 'Multiple entities / subsidiaries', 'Cross-border element involved'] },
			{ name: 'taxTimeline', label: 'What is the timeline?', options: ["Immediate — there's a transaction or deadline in motion", 'Planning ahead, no fixed date yet'] },
		],
	},
	marketing: {
		intro: "Advice and direction only — a session and written recommendations. If you need the work delivered, that's our separate Marketing service.",
		topics: ['Brand strategy and positioning', 'Social media strategy — direction, not execution', 'Website strategy and structure', 'Reviewing an existing marketing campaign or approach', 'A go-to-market plan for a new product or service', 'Something else'],
		questions: [{ name: 'marketingStartingPoint', label: 'Do you have existing marketing activity to review?', options: ['Existing — I want a review', 'Starting fresh — I want direction before I begin'] }],
	},
};

function Options({ label, name, options, value, onChange, multiple = false }) {
	return <fieldset className="assessment-fieldset"><legend>{label}</legend><div className="assessment-choices">
		{options.map((option) => { const checked = multiple ? value.includes(option) : value === option; return <label className={checked ? 'selected' : ''} key={option}><input type={multiple ? 'checkbox' : 'radio'} name={name} checked={checked} onChange={() => onChange(option)} /><span>{option}</span></label>; })}
	</div></fieldset>;
}

function PaidConsultation() {
	const [step, setStep] = useState(0);
	const [answers, setAnswers] = useState({ topics: [] });
	const [submitted, setSubmitted] = useState(false);
	const [captchaToken, setCaptchaToken] = useState('');
	const [loading, setLoading] = useState(false);
	const captchaRef = useRef(null);
	const setAnswer = (name, value) => setAnswers((current) => ({ ...current, [name]: value }));
	const toggleTopic = (topic) => setAnswers((current) => ({ ...current, topics: current.topics.includes(topic) ? current.topics.filter((item) => item !== topic) : [...current.topics, topic] }));
	const branch = answers.type ? branchContent[answers.type] : null;
	const urgent = (answers.type === 'legal' && answers.legalDeadline === 'Yes' && answers.deadlineDetails?.trim()) || (answers.type === 'tax' && answers.taxTimeline?.startsWith('Immediate'));

	const next = () => {
		if (step === 0 && !answers.type) return;
		if (step === 1 && !answers.topics.length) return;
		setStep((current) => Math.min(2, current + 1));
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
	const submit = async (event) => {
		event.preventDefault();
		if (!answers.contactMethod) {
			Swal.fire({ icon: 'error', title: 'Contact preference required', text: 'Please choose the best way for us to reach you.' });
			return;
		}
		if (!captchaToken) {
			Swal.fire({ icon: 'error', title: 'Captcha required', text: 'Please verify that you are not a robot.' });
			return;
		}
		setLoading(true);
		try {
			const response = await fetch('/api/paid-consultation/index.php', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...answers, captchaToken }),
			});
			const result = await response.json();
			if (!response.ok || !result.success) throw new Error(result.message || 'Unable to send your consultation request.');
			setSubmitted(true);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} catch (error) {
			captchaRef.current?.reset();
			setCaptchaToken('');
			Swal.fire({ icon: 'error', title: 'Unable to send', text: error.message || 'Please try again later.' });
		} finally {
			setLoading(false);
		}
	};

	if (submitted) return <main className="assessment-page consultation-confirmation"><div className="assessment-shell">
		<span className="eyebrow eyebrow-with-line">REQUEST RECEIVED</span>
		<h1>Thank you, {answers.firstname}.</h1>
		<p>{urgent ? 'Given the timeline you’ve flagged, we’ll be in touch within 4 business hours to confirm details and pricing before anything is booked.' : 'We’ll be in touch within 1 business day to confirm details and pricing before anything is booked.'}</p>
		<div className={`consultation-status ${urgent ? 'urgent' : ''}`}><strong>{urgent ? 'Priority follow-up' : 'Standard follow-up'}</strong><span>{consultationTypes.find((item) => item.value === answers.type)?.label}</span></div>
	</div></main>;

	return <main className="assessment-page paid-consultation"><div className="assessment-shell">
		<header className="assessment-header"><span className="eyebrow eyebrow-with-line">PAID CONSULTATION</span><h1>Tell us exactly what expert input you need.</h1><p>This short intake helps us route your request and quote accurately. No price is shown or charged at this stage.</p></header>
		<div className="assessment-progress three"><div className="active"><i /><span>Consultation type</span></div><div className={step >= 1 ? 'active' : ''}><i /><span>Your requirements</span></div><div className={step >= 2 ? 'active' : ''}><i /><span>Contact details</span></div></div>
		<form onSubmit={submit}>
			{step === 0 && <section className="assessment-step"><h2>Which type of consultation?</h2><p>Choose the single option that best matches the advice you need.</p><div className="consultation-type-grid">{consultationTypes.map((type) => <label className={answers.type === type.value ? 'selected' : ''} key={type.value}><input type="radio" name="consultationType" checked={answers.type === type.value} onChange={() => { setAnswers({ type: type.value, topics: [] }); }} /><strong>{type.label}</strong><span>{type.description}</span></label>)}</div></section>}
			{step === 1 && branch && <section className="assessment-step"><h2>{consultationTypes.find((item) => item.value === answers.type)?.label}</h2><p>{branch.intro}</p><Options label="Which of these would you like to discuss? Select all that apply." name="topics" options={branch.topics} value={answers.topics} onChange={toggleTopic} multiple />{answers.topics.includes('Something else') && <label className="assessment-textarea compact">Tell us what else you need to discuss<textarea value={answers.otherTopic ?? ''} onChange={(e) => setAnswer('otherTopic', e.target.value)} /></label>}{branch.questions.map((question) => <Options key={question.name} label={question.label} name={question.name} options={question.options} value={answers[question.name]} onChange={(value) => setAnswer(question.name, value)} />)}{answers.type === 'legal' && answers.legalDeadline === 'Yes' && <label className="assessment-textarea compact">What is the deadline?<textarea required value={answers.deadlineDetails ?? ''} onChange={(e) => setAnswer('deadlineDetails', e.target.value)} placeholder="Include the date and what must happen by then." /></label>}</section>}
			{step === 2 && <section className="assessment-step"><h2>Your contact details</h2><p>We’ll use these details only to confirm scope, pricing, and available times.</p><div className="assessment-fields two"><label>Full name<input required maxLength="150" value={answers.firstname ?? ''} onChange={(e) => setAnswer('firstname', e.target.value)} autoComplete="name" /></label><label>Company<input required maxLength="150" value={answers.company ?? ''} onChange={(e) => setAnswer('company', e.target.value)} autoComplete="organization" /></label><label>Email address<input required maxLength="254" type="email" value={answers.email ?? ''} onChange={(e) => setAnswer('email', e.target.value)} autoComplete="email" /></label><label>Phone number<input required maxLength="50" type="tel" value={answers.phone ?? ''} onChange={(e) => setAnswer('phone', e.target.value)} autoComplete="tel" /></label></div><Options label="What is the best way to reach you?" name="contactMethod" options={['Phone call', 'WhatsApp', 'Email only']} value={answers.contactMethod} onChange={(value) => setAnswer('contactMethod', value)} /><label className="assessment-fields"><span>Best time to reach you</span><input required maxLength="150" value={answers.contactTime ?? ''} onChange={(e) => setAnswer('contactTime', e.target.value)} placeholder="e.g. Weekdays, 10am–1pm" /></label><label className="assessment-textarea">Anything else we should know before reaching out?<textarea maxLength="3000" value={answers.additionalNotes ?? ''} onChange={(e) => setAnswer('additionalNotes', e.target.value)} /></label><div className="contact-captcha"><ReCAPTCHA ref={captchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={(token) => setCaptchaToken(token || '')} onExpired={() => setCaptchaToken('')} /></div></section>}
			<div className="assessment-nav">{step > 0 && <button type="button" className="secondary" disabled={loading} onClick={() => setStep((current) => current - 1)}>Back</button>}{step < 2 ? <button type="button" onClick={next}>Continue <span>→</span></button> : <button type="submit" disabled={loading}>{loading ? 'Sending request...' : <>Request Consultation <span>→</span></>}</button>}</div>
		</form>
	</div></main>;
}

export default PaidConsultation;
