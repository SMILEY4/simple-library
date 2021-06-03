import {BaseProps} from "../../utils/common";
import * as React from "react";
import {ReactElement} from "react";
import "./toolbar.css"
import {concatClasses} from "../../../components/common/common";

interface ToolbarProps extends BaseProps {
}

export function Toolbar(props: React.PropsWithChildren<ToolbarProps>): ReactElement {

	return (
		<div
			className={concatClasses(props.className, "toolbar")}
			style={props.style}
			ref={props.forwardRef}
		>
			{props.children}
		</div>
	);

}
