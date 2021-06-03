import * as React from "react";
import {ReactElement} from "react";
import {BaseProps} from "../../utils/common";
import {VBox} from "../../layout/box/Box";
import {addPropsToChildren, concatClasses, getIf} from "../../../components/common/common";
import "./sidebar.css"

export interface SidebarProps extends BaseProps {
	mini?: boolean
}

export function Sidebar(props: React.PropsWithChildren<SidebarProps>): ReactElement {

	return (
		<VBox
			className={concatClasses(props.className, "sidebar", getIf(props.mini, "sidebar-mini"))}
			alignMain="start"
			alignCross={props.mini ? "center" : "stretch"}
			spacing="0-15"
			padding="0-5"
			style={props.style}
			forwardRef={props.forwardRef}
		>
			{getModifiedChildren()}
		</VBox>
	);

	function getModifiedChildren(): ReactElement[] {
		return addPropsToChildren(props.children, prevProps => ({...prevProps, mini: props.mini}))
	}

}
