import {BaseProps} from "../../utils/common";
import React from "react";
import {BaseElementRaised} from "../../base/element/BaseElementRaised";
import {concatClasses, getIf} from "../../../components/common/common";
import "./iconButton.css"
import {Icon, IconType} from "../../base/icon/Icon";
import {Label} from "../../base/label/Label";

export interface IconButtonProps extends BaseProps {
	icon: IconType
	label?: string,
	large?: boolean,
	disabled?: boolean,
	error?: boolean,
	variant?: "info" | "success" | "error" | "warn",
	groupPos?: "left" | "right" | "center"
	ghost?: boolean,
	onAction?: () => void
}

export function IconButton(props: React.PropsWithChildren<IconButtonProps>): React.ReactElement {

	return (
		<BaseElementRaised
			className={concatClasses(
				props.className,
				"icon-button",
				getIf(props.large, "icon-button-large"),
				getIf(!!props.label, "icon-button-labeled")
			)}
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
			<Icon
				type={props.icon}
				size={props.large ? "1-5" : "1"}
				color={props.variant ? "on-variant" : "primary"}
				disabled={props.disabled}
			/>
			{props.label && (
				<Label
					type="caption"
					variant={getLabelVariant()}
					disabled={props.disabled}
					noSelect
					overflow={"nowrap-hidden"}
				>
					{props.label}
				</Label>
			)}
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
