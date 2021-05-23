import React, {ReactElement} from "react";
import {concatClasses, getIf, map} from "../../../components/common/common";
import "./baseElement.css"
import "./baseElementRaised.css"
import {BaseProps} from "../common";

interface BaseElementRaisedProps extends BaseProps {
	interactive?: boolean,
	disabled?: boolean,
	variant?: "info" | "success" | "error" | "warn"
	error?: boolean,
}

export function BaseElementRaised(props: React.PropsWithChildren<BaseElementRaisedProps>): ReactElement {

	return (
		<div className={getClassName()} style={props.style} ref={props.forwardRef}>
			{props.children}
		</div>
	)

	function getClassName() {
		return concatClasses(
			"base-elem",
			"base-elem-raised",
			getIf(props.interactive, "base-elem-interactive"),
			getIf(props.disabled, "base-elem-disabled"),
			map(props.variant, variant => "base-elem-" + variant),
			getIf(props.error, "base-elem-state-error")
		)
	}

}
