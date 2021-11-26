export module ArrayUtils {

	/**
	 * @return true, if the given element is in the given array
	 */
	export function contains<T>(array: T[], element: T, equality: (a: T, b: T) => boolean): boolean {
		return array.findIndex(e => equality(e, element)) !== -1
	}

	/**
	 * @param arrayA the array "a"
	 * @param arrayB the array "b"
	 * @param equality a function returning true when both its inputs are equal
	 * @return array with all elements from "a" that are not in "b"
	 */
	export function complement<T>(arrayA: T[], arrayB: T[], equality: (a: T, b: T) => boolean): T[] {
		return arrayA.filter(a => !contains(arrayB, a, equality))
	}


	/**
	 * @param arrayA the array "a"
	 * @param arrayB the array "b"
	 * 	@param equality a function returning true when both its inputs are equal
	 * @return array with all elements from "a" and "b" except those that are in "a" and "b"
	 */
	export function difference<T>(arrayA: T[], arrayB: T[], equality: (a: T, b: T) => boolean): T[] {
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
	export function union<T>(arrayA: T[], arrayB: T[], equality: (a: T, b: T) => boolean): T[] {
		const compA = complement(arrayA, arrayB, equality);
		return [...compA, ...arrayB];
	}


	/**
	 * @param arrayA the array "a"
	 * @param arrayB the array "b"
	 * @param equality a function returning true when both its inputs are equal
	 * @return array with all elements that are in "a" and "b"
	 */
	export function intersection<T>(arrayA: T[], arrayB: T[], equality: (a: T, b: T) => boolean): T[] {
		return arrayA.filter(a => contains(arrayB, a, equality))
	}

}