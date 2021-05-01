import { addPropsToChildren, BaseProps } from '../../common/common';
import * as React from 'react';
import { ReactElement } from 'react';
import "./contextmenu.css";
import { getChildrenOfSlot } from '../../base/slot/Slot';
import { Menu } from '../menu/Menu';
import { useContextMenu } from './contextMenuHook';
import { ContextMenu } from './ContextMenu';

export interface ContextMenuWrapperProps extends BaseProps {
    onAction?: (itemId: string) => void;
}

export function ContextMenuWrapper(props: React.PropsWithChildren<ContextMenuWrapperProps>): ReactElement {

    const {
        cmTargetRef,
        cmMenuRef,
        cmPos,
        isShowContextMenu,
        closeContextMenu,
    } = useContextMenu();

    return (
        <div ref={cmTargetRef}>
            {getTargetChildren()}
            {isShowContextMenu && (
                // <ContextMenu>
                //     {getMenuChildren()}
                // </ContextMenu>
                <div className={"context-menu"} style={{ top: cmPos.y, left: cmPos.x }} ref={cmMenuRef}>
                    {getMenuChildren()}
                </div>
            )}
        </div>
    );

    function getTargetChildren(): ReactElement[] {
        return getChildrenOfSlot(props.children, "target");
    }

    function getMenuChildren(): ReactElement[] {
        return addPropsToChildren(
            getChildrenOfSlot(props.children, "menu"),
            (prevProps: any) => ({ ...prevProps, __onActionInternal: handleMenuItemAction }),
            (child: ReactElement) => child.type === Menu,
        );
    }

    function handleMenuItemAction(itemId: string) {
        if (cmTargetRef.current) {
            closeContextMenu();
        }
        if (props.onAction) {
            props.onAction(itemId);
        }
    }

}

