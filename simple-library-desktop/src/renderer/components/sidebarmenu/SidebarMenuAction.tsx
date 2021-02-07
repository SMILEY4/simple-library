import * as React from 'react';

export interface SidebarMenuActionEntryProps {
    onClick?: () => void
}

export function SidebarMenuActionEntry(props: React.PropsWithChildren<SidebarMenuActionEntryProps>): React.ReactElement {
    return (
        <div className={"sidebar-menu-entry-action"} onClick={props.onClick}>
            {props.children}
        </div>
    );
}
