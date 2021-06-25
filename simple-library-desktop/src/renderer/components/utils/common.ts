import * as React from 'react';
import {CSSProperties, ReactElement, ReactNode} from 'react';

export interface BaseProps {
	className?: string,
	forwardRef?: any,
	style?: CSSProperties,
	focusable?: boolean
}

export interface ClickableProps {
	onClick?: () => void
}

export type Size = "0"
	| "0-15"
	| "0-25"
	| "0-5"
	| "0-75"
	| "1"
	| "1-5"
	| "2"
	| "3"
	| "4"
	| "6"
	| "8"
	| "12"
	| "16"
	| "24"
	| "32"
	| "40"
	| "48"

export function addClass(element: any, className: string): void {
	const classNames: string[] = element.className.split(" ")
	if (classNames.indexOf(className) === -1) {
		element.className = [...classNames, className].join(" ")
	}
}

export function removeClass(element: any, className: string): void {
	const classNames: string[] = element.className.split(" ")
	if (classNames.indexOf(className) !== -1) {
		element.className = classNames.filter(name => name !== className).join(" ")
	}
}

/**
 * for primary shortcuts, e.g.
 * 	- "[shortcut] + s" => save
 * 	- "[shortcut] click" => "toggle selection
 */
export function isShortcut(event: React.MouseEvent | React.KeyboardEvent) {
	return process.platform === "darwin" ? event.metaKey : event.ctrlKey;
}

/**
 * for modifying shortcuts / actions, e.g.
 *  - "[mod] + click" => select range
 *  - "[shorcut] + [mod] + click" => toggle selection range
 */
export function isModifierShortcut(event: React.MouseEvent | React.KeyboardEvent) {
	return event.shiftKey;
}

export enum SelectModifier {
	NONE = "none",
	TOGGLE = "toggle",
	RANGE = "range",
	ADD_RANGE = "add_range"
}

export function getSelectModifier(event: React.MouseEvent): SelectModifier {
	const toggleKey: boolean = isShortcut(event);
	const rangeKey: boolean = isModifierShortcut(event);
	switch (true) {
		case !toggleKey && !rangeKey:
			return SelectModifier.NONE
		case toggleKey && !rangeKey:
			return SelectModifier.TOGGLE
		case !toggleKey && rangeKey:
			return SelectModifier.RANGE
		case toggleKey && rangeKey:
			return SelectModifier.ADD_RANGE
	}
}

export function isCopyMode(event: React.DragEvent): boolean {
	return isShortcut(event)
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

export function mapOrDefault<T, R>(value: T | undefined | null, defaultValue: T, mapping: (v: T) => R): R {
	return map(orDefault(value, defaultValue), mapping);
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
export function addPropsToChildren(children: ReactNode | ReactNode[], props: (prevProps: any, index: number) => any, filter?: (child: React.ReactElement) => boolean): any[] {
	return React.Children.map(children, (child: any, index: number) => {
		if (React.isValidElement(child)) {
			if (!filter || (filter && filter(child))) {
				return React.cloneElement(child, props(child.props, index));
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

export function childrenCount(children: ReactNode | ReactNode[]): number {
	return React.Children.count(children);
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

export function chooseRandom<T>(values: T[]): T {
	return values[Math.floor(Math.random() * values.length)];
}
