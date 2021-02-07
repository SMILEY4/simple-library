import * as React from 'react';
import { H5Text } from '../text/Text';

export interface SidebarMenuSectionTitleEntryProps {
}

export function SidebarMenuSectionTitleEntry(props: React.PropsWithChildren<SidebarMenuSectionTitleEntryProps>): React.ReactElement {
    return (
        <div className={"sidebar-menu-entry-section-title"}>
            <H5Text>
                {props.children}
            </H5Text>
        </div>
    );
}
