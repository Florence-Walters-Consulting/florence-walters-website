'use client';

/** An <img> that hides itself if the file fails to load (the legacy CTA avatars did this). */
export default function HidingImage({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { alt: string }) {
	return (
		<img
			{...props}
			alt={alt}
			onError={(event) => {
				event.currentTarget.style.display = 'none';
			}}
		/>
	);
}
