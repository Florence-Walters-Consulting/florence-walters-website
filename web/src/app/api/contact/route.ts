import { createHash } from 'node:crypto';
import { handle, HttpError, jsonSuccess } from '@/lib/api-response';
import { assertAllowedOrigin, clientIp, readJsonBody } from '@/lib/request-guards';
import { enforceRateLimit, rateLimit } from '@/lib/rate-limit';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { escapeHtml as esc, nl2br, sendCompanyMail } from '@/lib/mailer';
import { contactSchema, firstMessage } from '@/lib/forms/contact';

const SUCCESS = 'Message sent successfully. We will get back to you soon.';
const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

// Port of api/contact/index.php. Non-POST methods get Next's automatic 405.
export function POST(request: Request) {
	return handle(async () => {
		const data = await readJsonBody(request, 16384, { strictType: true });
		assertAllowedOrigin(request);

		const ip = clientIp(request);
		enforceRateLimit('contact:global', 120, 3600);
		enforceRateLimit(`contact:ip:10m:${ip}`, 6, 600);
		enforceRateLimit(`contact:ip:day:${ip}`, 30, 86400);

		// Bots fill the hidden field. Reply with a neutral success so the trap is not disclosed.
		if (String(data.website ?? '').trim() !== '') return jsonSuccess(null, SUCCESS);

		// The page sends formStartedAt; form_started_at is accepted too (the legacy PHP only read
		// the snake_case name, which the page never sent, so every legacy submission was rejected).
		const startedAt = Number(data.formStartedAt ?? data.form_started_at);
		const elapsed = Number.isInteger(startedAt) && startedAt > 0 ? Date.now() - startedAt : 0;
		if (!startedAt || elapsed < 2500 || elapsed > 7_200_000) {
			throw new HttpError('Please reload the form and try again.', 422);
		}

		const parsed = contactSchema.safeParse(data);
		if (!parsed.success) throw new HttpError(firstMessage(parsed.error), 422);
		const f = parsed.data;

		await verifyRecaptcha(f.captchaToken, ip);

		enforceRateLimit(`contact:email:${sha256(f.email)}`, 3, 3600);
		const [isNewMessage] = rateLimit(`contact:duplicate:${sha256(`${f.email}\n${f.subject}\n${f.message}`)}`, 1, 1800);
		if (!isNewMessage) return jsonSuccess(null, SUCCESS);

		const company = f.company || 'Not provided';
		try {
			await sendCompanyMail({
				subject: `New Contact Form Submission: ${f.subject}`,
				replyTo: { address: f.email, name: `${f.first_name} ${f.last_name}` },
				html:
					`<h2>New Contact Form Submission</h2><p><strong>Name:</strong> ${esc(f.first_name)} ${esc(f.last_name)}</p>` +
					`<p><strong>Email:</strong> ${esc(f.email)}</p><p><strong>Phone:</strong> ${esc(f.phone)}</p>` +
					`<p><strong>Company/Organization:</strong> ${esc(company)}</p><p><strong>Subject:</strong> ${esc(f.subject)}</p>` +
					`<p><strong>Message:</strong></p><p>${nl2br(esc(f.message))}</p>`,
				text:
					`New Contact Form Submission\nName: ${f.first_name} ${f.last_name}\nEmail: ${f.email}\nPhone: ${f.phone}\n` +
					`Company/Organization: ${company}\nSubject: ${f.subject}\n\nMessage:\n${f.message}`,
			});
		} catch (error) {
			console.error('Contact form mail delivery failed:', error);
			throw new HttpError('Message could not be sent. Please try again later.', 500);
		}
		return jsonSuccess(null, SUCCESS);
	});
}
