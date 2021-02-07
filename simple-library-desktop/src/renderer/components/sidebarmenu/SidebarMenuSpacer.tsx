import * as React from 'react';

export interface SidebarMenuSpacerProps {
}

export function SidebarMenuSpacer(props: React.PropsWithChildren<SidebarMenuSpacerProps>): React.ReactElement {
    return (
        <div className={"sidebar-menu-entry-spacer"}>
        </div>
    );
}
