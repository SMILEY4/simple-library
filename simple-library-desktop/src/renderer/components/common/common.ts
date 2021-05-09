import * as React from 'react';
import {ReactElement, ReactNode} from 'react';

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

export enum ColorType {

    BACKGROUND_0 = "background-0",
    BACKGROUND_1 = "background-1",

    BASE_0 = "base-0",
    BASE_1 = "base-1",
    BASE_2 = "base-2",
    BASE_3 = "base-3",
    BASE_4 = "base-4",

    PRIMARY_0 = "primary-0",
    PRIMARY_1 = "primary-1",
    PRIMARY_2 = "primary-2",
    PRIMARY_3 = "primary-3",
    PRIMARY_4 = "primary-4",

    SUCCESS_0 = "success-0",
    SUCCESS_1 = "success-1",
    SUCCESS_2 = "success-2",
    SUCCESS_3 = "success-3",
    SUCCESS_4 = "success-4",

    ERROR_0 = "error-0",
    ERROR_1 = "error-1",
    ERROR_2 = "error-2",
    ERROR_3 = "error-3",
    ERROR_4 = "error-4",

    WARN_0 = "warn-0",
    WARN_1 = "warn-1",
    WARN_2 = "warn-2",
    WARN_3 = "warn-3",
    WARN_4 = "warn-4",

    TEXT_0 = "text-0",
    TEXT_1 = "text-1",
    TEXT_2 = "text-2",
    TEXT_3 = "text-3",
    TEXT_ON_COLOR = "text-on-color",

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

export interface BaseProps {
    className?: string,
    style?: React.CSSProperties,
    forwardRef?: any;
}

export interface ClickableProps {
    onClick?: (event: React.MouseEvent) => void
}

export interface MouseOverProps {
    onMouseEnter?: (event: React.MouseEvent) => void,
    onMouseExit?: (event: React.MouseEvent) => void
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

/**
 * Adds the given properties to the clones of the given children
 * @param children the children
 * @param props the properties to add
 * @param filter add the props only to the children that pass this filter
 */
export function addPropsToChildren(children: ReactNode | ReactNode[], props: (prevProps: any) => any, filter?: (child: React.ReactElement) => boolean): any[] {
    return React.Children.map(children, (child: any) => {
        if (React.isValidElement(child)) {
            if (filter && filter(child)) {
                return React.cloneElement(child, props(child.props));
            } else {
                return child;
            }
        } else {
            return child;
        }
    });
}

export function hasChildrenOfType(children: ReactNode | ReactNode[], type: any): boolean {
    return React.Children.toArray(children)
        .filter(child => React.isValidElement(child))
        .map(child => child as ReactElement)
        .some(child => child.type === type);
}

export function mergeRefs(...refs: any[]) {
    const filteredRefs = refs.filter(Boolean);
    if (!filteredRefs.length) {
        return null;
    }
    if (filteredRefs.length === 0) {
        return filteredRefs[0];
    }
    return (inst: any) => {
        for (const ref of filteredRefs) {
            if (typeof ref === 'function') {
                ref(inst);
            } else if (ref) {
                ref.current = inst;
            }
        }
    };
}

export function getReactElements(children: ReactNode | ReactNode[]): ReactElement[] {
    return React.Children
        .toArray(children)
        .filter(child => React.isValidElement(child))
        .map(child => child as React.ReactElement);
}

export function fillArray<T>(value: T, len: number) {
    const arr: T[] = [];
    for (let i = 0; i < len; i++) {
        arr.push(value);
    }
    return arr;
}


export function clamp(min: number, value: number, max: number): number {
    return Math.max(min, Math.min(value, max));
}