import {AlignCross, AlignMain, BaseProps, Size} from "../../common/common";
import * as React from "react";
import {ReactElement} from "react";
import "./sidebar.css"
import {VBox} from "../../layout/box/Box";

export interface SidebarProps extends BaseProps {
}

export function Sidebar(props: React.PropsWithChildren<SidebarProps>): ReactElement {

    return (
        <VBox
            className={"sidebar"}
            alignMain={AlignMain.START}
            alignCross={AlignCross.STRETCH}
            spacing={Size.S_0_25}
            padding={Size.S_0_5}
        >
            {props.children}
        </VBox>
    );

}
