export function formatPrice(value) {
	const amount = Number(value || 0);

	return `\u20a6${amount.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}
