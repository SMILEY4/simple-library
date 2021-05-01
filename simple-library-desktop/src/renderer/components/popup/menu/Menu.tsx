import { addPropsToChildren, AlignCross, AlignMain, BaseProps, ColorType } from '../../common/common';
import * as React from 'react';
import { ReactElement } from 'react';
import "./menu.css";
import { Pane } from '../../base/pane/Pane';
import { VBox } from '../../layout/box/Box';
import { MenuItem } from '../menuitem/MenuItem';

export interface MenuProps extends BaseProps {
    onAction?: (itemId: string) => void
}

export function Menu(props: React.PropsWithChildren<MenuProps>): ReactElement {

    return (
        <Pane outline={ColorType.BASE_1} fillDefault={ColorType.BACKGROUND_1} className={"menu with-shadow-1"}>
            <VBox alignMain={AlignMain.START} alignCross={AlignCross.START}>
                {getModifiedChildren()}
            </VBox>
        </Pane>
    );

    function getModifiedChildren() {
        return addPropsToChildren(
            props.children,
            { onAction: onMenuItemAction },
            (child: ReactElement) => child.type === MenuItem,
        );
    }

    function onMenuItemAction(itemId: string) {
        if (props.onAction) {
            props.onAction(itemId);
        }
    }

}
