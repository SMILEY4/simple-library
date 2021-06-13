import * as React from 'react';
import {MutableRefObject, ReactElement} from 'react';
import {BaseProps} from "../../utils/common";
import {ContextMenuBase} from "./ContextMenuBase";
import {useContextMenu} from "./contextMenuHook";
import {useLifecycle} from "../../utils/commonHooks";

export interface ContextMenuProps extends BaseProps {
    modalRootId?: string,
    refTarget: MutableRefObject<any>,
    onOpenMenu?: () => void,
    onAction?: (itemId: string) => void,
}

export function ContextMenu(props: React.PropsWithChildren<ContextMenuProps>): ReactElement {

    const {
        showContextMenu,
        contextMenuX,
        contextMenuY,
        contextMenuRef,
        openContextMenu,
        closeContextMenu
    } = useContextMenu();

    useLifecycle(
        () => document.addEventListener("contextmenu", handleOnContextMenu),
        () => document.removeEventListener("contextmenu", handleOnContextMenu),
    );

    return (
        <ContextMenuBase
            modalRootId={props.modalRootId}
            show={showContextMenu}
            pageX={contextMenuX}
            pageY={contextMenuY}
            menuRef={contextMenuRef}
            onOpenMenu={props.onOpenMenu}
            onAction={handleMenuAction}
        >
            {props.children}
        </ContextMenuBase>
    );

    function handleOnContextMenu(event: any): void {
        if (props.refTarget && props.refTarget.current && props.refTarget.current.contains(event.target)) {
            event.preventDefault;
            event.stopPropagation();
            openContextMenu(event.pageX, event.pageY);
        }
    }

    function handleMenuAction(itemId: string): void {
        closeContextMenu();
        props.onAction && props.onAction(itemId)
    }

}
