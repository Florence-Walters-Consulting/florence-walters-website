'use client';

import { useEffect, useRef, useState } from 'react';
import { ui } from './ui';

const MAX_BYTES = 5 * 1024 * 1024;
// A photo that will be cropped can be bigger to start with: what is uploaded is the small result.
const MAX_SOURCE_BYTES_WHEN_CROPPING = 25 * 1024 * 1024;

type Crop = { width: number; height: number };
type Props = { name?: string; label?: string; required?: boolean; currentUrl?: string; hint?: string; crop?: Crop };

/**
 * Crops an image to exactly width x height from the centre and re-encodes it (WebP, or JPEG in
 * browsers that cannot encode WebP). Done here in the browser so the server needs no image library.
 */
async function cropToFile({ width, height }: Crop, file: File): Promise<File> {
	// Honours the photo's EXIF rotation by default.
	const bitmap = await createImageBitmap(file);
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext('2d');
	if (!context) throw new Error('canvas unavailable');
	const scale = Math.max(width / bitmap.width, height / bitmap.height);
	const w = bitmap.width * scale;
	const h = bitmap.height * scale;
	const draw = (background?: string) => {
		context.clearRect(0, 0, width, height);
		if (background) {
			context.fillStyle = background;
			context.fillRect(0, 0, width, height);
		}
		context.imageSmoothingQuality = 'high';
		context.drawImage(bitmap, (width - w) / 2, (height - h) / 2, w, h);
	};
	const toBlob = (type: string, quality: number) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

	draw();
	let blob = await toBlob('image/webp', 0.8);
	if (!blob || blob.type !== 'image/webp') {
		draw('#ffffff'); // JPEG has no transparency
		blob = await toBlob('image/jpeg', 0.85);
	}
	bitmap.close();
	if (!blob) throw new Error('encode failed');
	return new File([blob], blob.type === 'image/webp' ? 'cover.webp' : 'cover.jpg', { type: blob.type });
}

/** File input for one image, with a live preview and client-side checks (the server re-checks everything). */
export default function ImageField({ name = 'image', label = 'Image', required, currentUrl, hint, crop }: Props) {
	const input = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [problem, setProblem] = useState('');
	const [busy, setBusy] = useState(false);

	useEffect(() => () => (preview ? URL.revokeObjectURL(preview) : undefined), [preview]);

	async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
		const el = event.target;
		const file = el.files?.[0];
		setProblem('');
		if (!file) return setPreview(null);
		const limit = crop ? MAX_SOURCE_BYTES_WHEN_CROPPING : MAX_BYTES;
		if (file.size > limit) {
			el.value = '';
			setPreview(null);
			return setProblem(`That image is larger than ${limit / 1024 / 1024} MB. Please choose a smaller one.`);
		}
		if (!crop) return setPreview(URL.createObjectURL(file));

		setBusy(true);
		el.setCustomValidity('Please wait a moment: the image is being prepared.');
		try {
			const cropped = await cropToFile(crop, file);
			const transfer = new DataTransfer();
			transfer.items.add(cropped);
			el.files = transfer.files;
			setPreview(URL.createObjectURL(cropped));
		} catch {
			el.value = '';
			setPreview(null);
			setProblem('That file is not a valid image. Please choose a JPG, PNG or WebP image.');
		} finally {
			el.setCustomValidity('');
			setBusy(false);
		}
	}

	return (
		<div>
			<label htmlFor={`${name}-file`} className={ui.label}>
				{label}
				{required && <span aria-hidden="true"> *</span>}
			</label>
			{(preview || currentUrl) && (
				<img src={preview ?? currentUrl} alt={preview ? 'Selected image preview' : 'Current image'} className="mb-2 h-32 w-auto max-w-full rounded-md border border-slate-200 object-cover" />
			)}
			<input
				ref={input}
				id={`${name}-file`}
				name={name}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				required={required}
				onChange={onChange}
				aria-busy={busy}
				className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-soft file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand hover:file:bg-slate-200"
			/>
			{problem ? (
				<p role="alert" className="mt-1 text-xs text-red-700">
					{problem}
				</p>
			) : (
				<p className={ui.hint} aria-live="polite">
					{busy ? 'Preparing the image…' : (hint ?? 'JPG, PNG or WebP, up to 5 MB.')}
					{!busy && currentUrl && !required ? ' Leave empty to keep the current image.' : ''}
				</p>
			)}
		</div>
	);
}
