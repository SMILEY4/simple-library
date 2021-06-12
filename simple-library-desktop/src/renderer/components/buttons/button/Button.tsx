import {BaseProps} from "../../utils/common";
import React from "react";
import {BaseElementRaised} from "../../base/element/BaseElementRaised";
import {Label} from "../../base/label/Label";
import {concatClasses, getIf} from "../../utils/common";
import "./button.css"

export interface ButtonProps extends BaseProps {
	disabled?: boolean,
	error?: boolean,
	variant?: "info" | "success" | "error" | "warn",
	groupPos?: "left" | "right" | "center"
	square?: boolean,
	ghost?: boolean,
	onAction?: () => void
}

export function Button(props: React.PropsWithChildren<ButtonProps>): React.ReactElement {

	return (
		<BaseElementRaised
			className={concatClasses(props.className, "button", getIf(props.square, "button-square"))}
			disabled={props.disabled}
			error={props.error}
			variant={props.variant}
			ghost={props.ghost}
			groupPos={props.groupPos}
			onClick={props.onAction}
			style={props.style}
			forwardRef={props.forwardRef}
			interactive
		>
			<Label
				type="body"
				variant={getLabelVariant()}
				disabled={props.disabled}
				noSelect
				overflow="nowrap-hidden"
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
