import { BaseProps, concatClasses, getIf, MouseOverProps, Size } from '../../common/common';
import * as React from 'react';
import { ReactElement } from 'react';
import "./menuitem.css";
import { Icon, IconType } from '../../base/icon/Icon';

export interface MenuItemProps extends BaseProps, MouseOverProps {
    itemId?: string,
    icon?: IconType,
    onAction?: () => void;
    __onActionInternal?: (itemId: string) => void;
}

export function MenuItem(props: React.PropsWithChildren<MenuItemProps>): ReactElement {

    return (
        <div
            className={concatClasses("menu-item", "behaviour-no-select", getIf(props.icon !==undefined, "menu-item-with-icon"), props.className)}
            onClick={handleClick}
            ref={props.forwardRef}
            key={props.itemId}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseExit}
        >
            {props.children}
            <div className={"menu-item-icon"}>
                {props.icon ? <Icon type={props.icon} size={Size.S_0_75}/> : null}
            </div>
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
