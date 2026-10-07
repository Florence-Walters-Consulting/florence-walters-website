import { useMemo, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Swal from 'sweetalert2';

const branchMeta = {
	formation: { label: 'Business Formation & Corporate Services', problem: 'I need to register or restructure my business' },
	licensing: { label: 'Regulatory Licensing & Compliance', problem: "I need a licence, or I'm behind on filings/tax" },
	contracts: { label: 'Contracts, IP & Governance', problem: 'I need contracts, trademark protection, or data/governance help' },
	marketing: { label: 'Marketing', problem: 'I need help with marketing, branding, or visibility' },
	advisory: { label: 'Business Advisory & Growth', problem: 'I want to grow, raise investment, or need a strategy/business plan' },
};

const stages = ['Business basics', 'Your challenges', 'A few details', 'Final questions'];

function ChoiceGroup({ legend, name, options, value, onChange, multiple = false }) {
	return <fieldset className="assessment-fieldset">
		<legend>{legend}</legend>
		<div className="assessment-choices">
			{options.map((option) => {
				const optionValue = typeof option === 'string' ? option : option.value;
				const optionLabel = typeof option === 'string' ? option : option.label;
				const checked = multiple ? value.includes(optionValue) : value === optionValue;
				return <label className={checked ? 'selected' : ''} key={optionValue}>
					<input type={multiple ? 'checkbox' : 'radio'} name={name} value={optionValue} checked={checked} onChange={() => onChange(optionValue)} />
					<span>{optionLabel}</span>
				</label>;
			})}
		</div>
	</fieldset>;
}

function BusinessAssessment() {
	const [step, setStep] = useState(0);
	const [result, setResult] = useState(false);
	const [answers, setAnswers] = useState({ branches: [], contractsConcerns: [] });
	const [captchaToken, setCaptchaToken] = useState('');
	const [loading, setLoading] = useState(false);
	const captchaRef = useRef(null);
	const schedulerUrl = import.meta.env.VITE_DISCOVERY_CALL_URL;
	const schedulerReady = Boolean(schedulerUrl);
	const schedulerWithContext = schedulerUrl
		? `${schedulerUrl}${schedulerUrl.includes('?') ? '&' : '?'}utm_source=business-assessment&utm_medium=website&utm_campaign=free-discovery-call`
		: '';

	const setAnswer = (name, value) => setAnswers((current) => ({ ...current, [name]: value }));
	const toggle = (name, value) => setAnswers((current) => {
		const values = current[name] ?? [];
		return { ...current, [name]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value] };
	});
	const selectedBranches = answers.branches.filter((branch) => branch !== 'unsure');
	const recommendations = useMemo(() => selectedBranches.map((branch) => branchMeta[branch]), [selectedBranches]);

	const next = () => {
		if (step === 0 && (!answers.stage || !answers.sector)) {
			Swal.fire({ icon: 'info', title: 'Complete this step', text: 'Please select your business stage and sector.' });
			return;
		}
		if (step === 1 && !answers.branches.length) {
			Swal.fire({ icon: 'info', title: 'Complete this step', text: 'Please select at least one business challenge.' });
			return;
		}
		setStep((current) => Math.min(current + 1, 3));
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const submit = async (event) => {
		event.preventDefault();
		if (!answers.budget || !answers.timeline) {
			Swal.fire({ icon: 'info', title: 'Complete this step', text: 'Please select your budget and timeline.' });
			return;
		}
		if (!captchaToken) {
			Swal.fire({ icon: 'error', title: 'Captcha required', text: 'Please verify that you are not a robot.' });
			return;
		}
		setLoading(true);
		try {
			const response = await fetch('/api/business-assessment/index.php', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...answers, captchaToken }),
			});
			const submission = await response.json();
			if (!response.ok || !submission.success) throw new Error(submission.message || 'Unable to submit your assessment.');
			setResult(true);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} catch (error) {
			captchaRef.current?.reset();
			setCaptchaToken('');
			Swal.fire({ icon: 'error', title: 'Unable to submit', text: error.message || 'Please try again later.' });
		} finally {
			setLoading(false);
		}
	};

	if (result) return <main className="assessment-page assessment-result">
		<div className="assessment-shell">
			<span className="eyebrow eyebrow-with-line">YOUR ASSESSMENT</span>
			<h1>{recommendations.length ? 'Here’s where we recommend starting' : 'A diagnostic conversation is the right next step'}</h1>
			<p>{recommendations.length ? 'Based on your answers, these service areas are most relevant to what your business is facing right now.' : 'Your answers suggest the issue crosses several areas or is not yet clearly defined. The discovery call will help us identify the real problem before recommending any work.'}</p>
			{recommendations.length > 0 && <div className="assessment-recommendations">
				{recommendations.map((item, index) => <article key={item.label}><strong>0{index + 1}</strong><h2>{item.label}</h2><p>Recommended because you selected: “{item.problem}.”</p></article>)}
			</div>}
			<div className="assessment-booking">
				<h2>Choose a time that works for you</h2>
				<p>Your booking will be confirmed by Calendly. The meeting details and Google Meet link will be sent automatically.</p>
				{schedulerReady ? <div className="assessment-calendly" aria-label="Book your free discovery call"><iframe title="Book Your Free Discovery Call" src={schedulerWithContext} loading="lazy" /></div> : <div className="assessment-scheduler-missing">The discovery-call scheduler is not configured yet. Please add <code>VITE_DISCOVERY_CALL_URL</code> to the production environment.</div>}
			</div>
			<button className="assessment-restart" type="button" onClick={() => { setResult(false); setStep(0); setAnswers({ branches: [], contractsConcerns: [] }); setCaptchaToken(''); }}>Retake the assessment</button>
		</div>
	</main>;

	return <main className="assessment-page">
		<div className="assessment-shell">
			<header className="assessment-header">
				<span className="eyebrow eyebrow-with-line">FREE BUSINESS ASSESSMENT</span>
				<h1>Let’s understand what your business actually needs.</h1>
				<p>A few focused questions will identify the service areas most relevant to you. It takes only a few minutes.</p>
			</header>
			<div className="assessment-progress" aria-label={`Step ${step + 1} of 4`}>
				{stages.map((stage, index) => <div className={index <= step ? 'active' : ''} key={stage}><i /><span>{stage}</span></div>)}
			</div>
			<form onSubmit={submit}>
				{step === 0 && <section className="assessment-step">
					<h2>Business Basics</h2><p>First, tell us where the business stands today.</p>
					<ChoiceGroup legend="Where are you right now?" name="stage" value={answers.stage} onChange={(value) => setAnswer('stage', value)} options={['Idea / pre-launch', 'Newly registered (under 12 months)', 'Operating, 1–5 years', 'Established, 5+ years', 'NGO / non-profit', 'Foreign entity entering Nigeria']} />
					<ChoiceGroup legend="What sector?" name="sector" value={answers.sector} onChange={(value) => setAnswer('sector', value)} options={['Fintech & payments', 'Oil, gas & energy', 'NGO / foundation', 'Education', 'Healthcare & pharma', 'Construction & contracting', 'Professional services', 'Manufacturing', 'Technology', 'Other']} />
					<div className="assessment-fields three"><label>Turnover band<input value={answers.turnover ?? ''} onChange={(e) => setAnswer('turnover', e.target.value)} placeholder="e.g. Pre-revenue" /></label><label>Employee count<input type="number" min="0" value={answers.employees ?? ''} onChange={(e) => setAnswer('employees', e.target.value)} placeholder="e.g. 5" /></label><label>Years trading<input type="number" min="0" value={answers.years ?? ''} onChange={(e) => setAnswer('years', e.target.value)} placeholder="e.g. 2" /></label></div>
				</section>}

				{step === 1 && <section className="assessment-step">
					<h2>What’s the main problem you’re facing?</h2><p>Select all that apply. Your choices determine the questions you see next.</p>
					<ChoiceGroup legend="Choose one or more" name="branches" multiple value={answers.branches} onChange={(value) => toggle('branches', value)} options={[...Object.entries(branchMeta).map(([value, item]) => ({ value, label: item.problem })), { value: 'unsure', label: 'I’m not sure — something just feels off' }]} />
				</section>}

				{step === 2 && <section className="assessment-step">
					<h2>A few details about your challenge</h2><p>You’ll only see questions related to the areas you selected.</p>
					{selectedBranches.length === 0 && <div className="assessment-unsure"><h3>It’s okay not to know yet.</h3><p>Your answers will route you to a diagnostic recommendation so the underlying issue can be clarified properly.</p></div>}
					{selectedBranches.includes('formation') && <div className="assessment-branch"><h3>Business Formation & Corporate Services</h3><ChoiceGroup legend="What’s driving this?" name="formationDriver" value={answers.formationDriver} onChange={(v) => setAnswer('formationDriver', v)} options={['Starting a new business', 'Restructuring an existing one', 'Bringing in a partner, co-founder, or investor', 'Converting from one structure to another']} /><ChoiceGroup legend="What do you currently have, if anything?" name="formationCurrent" value={answers.formationCurrent} onChange={(v) => setAnswer('formationCurrent', v)} options={['Nothing registered yet', 'Business Name', 'Private Limited Company', 'NGO / Incorporated Trustees', 'Other / not sure']} /><ChoiceGroup legend="Does this involve a foreign shareholder or partner?" name="foreignPartner" value={answers.foreignPartner} onChange={(v) => setAnswer('foreignPartner', v)} options={['Yes', 'No']} /><ChoiceGroup legend="Are there co-founders or partners involved?" name="cofounders" value={answers.cofounders} onChange={(v) => setAnswer('cofounders', v)} options={['Yes', 'No, just me']} /></div>}
					{selectedBranches.includes('licensing') && <div className="assessment-branch"><h3>Regulatory Licensing & Compliance</h3><ChoiceGroup legend="Which best describes it?" name="licensingState" value={answers.licensingState} onChange={(v) => setAnswer('licensingState', v)} options={["I don't know what licences my business needs", "I know what I need but haven't started the application", "I have a licence but I'm not confident I'm fully compliant", "I'm behind on tax filing or annual returns"]} /><ChoiceGroup legend="Have you received a query, penalty, or enforcement action?" name="regulatorAction" value={answers.regulatorAction} onChange={(v) => setAnswer('regulatorAction', v)} options={['Yes', 'No', 'Not sure']} /><ChoiceGroup legend="How long has this been unresolved?" name="licensingDuration" value={answers.licensingDuration} onChange={(v) => setAnswer('licensingDuration', v)} options={['Just realised it', 'A few months', 'Over a year']} /></div>}
					{selectedBranches.includes('contracts') && <div className="assessment-branch"><h3>Contracts, IP & Governance</h3><ChoiceGroup legend="What’s the specific concern?" name="contractsConcerns" multiple value={answers.contractsConcerns} onChange={(v) => toggle('contractsConcerns', v)} options={["We don't have written contracts with clients or suppliers", "We don't have employment contracts or a staff handbook", "Our brand name or logo isn't trademarked", "We don't have a data protection policy", "We need a shareholders' or founders' agreement", "We're not confident our governance structure would hold up to scrutiny"]} /><ChoiceGroup legend="Do you collect or store customer personal or financial data?" name="customerData" value={answers.customerData} onChange={(v) => setAnswer('customerData', v)} options={['Yes', 'No', 'Not sure']} /></div>}
					{selectedBranches.includes('marketing') && <div className="assessment-branch"><h3>Marketing</h3><ChoiceGroup legend="What do you need most?" name="marketingNeed" value={answers.marketingNeed} onChange={(v) => setAnswer('marketingNeed', v)} options={['Ongoing social media management', 'A new brand identity, or a rebrand', 'A website', 'General marketing strategy / direction']} /><ChoiceGroup legend="What is your current social media presence?" name="socialPresence" value={answers.socialPresence} onChange={(v) => setAnswer('socialPresence', v)} options={['None yet', 'Some, but inconsistent', 'Active, but not converting into leads or sales']} /></div>}
					{selectedBranches.includes('advisory') && <div className="assessment-branch"><h3>Business Advisory & Growth</h3><ChoiceGroup legend="What’s the actual goal?" name="growthGoal" value={answers.growthGoal} onChange={(v) => setAnswer('growthGoal', v)} options={['Raising investment or funding', 'Entering a new market or region', 'Improving internal operations', 'Writing a formal business plan', 'Applying for a grant (NGOs)', 'Preparing for a bid or tender']} /><ChoiceGroup legend="Do you have financials or projections ready?" name="financials" value={answers.financials} onChange={(v) => setAnswer('financials', v)} options={['Have them, need them formalised', 'Starting from scratch']} /></div>}
				</section>}

				{step === 3 && <section className="assessment-step">
					<h2>Final Questions</h2><p>These answers help us understand priority and scope.</p>
					<ChoiceGroup legend="What budget band are you working with?" name="budget" value={answers.budget} onChange={(v) => setAnswer('budget', v)} options={['Below ₦250,000', '₦250,000–₦1m', '₦1m–₦5m', 'Above ₦5m']} />
					<ChoiceGroup legend="What is your timeline?" name="timeline" value={answers.timeline} onChange={(v) => setAnswer('timeline', v)} options={['Immediately', 'Within 30 days', 'Within 90 days', 'Exploring options']} />
					<label className="assessment-textarea">In your own words, what’s the one problem you most want solved?<textarea required value={answers.mainProblem ?? ''} onChange={(e) => setAnswer('mainProblem', e.target.value)} placeholder="Tell us what is happening, what you have tried, and what outcome you need." /></label>
					<div className="assessment-contact"><h3>Where should we contact you about your assessment?</h3><div className="assessment-fields two"><label>First name<input required maxLength="100" value={answers.firstname ?? ''} onChange={(e) => setAnswer('firstname', e.target.value)} autoComplete="given-name" /></label><label>Last name<input required maxLength="100" value={answers.lastname ?? ''} onChange={(e) => setAnswer('lastname', e.target.value)} autoComplete="family-name" /></label><label>Email address<input required maxLength="254" type="email" value={answers.email ?? ''} onChange={(e) => setAnswer('email', e.target.value)} autoComplete="email" /></label><label>Phone number<input required maxLength="50" type="tel" value={answers.phone ?? ''} onChange={(e) => setAnswer('phone', e.target.value)} autoComplete="tel" /></label><label>Company / organisation<input maxLength="150" value={answers.company ?? ''} onChange={(e) => setAnswer('company', e.target.value)} autoComplete="organization" /></label></div><div className="contact-captcha"><ReCAPTCHA ref={captchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={(token) => setCaptchaToken(token || '')} onExpired={() => setCaptchaToken('')} /></div><p className="contact-privacy">By submitting this assessment, you agree to our <a href="/privacy">Privacy Policy</a>. Your information will be used to review your needs and contact you about relevant services.</p></div>
				</section>}

				<div className="assessment-nav">
					{step > 0 && <button type="button" className="secondary" disabled={loading} onClick={() => setStep((current) => current - 1)}>Back</button>}
					{step < 3 ? <button type="button" onClick={next}>Continue <span>→</span></button> : <button type="submit" disabled={loading}>{loading ? 'Submitting assessment...' : <>See My Assessment <span>→</span></>}</button>}
				</div>
			</form>
		</div>
	</main>;
}

export default BusinessAssessment;
