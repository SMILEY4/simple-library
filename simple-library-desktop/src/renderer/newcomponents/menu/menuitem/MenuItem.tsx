import * as React from 'react';
import {ReactElement} from 'react';
import "./menuitem.css";
import {Icon, IconType} from '../../base/icon/Icon';
import {BaseProps} from "../../utils/common";
import {concatClasses, getIf} from "../../../components/common/common";
import {Label} from "../../base/label/Label";

export interface MenuItemProps extends BaseProps {
    itemId?: string,
    appendIcon?: IconType,
    disabled?: boolean,
    onAction?: () => void;
    onMouseEnter?: (event: React.MouseEvent) => void,
    onMouseExit?: (event: React.MouseEvent) => void
    __onActionInternal?: (itemId: string) => void;
}

export function MenuItem(props: React.PropsWithChildren<MenuItemProps>): ReactElement {

    return (
        <div
            className={concatClasses(props.className, "menu-item", "behaviour-no-select", getIf(props.appendIcon !== undefined, "menu-item-with-icon"))}
            onClick={handleClick}
            ref={props.forwardRef}
            key={props.itemId}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseExit}
        >
            <Label noSelect smallIcon disabled={props.disabled}>
                {props.children}
            </Label>
            <div className={"menu-item-icon"}>
                {props.appendIcon ? <Icon type={props.appendIcon} size={"0-75"} disabled={props.disabled}/> : null}
            </div>
        </div>
    );

    function handleClick() {
        if (props.disabled !== true && props.onAction) {
            props.onAction();
        }
        if (props.disabled !== true && props.__onActionInternal) {
            props.__onActionInternal(props.itemId);
        }
    }
}
