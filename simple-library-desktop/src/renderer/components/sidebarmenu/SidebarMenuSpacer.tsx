import * as React from 'react';

export interface SidebarMenuSpacerEntryProps {
}

export function SidebarMenuSpacerEntry(props: React.PropsWithChildren<SidebarMenuSpacerEntryProps>): React.ReactElement {
    return (
        <div className={"sidebar-menu-entry-spacer"}>
        </div>
    );
}
