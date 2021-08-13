export module MsgTraceId {

	export function gen() {
		return strHash(genId());
	}

	function genId(): string {
		return "" + (Date.now() + Math.random());
	}

	function strHash(input: string): string {
		let hash = 0, i, chr;
		if (input.length === 0) {
			return toBase64(Math.abs(hash));
		}
		for (i = 0; i < input.length; i++) {
			chr = input.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0;
		}
		return toBase64(Math.abs(hash));
	}

	const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

	function toBase64(value: number): string {
		let result = "", mod;
		do {
			mod = value % 64;
			result = ALPHA.charAt(mod) + result;
			value = Math.floor(value / 64);
		} while (value > 0);
		return result;
	}

}