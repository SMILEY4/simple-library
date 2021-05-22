import React, {CSSProperties, MutableRefObject, ReactElement} from "react";
import {concatClasses, getIf, map} from "../../../components/common/common";
import "./baseElement.css"
import "./baseElementRaised.css"

interface BaseElementRaisedProps {
	interactive?: boolean,
	disabled?: boolean,
	variant?: "primary" | "success" | "error" | "warn"
	error?: boolean,

	className?: string,
	forwardRef?: MutableRefObject<any>,
	style?: CSSProperties,
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
