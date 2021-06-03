import {AlignCross, AlignMain, BaseProps, Fill, Size} from "../../common/common";
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
            fill={Fill.TRUE}
            borderBox
        >
            {props.children}
        </VBox>
    );

}
