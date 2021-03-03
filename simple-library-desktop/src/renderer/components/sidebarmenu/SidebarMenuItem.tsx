import * as React from 'react';
import { ReactElement } from 'react';
import "./sidebarMenuItem.css";
import { CaptionText } from '../text/Text';
import { concatClasses } from '../common';

export interface SidebarMenuItemProps {
    icon?: ReactElement | ReactElement[],
    title: string,
    label?: string,
    selected?: boolean,
    onClick?: () => void,
}

export function SidebarMenuItem(props: React.PropsWithChildren<SidebarMenuItemProps>): React.ReactElement {

    function getClassNames(): string {
        return concatClasses(
            "sidebar-menu-item",
            "behaviour-button",
            (props.selected ? "sidebar-menu-item-selected" : null),
        );
    }

    return (
        <div className={getClassNames()} onClick={props.onClick}>
            <div className={"sidebar-menu-item-title"}>
                {props.icon ? props.icon : null}
                {props.title}
            </div>
            <CaptionText className={"sidebar-menu-item-label"}>{props.label}</CaptionText>
        </div>
    );
}
