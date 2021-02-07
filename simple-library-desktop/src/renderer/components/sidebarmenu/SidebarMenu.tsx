import * as React from 'react';
import { AlignMain, concatClasses, map } from '../common';
import "./sidebarMenu.css"

export interface SidebarMenuProps {
    align: AlignMain
}

export function SidebarMenu(props: React.PropsWithChildren<SidebarMenuProps>): React.ReactElement {

    function getClassNames(): string {
        return concatClasses(
            "sidebar-menu",
            map(props.align, (align) => 'sidebar-menu-align-' + align),
        );
    }

    return (
        <div className={getClassNames()}>
            {props.children}
        </div>
    );
}
