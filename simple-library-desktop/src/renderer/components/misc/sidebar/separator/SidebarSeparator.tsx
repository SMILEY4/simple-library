import {BaseProps} from "../../../utils/common";
import React, {ReactElement} from "react";
import {concatClasses} from "../../../utils/common";
import "./sidebarSeparator.css"

export interface SidebarSeparatorProps extends BaseProps {
}

export function SidebarSeparator(props: React.PropsWithChildren<SidebarSeparatorProps>): ReactElement {
	return <div className={concatClasses(props.className, "sidebar-separator")}/>
}
