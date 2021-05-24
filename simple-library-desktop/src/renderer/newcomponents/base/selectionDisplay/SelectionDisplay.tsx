import {BaseProps} from "../../common";
import React from "react";
import {concatClasses, map} from "../../../components/common/common";
import "./selectionDisplay.css"

export interface SelectionDisplayProps extends BaseProps {
	align?: "left" | "right" | "center"
}

export function SelectionDisplay(props: React.PropsWithChildren<SelectionDisplayProps>): React.ReactElement {

	return (
		<div
			className={concatClasses(
				props.className,
				"selection-display",
				map(props.align, align => "selection-display-"+align),
			)}
			style={props.style}
			ref={props.forwardRef}
		>
			{props.children}
		</div>
	);

}
