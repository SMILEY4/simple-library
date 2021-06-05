
export function calculateInset(depth: number, additionalInset: string): string {
	const inset: string = "var(--s-1) * " + depth
		+ " + var(--s-0-25)"
		+ (additionalInset ? " + " + additionalInset : "")
	return "calc(" + inset + ")";
}