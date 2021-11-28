export module ArrayUtils {

	const DEFAULT_EQUALITY = (a: any, b: any) => a === b;

	/**
	 * @return true, if the given element is in the given array
	 */
	export function contains<T>(array: T[], element: T, equality?: (a: T, b: T) => boolean): boolean {
		return array.findIndex(e => isEq(e, element, equality)) !== -1;
	}

	/**
	 * @return true, if the given element is NOT in the given array
	 */
	export function containsNot<T>(array: T[], element: T, equality?: (a: T, b: T) => boolean): boolean {
		return !contains(array, element, equality);
	}

	/**
	 * @return true, if the given array contains at least one of the given elements
	 */
	export function containsSomeOf<T>(array: T[], elements: T[], equality?: (a: T, b: T) => boolean): boolean {
		return array.some(a => contains(elements, a, equality));
	}

	/**
	 * @param arrayA the array "a"
	 * @param arrayB the array "b"
	 * @param equality a function returning true when both its inputs are equal
	 * @return array with all elements from "a" that are not in "b"
	 */
	export function complement<T>(arrayA: T[], arrayB: T[], equality?: (a: T, b: T) => boolean): T[] {
		return arrayA.filter(a => !contains(arrayB, a, equality));
	}


	/**
	 * @param arrayA the array "a"
	 * @param arrayB the array "b"
	 * 	@param equality a function returning true when both its inputs are equal
	 * @return array with all elements from "a" and "b" except those that are in "a" and "b"
	 */
	export function difference<T>(arrayA: T[], arrayB: T[], equality?: (a: T, b: T) => boolean): T[] {
		const compA = complement(arrayA, arrayB, equality);
		const compB = complement(arrayB, arrayA, equality);
		return [...compA, ...compB];
	}


	/**
	 * @param arrayA the array "a"
	 * @param arrayB the array "b"
	 * @param equality a function returning true when both its inputs are equal
	 * @return array with all elements from "a" and "b" with no duplicates (if an element is in "a" and "b")
	 */
	export function union<T>(arrayA: T[], arrayB: T[], equality?: (a: T, b: T) => boolean): T[] {
		const compA = complement(arrayA, arrayB, equality);
		return [...compA, ...arrayB];
	}


	/**
	 * @param arrayA the array "a"
	 * @param arrayB the array "b"
	 * @param equality a function returning true when both its inputs are equal
	 * @return array with all elements that are in "a" and "b"
	 */
	export function intersection<T>(arrayA: T[], arrayB: T[], equality?: (a: T, b: T) => boolean): T[] {
		return arrayA.filter(a => contains(arrayB, a, equality));
	}

	/**
	 * Returns a new array with only unique values
	 * @param array the input array
	 */
	export function unique<T>(array: T[]): T[] {
		return array.filter((value, index) => array.indexOf(value) === index);
	}


	/**
	 * Returns a new array with only unique values. Uniqueness is defined by a custom key of any element
	 * @param array the input array
	 * @param key a function defining a key for each element.
	 */
	export function uniqueByKey<T>(array: T[], key: (value: T) => any): T[] {
		const seenKeys: any[] = [];
		return array.filter(value => {
			const k = key(value);
			if (seenKeys.indexOf(k) === -1) {
				seenKeys.push(k);
				return true;
			} else {
				return false;
			}
		});
	}

	function isEq<T>(a: T, b: T, equality?: (a: T, b: T) => boolean): boolean {
		if (equality) {
			return equality(a, b);
		} else {
			return DEFAULT_EQUALITY(a, b);
		}
	}

}