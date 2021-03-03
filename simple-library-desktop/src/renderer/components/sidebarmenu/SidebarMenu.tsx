import * as React from 'react';
import { AlignCross, AlignMain, concatClasses, Fill, Size } from '../common';
import "./sidebarMenu.css";
import { VBox } from '../layout/Box';


export interface SidebarMenuProps {
    fillHeight?: boolean,
    className?: string,
    style?: React.CSSProperties,
}

export function SidebarMenu(props: React.PropsWithChildren<SidebarMenuProps>): React.ReactElement {

    function getClassNames(): string {
        return concatClasses(
            "sidebar-menu",
            (props.fillHeight === false ? undefined : "fill-vert"),
            props.className,
        );
    }


    return (
        <div className={getClassNames()} style={props.style}>
            <VBox fill={Fill.TRUE}
                  alignMain={AlignMain.START}
                  alignCross={AlignCross.STRETCH}
                  spacing={Size.S_1_5}
                  padding={Size.S_0_5}
                  className="sidebar-menu-content-area"
            >
                {props.children}
            </VBox>
        </div>
    );
}
