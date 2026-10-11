import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';
import { env } from './env';

const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Florence Walters Consulting';

/** Escapes text for HTML. Same characters as PHP htmlspecialchars(ENT_QUOTES). */
export const escapeHtml = (value: string) =>
	value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

/** Like PHP nl2br(): a <br /> before every line break. */
export const nl2br = (value: string) => value.replace(/(\r\n|\n\r|\n|\r)/g, '<br />$1');

type Mail = { subject: string; html: string; text: string; replyTo: { address: string; name: string } };

let transporter: Transporter | undefined;

function getTransporter() {
	transporter ??= env.SMTP_HOST
		? nodemailer.createTransport({
				host: env.SMTP_HOST,
				port: env.SMTP_PORT,
				// Port 587 uses STARTTLS (what Microsoft 365 expects); 465 is implicit TLS.
				secure: env.SMTP_PORT === 465,
				requireTLS: env.SMTP_PORT !== 465,
				auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined,
			})
		: // No SMTP configured (local dev): build the message but do not send it.
			nodemailer.createTransport({ jsonTransport: true });
	return transporter;
}

/** Sends a notification email to the company inbox. Throws if delivery fails. */
export async function sendCompanyMail({ subject, html, text, replyTo }: Mail) {
	const from = env.MAIL_FROM;
	const to = env.MAIL_TO;
	if (env.SMTP_HOST && (!from || !to)) throw new Error('MAIL_FROM and MAIL_TO must be set when SMTP_HOST is set.');

	const info = await getTransporter().sendMail({
		from: { name: companyName, address: from ?? 'noreply@localhost' },
		to: { name: companyName, address: to ?? 'admin@localhost' },
		replyTo,
		subject,
		html,
		text,
	});
	if (!env.SMTP_HOST) {
		console.info('[mail:dev] not sent (SMTP_HOST unset):', subject);
		// Full message only in `next dev`, so production logs never contain visitors' details.
		if (process.env.NODE_ENV === 'development') console.info('[mail:dev:body]', (info as { message: string }).message);
	}
	return info;
}
