export function voidThen(): void {
	return undefined;
}

export function logThen<T>(data: T, msg?: string): T {
	if (msg) {
		console.log(msg, data);
	} else {
		console.log("log-then:", data);
	}
	return data;
}

export function iterateObj(obj: any, onAttrib: (key: string, value: any) => void) {
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			onAttrib(key, obj[key]);
		}
	}
}

export function objToArray(obj: any): ({ key: string, value: any })[] {
	const attribs: ({ key: string, value: any })[] = [];
	iterateObj(obj, (key, value) => attribs.push({
		key: key,
		value: value
	}));
	return attribs;
}

export function getAt(arr: any[], index: number, fallback?: any): any {
	if (arr.length >= index) {
		return arr[index];
	} else {
		return fallback;
	}
}