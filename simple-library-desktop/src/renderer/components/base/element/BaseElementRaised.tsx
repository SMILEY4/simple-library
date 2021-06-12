import React, {ReactElement} from "react";
import {concatClasses, getIf, map} from "../../utils/common";
import "./baseElement.css"
import "./baseElementRaised.css"
import {BaseElementProps, getBaseElementClasses} from "./baseElement";

interface BaseElementRaisedProps extends BaseElementProps {
	interactive?: boolean,
	disabled?: boolean,
	variant?: "info" | "success" | "error" | "warn",
	ghost?: boolean,
	onClick?: () => void
}

export function BaseElementRaised(props: React.PropsWithChildren<BaseElementRaisedProps>): ReactElement {

	return (
		<div
			className={getClassName()}
			style={props.style}
			ref={props.forwardRef}
			onClick={props.disabled ? undefined : props.onClick}
		>
			{props.children}
		</div>
	)

	function getClassName() {
		return concatClasses(
			props.className,
			"base-elem-raised",
			getBaseElementClasses(props),
			getIf(props.interactive, "base-elem-interactive"),
			getIf(props.disabled, "base-elem-disabled"),
			getIf(props.ghost, "base-elem-ghost"),
			map(props.variant, variant => "base-elem-" + variant),
		)
	}

}
