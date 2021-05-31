import {BaseProps} from "../../../utils/common";
import React, {ReactElement} from "react";
import {concatClasses} from "../../../../components/common/common";
import "./sidebarTitle.css"

export interface SidebarTitleProps extends BaseProps {
	text: string;
}

export function SidebarTitle(props: React.PropsWithChildren<SidebarTitleProps>): ReactElement {
	return (
		<div className={concatClasses(props.className, "sidebar-title")}>
			{props.text}
		</div>
	)
}
