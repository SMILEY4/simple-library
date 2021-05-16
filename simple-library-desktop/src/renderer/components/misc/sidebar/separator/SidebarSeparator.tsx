import {AlignCross, AlignMain, BaseProps, Size} from "../../../common/common";
import * as React from "react";
import {ReactElement} from "react";
import {HBox} from "../../../layout/box/Box";
import "./sidebarSeparator.css"
import {H5Text} from "../../../base/text/Text";

export interface SidebarSeparatorProps extends BaseProps {
    title?: string,
}

export function SidebarSeparator(props: React.PropsWithChildren<SidebarSeparatorProps>): ReactElement {
    if (props.title) {
        return (
            <HBox
                className={"sidebar-titled-separator"}
                alignMain={AlignMain.SPACE_BETWEEN}
                alignCross={AlignCross.CENTER}
                spacing={Size.S_0_25}
            >
                <div className={"sidebar-separator-line"}/>
                <H5Text className={"sidebar-separator-header"}>{props.title}</H5Text>
                <div className={"sidebar-separator-line"}/>
            </HBox>
        );
    } else {
        return (
            <div className={"sidebar-separator sidebar-separator-line"}/>
        );
    }
}
