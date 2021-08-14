import React, {ReactElement} from "react";
import {concatClasses, getIf, map} from "../../utils/common";
import "./baseElement.css"
import "./baseElementInset.css"
import {BaseElementProps, getBaseElementClasses} from "./baseElement";

interface BaseElementInsetProps extends BaseElementProps {
	disabled?: boolean,
	onDoubleClick?: (event: React.MouseEvent) => void,
	draggable?: boolean,
	onDragStart?: (event: React.DragEvent) => void
}

export function BaseElementInset(props: React.PropsWithChildren<BaseElementInsetProps>): ReactElement {

	return (
		<div
			className={getClassName()}
			style={props.style} ref={props.forwardRef}
			onDoubleClick={props.onDoubleClick}
			draggable={props.draggable}
			onDragStart={props.onDragStart}
		>
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
