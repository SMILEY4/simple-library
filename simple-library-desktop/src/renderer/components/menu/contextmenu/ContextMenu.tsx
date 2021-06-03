import { addPropsToChildren, BaseProps, concatClasses } from '../../common/common';
import * as React from 'react';
import { MutableRefObject, ReactElement } from 'react';
import { useContextMenu } from './contextMenuHook';
import { Menu } from '../menu/Menu';

export interface ContextMenuProps extends BaseProps {
    refTarget: MutableRefObject<any>,
    onAction?: (itemId: string) => void
}

export function ContextMenu(props: React.PropsWithChildren<ContextMenuProps>): ReactElement {

    const {
        cmTargetRef,
        cmMenuRef,
        cmPos,
        isShowContextMenu,
        closeContextMenu,
    } = useContextMenu(props.refTarget);

    return isShowContextMenu && (
        <div
            className={concatClasses("context-menu", props.className)}
            style={{
                top: cmPos.y,
                left: cmPos.x,
                ...props.style,
            }}
            ref={cmMenuRef}
        >
            {getModifiedChildren()}
        </div>
    );

    function getModifiedChildren(): ReactElement[] {
        return addPropsToChildren(
            props.children,
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
