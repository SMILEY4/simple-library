import * as React from 'react';
import { H5Text } from '../text/Text';

export interface SidebarMenuSectionTitleProps {
}

export function SidebarMenuSectionTitle(props: React.PropsWithChildren<SidebarMenuSectionTitleProps>): React.ReactElement {
    return (
        <div className={"sidebar-menu-entry-section-title"}>
            <H5Text>
                {props.children}
            </H5Text>
        </div>
    );
}
