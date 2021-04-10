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