export enum GroupPosition {
    START = "start",
    MIDDLE = "middle",
    MIDDLE_SEAMLESS = "middle-seamless",
    END = "end",
    END_SEAMLESS = "end-seamless"
}

export enum Variant {
    SOLID = "solid",
    OUTLINE = "outline",
    GHOST = "ghost",
    LINK = "link"
}

export enum Type {
    DEFAULT = "default",
    PRIMARY = "primary",
    SUCCESS = "success",
    ERROR = "error",
    WARN = "warn"
}

export enum AlignMain {
    START = 'start',
    END = 'end',
    CENTER = 'center',
    SPACE_BETWEEN = 'space-between',
    SPACED = 'spaced'
}

export enum AlignCross {
    START = 'start',
    END = 'end',
    CENTER = 'center',
    STRETCH = 'stretch',
}

export enum Dir {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right'
}

export enum Fill {
    HORZ = 'horz',
    VERT = 'vert',
    TRUE = 'both'
}

export enum Size {
    S_0 = 's-0',
    S_0_15 = 's-0-15',
    S_0_25 = 's-0-25',
    S_0_5 = 's-0-5',
    S_0_75 = 's-0-75',
    S_1 = 's-1',
    S_1_5 = 's-1-5',
    S_2 = 's-2',
    S_3 = 's-3',
    S_4 = 's-4',
    S_6 = 's-6',
    S_8 = 's-8',
    S_12 = 's-12',
    S_16 = 's-16',
    S_24 = 's-24',
    S_32 = 's-32',
    S_40 = 's-40',
    S_48 = 's-48',
}


/**
 * Safely combines the given class names into a single one. Ignores undefined.
 * @param classNames the array of class name strings or undefined
 */
export function concatClasses(...classNames: string[]) {
    let result: string = '';
    classNames.forEach(className => result += classNameOrEmpty(className));
    return result.trim();
}

/**
 * @param className the classname or undefined
 * @returns the given className with an empty space before it (e.g. "my-class" -> " my-class") or an empty string.
 */
export function classNameOrEmpty(className?: string): string {
    return (className ? ' ' + className : '');
}

/**
 * @param value the value, null or undefined
 * @param defaultValue the value to return when the given value is null/undefined
 * @returns the value as a string or an empty string in case of null/undefined
 */
export function toStringOrDefault(value: any, defaultValue: string): string {
    return value === undefined || value === null ? defaultValue : value;
}

/**
 * Returns either the given value or the default value
 * @param value the value to check
 * @param defaultValue the default value to return if the value is null/undefined
 * @return the given value or the given default value to return if the value is null/undefined
 */
export function orDefault<T>(value: T | null | undefined, defaultValue: T): T {
    return value
        ? value
        : defaultValue;
}


/**
 * If the given value is not undefined or null the given result will be returned. Otherwise undefined
 * @param value the value
 * @param result the value to return
 * @return the given result or undefined
 */
export function mapTo<T, R>(value: T | undefined | null, result: R): R | undefined {
    if (value === undefined || value === null) {
        return undefined;
    } else {
        return result;
    }
}

/**
 * If the given value is not undefined or null the result of the given function will be returned. Otherwise undefined
 * @param value the value
 * @param mapping the mapping function
 * @return the result of the mapping or undefined
 */
export function map<T, R>(value: T | undefined | null, mapping: (v: T) => R): R | undefined {
    if (value === undefined || value === null) {
        return undefined;
    } else {
        return mapping(value);
    }
}

/**
 *
 * @param condition the boolean condition
 * @param value the value to return
 * @return the given value only if the condition is "true", return undefined otherwise
 */
export function getIf<R>(condition: boolean | undefined | null, value: R): R | undefined {
    if (condition === true) {
        return value;
    } else {
        return undefined;
    }
}

/**
 * Calls the given function if it is not null or undefined
 * @param func the function to call
 */
export function callSafe(func: any) {
    if (func) {
        func();
    }
}
