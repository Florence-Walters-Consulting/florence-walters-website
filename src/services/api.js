export async function api(url, options = {}) {
	const { headers, ...fetchOptions } = options;
	const requestHeaders = { ...(headers || {}) };
	const requestUrl = normalizeApiUrl(url);
	const bodyIsFormData =
		typeof FormData !== 'undefined' && fetchOptions.body instanceof FormData;

	if (fetchOptions.body && !bodyIsFormData && !requestHeaders['Content-Type']) {
		requestHeaders['Content-Type'] = 'application/json';
	}

	const response = await fetch(requestUrl, {
		...fetchOptions,
		headers: requestHeaders,
		credentials: 'same-origin',
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Request failed');
	}

	return data;
}

function normalizeApiUrl(url) {
	if (!url.startsWith('/api/') || url.endsWith('/')) {
		return url;
	}

	const [path, query = ''] = url.split('?');
	const lastSegment = path.split('/').pop() || '';

	if (lastSegment.includes('.')) {
		return url;
	}

	return `${path}/${query ? `?${query}` : ''}`;
}
