import { addPropsToChildren, AlignCross, AlignMain, BaseProps, ColorType, concatClasses } from '../../common/common';
import * as React from 'react';
import { ReactElement } from 'react';
import "./menu.css";
import { Pane } from '../../base/pane/Pane';
import { VBox } from '../../layout/box/Box';
import { MenuItem } from '../menuitem/MenuItem';
import { SubMenuItem } from '../submenu/SubMenuItem';

export interface MenuProps extends BaseProps {
    __onActionInternal?: (itemId: string) => void,
    onAction?: (itemId: string) => void,
}

export function Menu(props: React.PropsWithChildren<MenuProps>): ReactElement {

    return (
        <Pane
            outline={ColorType.BASE_1}
            fillDefault={ColorType.BACKGROUND_1}
            className={concatClasses("menu", "with-shadow-1", props.className)}
            style={props.style}
            forwardRef={props.forwardRef}
        >
            <VBox alignMain={AlignMain.START} alignCross={AlignCross.STRETCH}>
                {getModifiedChildren()}
            </VBox>
        </Pane>
    );

    function getModifiedChildren() {
        return addPropsToChildren(
            props.children,
            (prevProps: any) => ({ ...prevProps, __onActionInternal: onMenuItemAction }),
            (child: ReactElement) => child.type === MenuItem || child.type === SubMenuItem,
        );
    }

    function onMenuItemAction(itemId: string) {
        if (props.onAction) {
            props.onAction(itemId);
        }
        if (props.__onActionInternal) {
            props.__onActionInternal(itemId);
        }
    }

}
