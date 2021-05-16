import {BaseProps} from "../../../common/common";
import * as React from "react";
import {ReactElement} from "react";
import {H5Text} from "../../../base/text/Text";
import "./sidebarHeader.css"

export interface SidebarHeaderProps extends BaseProps {
    title?: string,
}

export function SidebarHeader(props: React.PropsWithChildren<SidebarHeaderProps>): ReactElement {
    return (
        <H5Text className={"sidebar-header"}>
            {props.title}
        </H5Text>
    );
}
