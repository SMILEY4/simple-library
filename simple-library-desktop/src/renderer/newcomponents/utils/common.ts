import {CSSProperties, useState} from "react";

export interface BaseProps {
	className?: string,
	forwardRef?: any,
	style?: CSSProperties,
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