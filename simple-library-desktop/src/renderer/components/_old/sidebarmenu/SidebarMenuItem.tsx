import * as React from 'react';
import { ReactElement } from 'react';
import "./sidebarMenuItem.css";
import { CaptionText } from '../../base/text/Text';
import { concatClasses } from '../../common/common';

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

    onDragStart?: (event: React.DragEvent) => void,
    draggable?: boolean,

    highlightDragOver?: boolean;
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

    const DRAG_OVER_CLASS_NAME: string = "sidebar-menu-item-drag-over";

    function handleDragOverStart(event: React.DragEvent) {
        if (props.highlightDragOver) {
            if (!event.currentTarget.className.includes(DRAG_OVER_CLASS_NAME)) {
                event.currentTarget.className = event.currentTarget.className + " " + DRAG_OVER_CLASS_NAME;
            }
        }
    }

    function handleDragOverEnd(event: React.DragEvent) {
        if (props.highlightDragOver) {
            event.currentTarget.className = event.currentTarget.className
                .replace(DRAG_OVER_CLASS_NAME, "")
                .replace("  ", " ");
        }
    }

    return (
        <div className={getClassNames()}
             onClick={props.onClick}
             onContextMenu={props.onContextMenu}
             onDragOver={getDragOverHandler()}
             onDrop={(event: React.DragEvent) => {
                 handleDragOverEnd(event);
                 getDropHandler()(event);
             }}
             onDragStart={(event: React.DragEvent) => props.onDragStart && props.onDragStart(event)}
             draggable={props.draggable}
             onDragEnter={handleDragOverStart}
             onDragLeave={handleDragOverEnd}
        >
            <div className={"sidebar-menu-item-title"}>
                {props.icon ? props.icon : null}
                <div className={"sidebar-menu-item-title-text"}>{props.title}</div>
            </div>
            <CaptionText className={"sidebar-menu-item-label"}>{props.label}</CaptionText>
        </div>
    );
}
