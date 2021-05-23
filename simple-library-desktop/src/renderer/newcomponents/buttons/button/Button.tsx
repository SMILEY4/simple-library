import {BaseProps} from "../../common";
import React from "react";
import {BaseElementRaised} from "../../base/element/BaseElementRaised";
import {Label} from "../../base/label/Label";
import {concatClasses} from "../../../components/common/common";
import "./button.css"

export interface ButtonProps extends BaseProps {
	disabled?: boolean,
	error?: boolean,
	variant?: "info" | "success" | "error" | "warn",
	groupPos?: "left" | "right" | "center"
	onClick?: () => void
}

export function Button(props: React.PropsWithChildren<ButtonProps>): React.ReactElement {

	return (
		<BaseElementRaised
			className={concatClasses("button", props.className)}
			disabled={props.disabled}
			error={props.error}
			variant={props.variant}
			groupPos={props.groupPos}
			onClick={props.onClick}
			style={props.style}
			forwardRef={props.forwardRef}
			interactive
		>
			<Label
				type="body"
				variant={getLabelVariant()}
				disabled={props.disabled}
				noSelect
				overflow="cutoff"
			>
				{props.children}
			</Label>
		</BaseElementRaised>
	);

	function getLabelVariant() {
		switch (props.variant) {
			case "info":
			case "success":
			case "error":
			case "warn":
				return "on-variant"
			default:
				return "primary"
		}
	}
}
