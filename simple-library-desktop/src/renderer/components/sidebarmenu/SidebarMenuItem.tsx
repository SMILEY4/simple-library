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
    onContextMenu?: (event: React.MouseEvent) => void

    enableDrop?: boolean,
    dropEffect?: string,
    getDropEffect?: (event: React.DragEvent) => string,
    onDragOver?: (event: React.DragEvent) => void,
    onDrop?: (event: React.DragEvent) => void
}

export function SidebarMenuItem(props: React.PropsWithChildren<SidebarMenuItemProps>): React.ReactElement {

    function getClassNames(): string {
        return concatClasses(
            "sidebar-menu-item",
            "behaviour-button",
            (props.selected ? "sidebar-menu-item-selected" : null),
        );
    }

    function getDragOverHandler(): (event: React.DragEvent) => void | undefined {
        if (props.enableDrop) {
            if (props.onDragOver) {
                return (event: React.DragEvent) => {
                    event.preventDefault();
                    props.onDragOver(event);
                };
            } else {
                return (event: React.DragEvent) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = props.getDropEffect
                        ? props.getDropEffect(event)
                        : (props.dropEffect ? props.dropEffect : "move");
                };
            }
        } else {
            return undefined;
        }
    }

    function getDropHandler(): (event: React.DragEvent) => void | undefined {
        if (props.enableDrop) {
            return (event: React.DragEvent) => {
                event.preventDefault();
                props.onDrop && props.onDrop(event);
            };
        } else {
            return undefined;
        }
    }

    return (
        <div className={getClassNames()}
             onClick={props.onClick}
             onContextMenu={props.onContextMenu}
             onDragOver={getDragOverHandler()}
             onDrop={getDropHandler()}>
            <div className={"sidebar-menu-item-title"}>
                {props.icon ? props.icon : null}
                <div className={"sidebar-menu-item-title-text"}>{props.title}</div>
            </div>
            <CaptionText className={"sidebar-menu-item-label"}>{props.label}</CaptionText>
        </div>
    );
}
