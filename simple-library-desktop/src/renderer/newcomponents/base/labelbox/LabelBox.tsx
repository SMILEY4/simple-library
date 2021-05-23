import React from "react";
import "./labelbox.css"
import {Label} from "../label/Label";
import {BaseElementFlat} from "../element/BaseElementFlat";
import {BaseProps} from "../../common";
import {concatClasses} from "../../../components/common/common";

export interface LabelBoxProps extends BaseProps {
	error?: boolean,
	type?: "header-1" | "header-2" | "header-3" | "header-4" | "body" | "caption"
	variant?: "primary" | "secondary" | "info" | "success" | "error" | "warn" | "on-variant"
	disabled?: boolean,
	italic?: boolean,
	noSelect?: boolean,
	overflow?: "wrap" | "nowrap" | "nowrap-hidden" | "cutoff"
	groupPos?: "left" | "right" | "center"
}

export function LabelBox(props: React.PropsWithChildren<LabelBoxProps>): React.ReactElement {

	return (
		<BaseElementFlat
			error={props.error}
			groupPos={props.groupPos}
			className={concatClasses("label-box", props.className)}
			style={props.style}
			forwardRef={props.forwardRef}
		>
			<Label
				type={props.type}
				variant={props.variant}
				disabled={props.disabled}
				italic={props.italic}
				noSelect={props.noSelect}
				overflow={props.overflow}
			>
				{props.children}
			</Label>
		</BaseElementFlat>
	)


}
