import { handle, HttpError, jsonSuccess } from '@/lib/api-response';
import { assertAllowedOrigin, clientIp, readJsonBody } from '@/lib/request-guards';
import { enforceRateLimit } from '@/lib/rate-limit';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { escapeHtml as esc, nl2br, sendCompanyMail } from '@/lib/mailer';
import { consultationQuestionLabels, consultationSchema, consultationTypeLabels, firstMessage } from '@/lib/forms/consultation';

// Port of api/paid-consultation/index.php.
export function POST(request: Request) {
	return handle(async () => {
		const data = await readJsonBody(request, 50_000);
		assertAllowedOrigin(request);

		// New: the legacy endpoint had no rate limit.
		const ip = clientIp(request);
		enforceRateLimit('consultation:global', 120, 3600);
		enforceRateLimit(`consultation:ip:10m:${ip}`, 6, 600);
		enforceRateLimit(`consultation:ip:day:${ip}`, 30, 86400);

		const parsed = consultationSchema.safeParse(data);
		if (!parsed.success) throw new HttpError(firstMessage(parsed.error));
		const d = parsed.data;

		await verifyRecaptcha(d.captchaToken, ip);

		const typeLabel = consultationTypeLabels[d.type];
		const detailRows = (Object.keys(consultationQuestionLabels) as (keyof typeof consultationQuestionLabels)[])
			.filter((key) => d[key] !== '')
			.map((key) => `<p><strong>${esc(consultationQuestionLabels[key])}:</strong> ${esc(d[key])}</p>`)
			.join('');

		const priority =
			(d.type === 'legal' && d.legalDeadline === 'Yes' && d.deadlineDetails !== '') ||
			(d.type === 'tax' && d.taxTimeline.startsWith('Immediate'));
		const priorityLabel = priority ? 'Priority follow-up' : 'Standard follow-up';

		try {
			await sendCompanyMail({
				subject: `${priority ? '[PRIORITY] ' : ''}New Paid Consultation Request - ${typeLabel}`,
				replyTo: { address: d.email, name: d.firstname },
				html:
					'<h2>New Paid Consultation Request</h2>' +
					`<p><strong>Priority:</strong> ${priorityLabel}</p>` +
					`<p><strong>Consultation:</strong> ${esc(typeLabel)}</p>` +
					`<p><strong>Name:</strong> ${esc(d.firstname)}</p><p><strong>Company:</strong> ${esc(d.company)}</p>` +
					`<p><strong>Email:</strong> ${esc(d.email)}</p><p><strong>Phone:</strong> ${esc(d.phone)}</p>` +
					`<p><strong>Preferred contact:</strong> ${esc(d.contactMethod)}</p><p><strong>Best time:</strong> ${esc(d.contactTime)}</p>` +
					`<p><strong>Topics:</strong></p><ul>${d.topics.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` +
					(d.otherTopic !== '' ? `<p><strong>Other topic:</strong><br>${nl2br(esc(d.otherTopic))}</p>` : '') +
					detailRows +
					(d.deadlineDetails !== '' ? `<p><strong>Deadline details:</strong><br>${nl2br(esc(d.deadlineDetails))}</p>` : '') +
					(d.additionalNotes !== '' ? `<p><strong>Additional notes:</strong><br>${nl2br(esc(d.additionalNotes))}</p>` : ''),
				text:
					`New Paid Consultation Request\nPriority: ${priorityLabel}\nConsultation: ${typeLabel}\nName: ${d.firstname}\n` +
					`Company: ${d.company}\nEmail: ${d.email}\nPhone: ${d.phone}\nPreferred contact: ${d.contactMethod}\n` +
					`Best time: ${d.contactTime}\nTopics: ${d.topics.join(', ')}` +
					(d.otherTopic !== '' ? `\nOther topic: ${d.otherTopic}` : '') +
					(d.deadlineDetails !== '' ? `\nDeadline: ${d.deadlineDetails}` : '') +
					(d.additionalNotes !== '' ? `\nAdditional notes: ${d.additionalNotes}` : ''),
			});
		} catch (error) {
			console.error('Paid consultation mailer error:', error);
			throw new HttpError('Your request could not be sent. Please try again later.', 500);
		}
		return jsonSuccess({ priority }, 'Your consultation request has been sent.');
	});
}
