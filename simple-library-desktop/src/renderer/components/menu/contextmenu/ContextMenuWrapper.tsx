import * as React from 'react';
import {ReactElement, useRef} from 'react';
import "./contextmenu.css";
import {ContextMenu} from './ContextMenu';
import {BaseProps} from "../../utils/common";
import {getChildrenOfSlot} from "../../base/slot/Slot";

export interface ContextMenuWrapperProps extends BaseProps {
    modalRootId?: string,
    onOpenMenu?: () => void,
    onAction?: (itemId: string) => void;
}

export function ContextMenuWrapper(props: React.PropsWithChildren<ContextMenuWrapperProps>): ReactElement {

    const refTarget = useRef(null);

    return (
        <div ref={refTarget}>
            {getTargetChildren()}
            <ContextMenu
                refTarget={refTarget}
                modalRootId={props.modalRootId}
                onOpenMenu={props.onOpenMenu}
                onAction={props.onAction}
            >
                {getMenuChildren()}
            </ContextMenu>
        </div>
    );

    function getTargetChildren(): ReactElement[] {
        return getChildrenOfSlot(props.children, "target");
    }

    function getMenuChildren(): ReactElement[] {
        return getChildrenOfSlot(props.children, "menu");
    }

}

