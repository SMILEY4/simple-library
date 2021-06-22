import * as React from 'react';
import { ReactElement } from 'react';
import "./menu.css";
import { VBox } from '../../layout/box/Box';
import {BaseProps} from "../../utils/common";
import {addPropsToChildren, concatClasses} from "../../utils/common";
import {MenuItem} from "../menuitem/MenuItem";
import {SubMenuItem} from "../submenu/SubMenuItem";

export interface MenuProps extends BaseProps {
    __onActionInternal?: (itemId: string, requestClose: boolean) => void,
    onAction?: (itemId: string) => void,
}

export function Menu(props: React.PropsWithChildren<MenuProps>): ReactElement {

    return (
        <div
            className={concatClasses(props.className, "menu", "with-shadow-1")}
            style={props.style}
            ref={props.forwardRef}
        >
            <VBox alignMain="start" alignCross="stretch">
                {getModifiedChildren()}
            </VBox>
        </div>
    );

    function getModifiedChildren() {
        return addPropsToChildren(
            props.children,
            (prevProps: any) => ({ ...prevProps, __onActionInternal: onMenuItemAction }),
            (child: ReactElement) => child.type === MenuItem || child.type === SubMenuItem,
        );
    }

    function onMenuItemAction(itemId: string, requestClose: boolean) {
        if (props.onAction) {
            props.onAction(itemId);
        }
        if (props.__onActionInternal) {
            props.__onActionInternal(itemId, requestClose);
        }
    }

}
