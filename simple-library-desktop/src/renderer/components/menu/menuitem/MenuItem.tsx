import { BaseProps, concatClasses, MouseOverProps } from '../../common/common';
import * as React from 'react';
import { ReactElement } from 'react';
import "./menuitem.css";

export interface MenuItemProps extends BaseProps, MouseOverProps {
    itemId?: string,
    onAction?: () => void;
    __onActionInternal?: (itemId: string) => void;
}

export function MenuItem(props: React.PropsWithChildren<MenuItemProps>): ReactElement {

    return (
        <div
            className={concatClasses("menu-item", "behaviour-no-select", props.className)}
            onClick={handleClick}
            ref={props.forwardRef}
            key={props.itemId}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseExit}
        >
            {props.children}
        </div>
    );

    function handleClick() {
        if (props.onAction) {
            props.onAction();
        }
        if (props.__onActionInternal) {
            props.__onActionInternal(props.itemId);
        }
    }
}
