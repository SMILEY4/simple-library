import * as React from 'react';
import { AlignMain, concatClasses, map } from '../common';

export interface SidebarMenuActionProps {
    align?: AlignMain
    onClick?: () => void
}

export function SidebarMenuAction(props: React.PropsWithChildren<SidebarMenuActionProps>): React.ReactElement {

    function getClassNames(): string {
        return concatClasses(
            "sidebar-menu-entry-action",
            map(props.align, (align) => 'sidebar-menu-entry-align-' + align),
        );
    }

    return (
        <div className={getClassNames()} onClick={props.onClick}>
            {props.children}
        </div>
    );
}
