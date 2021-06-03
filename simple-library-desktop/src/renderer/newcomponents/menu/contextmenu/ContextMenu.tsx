import * as React from 'react';
import {MutableRefObject, ReactElement} from 'react';
import {BaseProps} from "../../utils/common";
import {ContextMenuBase} from "./ContextMenuBase";
import {componentLifecycle} from "../../../app/common/utils/functionalReactLifecycle";
import {useContextMenu} from "./contextMenuHook";

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

    componentLifecycle(
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
            onAction={(itemId: string) => {
                closeContextMenu();
                props.onAction && props.onAction(itemId)
            }}
        >
            {props.children}
        </ContextMenuBase>
    );

    function handleOnContextMenu(event: any) {
        if (props.refTarget && props.refTarget.current && props.refTarget.current.contains(event.target)) {
            event.preventDefault;
            event.stopPropagation();
            openContextMenu(event.pageX, event.pageY);
        }
    }

}
