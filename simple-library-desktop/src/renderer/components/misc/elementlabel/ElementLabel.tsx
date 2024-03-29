import {BaseProps} from "../../utils/common";
import * as React from "react";
import {ReactElement} from "react";
import {VBox} from "../../layout/box/Box";
import {Label} from "../../base/label/Label";
import {concatClasses} from "../../utils/common";

interface ElementLabelProps extends BaseProps {
	text: string
	side?: "top" | "bottom"
	disabled?: boolean,
}

export function ElementLabel(props: React.PropsWithChildren<ElementLabelProps>): ReactElement {

	return (
		<VBox
			alignMain="center"
			alignCross="stretch"
			spacing="0-25"
			className={concatClasses(props.className, "element-label")}
			style={props.style}
			forwardRef={props.forwardRef}
		>
			{(!props.side || props.side === "top") && (
				<Label type="caption" variant="secondary" disabled={props.disabled}>{props.text}</Label>
			)}
			{props.children}
			{props.side === "bottom" && (
				<Label type="caption" variant="secondary" disabled={props.disabled}>{props.text}</Label>
			)}
		</VBox>
	);

}
