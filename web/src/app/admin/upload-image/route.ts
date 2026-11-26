import { requireAdminAction, UnauthorizedError } from '@/lib/auth/dal';
import { UserError } from '@/lib/admin/errors';
import { isUpload, saveImage } from '@/lib/admin/uploads';
import { assertAllowedOrigin } from '@/lib/request-guards';
import { HttpError } from '@/lib/api-response';
import { imageUrl } from '@/lib/images';

const json = (body: Record<string, string>, status: number) =>
	Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

// Image uploads from the rich-text editor. Lives under /admin so the session cookie (scoped to
// /admin) is sent with it. Admin session required.
export async function POST(request: Request) {
	try {
		await requireAdminAction();
		assertAllowedOrigin(request);
		const file = (await request.formData()).get('file');
		if (!isUpload(file)) throw new UserError('Please choose an image.');
		const name = await saveImage(file, 'summernote', { kind: 'original' });
		return json({ url: imageUrl('summernote', name) }, 200);
	} catch (error) {
		if (error instanceof UnauthorizedError) return json({ error: error.message }, 401);
		if (error instanceof UserError) return json({ error: error.message }, 422);
		if (error instanceof HttpError) return json({ error: error.message }, error.status);
		console.error('Editor image upload failed:', error);
		return json({ error: 'The image could not be uploaded.' }, 500);
	}
}
