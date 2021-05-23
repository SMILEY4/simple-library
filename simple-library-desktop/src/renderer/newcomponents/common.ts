import {CSSProperties, MutableRefObject} from "react";

export interface BaseProps {
	className?: string,
	forwardRef?: MutableRefObject<any>,
	style?: CSSProperties,
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