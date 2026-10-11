import ImageField from './ImageField';
import RichTextEditor from './RichTextEditor';
import { SelectField, TextAreaField, TextField, YES_NO } from './fields';
import { imageUrl } from '@/lib/images';

type Post = { id: number; heading: string; categoryId: number; preamble: string; body: string; picture: string; featured: string; commentsAllowed: string; date: string };

export default function BlogFields({ post, categories }: { post?: Post; categories: { id: number; name: string }[] }) {
	return (
		<>
			{post && <input type="hidden" name="id" value={post.id} />}
			<TextField name="heading" label="Heading" required maxLength={300} defaultValue={post?.heading} />
			<SelectField
				name="category"
				label="Category"
				required
				placeholder="Select a category"
				defaultValue={post ? String(post.categoryId) : ''}
				options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
			/>
			<TextAreaField name="preamble" label="Preamble" required rows={3} defaultValue={post?.preamble} hint="The short summary shown on the blog list and under the article title." />
			<RichTextEditor name="body" label="Body" required defaultValue={post?.body} />
			<div className="grid gap-4 sm:grid-cols-2">
				<SelectField name="featured" label="Show on the home page?" required options={YES_NO} defaultValue={post?.featured ?? 'No'} hint="Featured posts appear in “Insights to Keep You Informed”." />
				<SelectField name="comments_allowed" label="Comments allowed" required options={YES_NO} defaultValue={post?.commentsAllowed ?? 'No'} />
			</div>
			<TextField name="date" label="Date" type="date" required defaultValue={post?.date.slice(0, 10) ?? new Date().toISOString().slice(0, 10)} />
			<ImageField
				required={!post}
				currentUrl={post ? imageUrl('blog', post.picture) : undefined}
				crop={{ width: 800, height: 600 }}
				hint="Cropped to 800 × 600 from the centre automatically. JPG, PNG or WebP."
			/>
		</>
	);
}
