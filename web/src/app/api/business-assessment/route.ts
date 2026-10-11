import { handle, HttpError, jsonSuccess } from '@/lib/api-response';
import { assertAllowedOrigin, clientIp, readJsonBody } from '@/lib/request-guards';
import { enforceRateLimit } from '@/lib/rate-limit';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { escapeHtml as esc, nl2br, sendCompanyMail } from '@/lib/mailer';
import { assessmentDetailLabels, assessmentSchema, branchLabels, firstMessage } from '@/lib/forms/assessment';

// Port of api/business-assessment/index.php.
export function POST(request: Request) {
	return handle(async () => {
		const data = await readJsonBody(request, 75_000);
		assertAllowedOrigin(request);

		// New: the legacy endpoint had no rate limit.
		const ip = clientIp(request);
		enforceRateLimit('assessment:global', 120, 3600);
		enforceRateLimit(`assessment:ip:10m:${ip}`, 6, 600);
		enforceRateLimit(`assessment:ip:day:${ip}`, 30, 86400);

		const parsed = assessmentSchema.safeParse(data);
		if (!parsed.success) throw new HttpError(firstMessage(parsed.error));
		const d = parsed.data;

		await verifyRecaptcha(d.captchaToken, ip);

		const detailRows = (Object.keys(assessmentDetailLabels) as (keyof typeof assessmentDetailLabels)[])
			.filter((key) => d[key] !== '')
			.map((key) => `<p><strong>${esc(assessmentDetailLabels[key])}:</strong> ${esc(d[key])}</p>`)
			.join('');
		const branchItems = d.branches.map((b) => `<li>${esc(branchLabels[b])}</li>`).join('');
		const concernItems = d.contractsConcerns.map((c) => `<li>${esc(c)}</li>`).join('');
		const priority = d.timeline === 'Immediately';
		const fullName = `${d.firstname} ${d.lastname}`;
		const company = d.company || 'Not provided';

		try {
			await sendCompanyMail({
				subject: `${priority ? '[PRIORITY] ' : ''}New Free Business Assessment - ${fullName}`,
				replyTo: { address: d.email, name: fullName },
				html:
					'<h2>New Free Business Assessment</h2>' +
					`<p><strong>Name:</strong> ${esc(fullName)}</p><p><strong>Email:</strong> ${esc(d.email)}</p>` +
					`<p><strong>Phone:</strong> ${esc(d.phone)}</p><p><strong>Company:</strong> ${esc(company)}</p>` +
					`<p><strong>Business stage:</strong> ${esc(d.stage)}</p><p><strong>Sector:</strong> ${esc(d.sector)}</p>` +
					`<p><strong>Recommended service areas:</strong></p><ul>${branchItems}</ul>${detailRows}` +
					(concernItems !== '' ? `<p><strong>Contract/IP/governance concerns:</strong></p><ul>${concernItems}</ul>` : '') +
					`<p><strong>Budget:</strong> ${esc(d.budget)}</p><p><strong>Timeline:</strong> ${esc(d.timeline)}</p>` +
					`<p><strong>Main problem:</strong><br>${nl2br(esc(d.mainProblem))}</p>`,
				text:
					`New Free Business Assessment\nName: ${fullName}\nEmail: ${d.email}\nPhone: ${d.phone}\nCompany: ${company}\n` +
					`Business stage: ${d.stage}\nSector: ${d.sector}\nService areas: ${d.branches.map((b) => branchLabels[b]).join(', ')}\n` +
					`Budget: ${d.budget}\nTimeline: ${d.timeline}\nMain problem: ${d.mainProblem}`,
			});
		} catch (error) {
			console.error('Business assessment mailer error:', error);
			throw new HttpError('Your assessment could not be submitted. Please try again later.', 500);
		}
		return jsonSuccess({ priority }, 'Your assessment has been submitted.');
	});
}
