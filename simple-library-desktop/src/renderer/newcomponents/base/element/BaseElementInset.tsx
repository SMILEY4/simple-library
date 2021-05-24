import React, {ReactElement} from "react";
import {concatClasses, getIf, map} from "../../../components/common/common";
import "./baseElement.css"
import "./baseElementInset.css"
import {BaseElementProps, getBaseElementClasses} from "./baseElement";

interface BaseElementInsetProps extends BaseElementProps {
	disabled?: boolean,
}

export function BaseElementInset(props: React.PropsWithChildren<BaseElementInsetProps>): ReactElement {

	return (
		<div className={getClassName()} style={props.style} ref={props.forwardRef}>
			{props.children}
		</div>
	)

	function getClassName() {
		return concatClasses(
			props.className,
			"base-elem-inset",
			getBaseElementClasses(props),
			getIf(props.disabled, "base-elem-disabled")
		)
	}

}
