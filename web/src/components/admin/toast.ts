/** Tiny event bridge so any client component can raise a toast without prop drilling. */
export type ToastDetail = { message: string; kind: 'success' | 'error' };

export function toast(message: string, kind: ToastDetail['kind'] = 'success') {
	window.dispatchEvent(new CustomEvent<ToastDetail>('admin:toast', { detail: { message, kind } }));
}
