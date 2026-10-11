'use client';

import { useRef, useState } from 'react';
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { ui } from './ui';

type Props = { name: string; label: string; defaultValue?: string; required?: boolean; hint?: string };

function ToolbarButton({ label, active, disabled, onClick, children }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
	return (
		<button
			type="button"
			title={label}
			aria-label={label}
			aria-pressed={active}
			disabled={disabled}
			onClick={onClick}
			className={`rounded px-2 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40 ${
				active ? 'bg-brand text-white' : 'text-slate-700 hover:bg-slate-200'
			}`}>
			{children}
		</button>
	);
}

function Toolbar({ editor, onUpload, uploading }: { editor: Editor; onUpload: (file: File) => void; uploading: boolean }) {
	const file = useRef<HTMLInputElement>(null);
	const s = useEditorState({
		editor,
		selector: ({ editor: e }) => ({
			bold: e.isActive('bold'),
			italic: e.isActive('italic'),
			h2: e.isActive('heading', { level: 2 }),
			h3: e.isActive('heading', { level: 3 }),
			bullet: e.isActive('bulletList'),
			ordered: e.isActive('orderedList'),
			quote: e.isActive('blockquote'),
			link: e.isActive('link'),
			canUndo: e.can().undo(),
			canRedo: e.can().redo(),
		}),
	});

	const setLink = () => {
		const previous = editor.getAttributes('link').href as string | undefined;
		const url = window.prompt('Link address (leave empty to remove the link)', previous ?? 'https://');
		if (url === null) return;
		if (url.trim() === '') editor.chain().focus().extendMarkRange('link').unsetLink().run();
		else editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
	};

	return (
		<div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-1 border-b border-slate-300 bg-slate-50 p-1.5">
			<ToolbarButton label="Bold" active={s.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
				<strong>B</strong>
			</ToolbarButton>
			<ToolbarButton label="Italic" active={s.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
				<em>I</em>
			</ToolbarButton>
			<ToolbarButton label="Heading" active={s.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
				H2
			</ToolbarButton>
			<ToolbarButton label="Sub-heading" active={s.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
				H3
			</ToolbarButton>
			<ToolbarButton label="Bulleted list" active={s.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()}>
				• List
			</ToolbarButton>
			<ToolbarButton label="Numbered list" active={s.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
				1. List
			</ToolbarButton>
			<ToolbarButton label="Quote" active={s.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
				“ ”
			</ToolbarButton>
			<ToolbarButton label="Link" active={s.link} onClick={setLink}>
				Link
			</ToolbarButton>
			<ToolbarButton label="Insert image" disabled={uploading} onClick={() => file.current?.click()}>
				{uploading ? 'Uploading…' : 'Image'}
			</ToolbarButton>
			<input
				ref={file}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				className="hidden"
				onChange={(event) => {
					const f = event.target.files?.[0];
					event.target.value = '';
					if (f) onUpload(f);
				}}
			/>
			<span className="mx-1 h-5 w-px bg-slate-300" aria-hidden="true" />
			<ToolbarButton label="Undo" disabled={!s.canUndo} onClick={() => editor.chain().focus().undo().run()}>
				↶
			</ToolbarButton>
			<ToolbarButton label="Redo" disabled={!s.canRedo} onClick={() => editor.chain().focus().redo().run()}>
				↷
			</ToolbarButton>
		</div>
	);
}

/** WYSIWYG editor (Tiptap). Its HTML is submitted with the form in a hidden input called `name`. */
export default function RichTextEditor({ name, label, defaultValue = '', required, hint }: Props) {
	const [html, setHtml] = useState(defaultValue);
	const [uploading, setUploading] = useState(false);
	const [problem, setProblem] = useState('');
	const id = `${name}-editor`;

	const editor = useEditor({
		extensions: [StarterKit.configure({ link: { openOnClick: false, autolink: false } }), Image],
		content: defaultValue,
		immediatelyRender: false,
		onUpdate: ({ editor: e }) => setHtml(e.isEmpty ? '' : e.getHTML()),
		editorProps: {
			attributes: {
				id,
				role: 'textbox',
				'aria-multiline': 'true',
				'aria-label': label,
				class: 'prose-sm min-h-[12rem] max-w-none px-3 py-2 focus:outline-none [&_h2]:mt-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_img]:max-w-full [&_img]:h-auto [&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-3 [&_a]:text-accent [&_a]:underline [&_p]:my-2',
			},
		},
	});

	const upload = async (file: File) => {
		if (!editor) return;
		setProblem('');
		setUploading(true);
		try {
			const body = new FormData();
			body.append('file', file);
			const response = await fetch('/admin/upload-image', { method: 'POST', body });
			const result = await response.json().catch(() => ({}));
			if (!response.ok || !result.url) throw new Error(result.error || 'The image could not be uploaded.');
			editor.chain().focus().setImage({ src: result.url, alt: '' }).run();
		} catch (error) {
			setProblem(error instanceof Error ? error.message : 'The image could not be uploaded.');
		} finally {
			setUploading(false);
		}
	};

	return (
		<div>
			<label htmlFor={id} className={ui.label}>
				{label}
				{required && <span aria-hidden="true"> *</span>}
			</label>
			<div className="overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm focus-within:border-brand focus-within:ring-2 focus-within:ring-accent/40">
				{editor ? <Toolbar editor={editor} onUpload={upload} uploading={uploading} /> : <div className="h-10 border-b border-slate-300 bg-slate-50" />}
				<EditorContent editor={editor} />
			</div>
			<input type="hidden" name={name} value={html} />
			{problem && (
				<p role="alert" className="mt-1 text-xs text-red-700">
					{problem}
				</p>
			)}
			{hint && <p className={ui.hint}>{hint}</p>}
		</div>
	);
}
