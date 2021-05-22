import React, {ReactElement} from "react";
import {concatClasses, getIf} from "../../../components/common/common";
import "./baseElement.css"
import "./baseElementInset.css"
import {BaseProps} from "../common";

interface BaseElementInsetProps extends BaseProps {
	disabled?: boolean,
	error?: boolean
}

export function BaseElementInset(props: React.PropsWithChildren<BaseElementInsetProps>): ReactElement {

	return (
		<div className={getClassName()} style={props.style} ref={props.forwardRef}>
			{props.children}
		</div>
	)

	function getClassName() {
		return concatClasses(
			"base-elem",
			"base-elem-inset",
			getIf(props.disabled, "base-elem-disabled"),
			getIf(props.error, "base-elem-state-error")
		)
	}

}
