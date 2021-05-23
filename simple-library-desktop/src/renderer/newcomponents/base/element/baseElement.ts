import {BaseProps} from "../common";

export interface BaseElementProps extends BaseProps {
	error?: boolean,
	groupPos?: "left" | "right" | "center"
}