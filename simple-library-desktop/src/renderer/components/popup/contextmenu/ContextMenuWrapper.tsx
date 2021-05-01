import { addPropsToChildren, BaseProps } from '../../common/common';
import * as React from 'react';
import { MutableRefObject, ReactElement, useState } from 'react';
import { componentLifecycle } from '../../../app/common/utils/functionalReactLifecycle';
import { useClickOutside } from '../../common/commonHooks';
import "./contextmenu.css";
import { getChildrenOfSlot } from '../../base/slot/Slot';
import { Menu } from '../menu/Menu';

export interface ContextMenuWrapperProps extends BaseProps {
    onAction?: (itemId: string) => void;
}

export function ContextMenuWrapper(props: React.PropsWithChildren<ContextMenuWrapperProps>): ReactElement {

    const { cmTargetRef, cmPos, isShowContextMenu, closeContextMenu } = useContextMenu();

    return (
        <div ref={cmTargetRef}>
            {getTargetChildren()}
            {isShowContextMenu && (
                <div className={"context-menu"} style={{ top: cmPos.y, left: cmPos.x }}>
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
            (prevProps: any) => ({ ...prevProps, onAction: handleMenuItemAction }),
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


export function useContextMenu() {

    const targetRef: MutableRefObject<any> = useClickOutside(handleClickOutside);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [show, setShow] = useState(false);

    componentLifecycle(
        () => document.addEventListener("contextmenu", handleContextMenu),
        () => document.removeEventListener("contextmenu", handleContextMenu),
    );

    function handleClickOutside() {
        if (targetRef.current) {
            close();
        }
    }

    function handleContextMenu(event: any): void {
        if (targetRef && targetRef.current && targetRef.current.contains(event.target)) {
            event.preventDefault();
            event.stopPropagation();
            setX(event.pageX);
            setY(event.pageY);
            setShow(true);

            // const pageWidth  = document.documentElement.scrollWidth;
            // const pageHeight = document.documentElement.scrollHeight;
            //
            // console.log("click at " + event.pageX +","+ event.pageY + "   size: " + pageWidth + ","+ pageHeight)
        }
    }

    return {
        cmTargetRef: targetRef,
        cmPos: { x: x + "px", y: y + "px" },
        isShowContextMenu: show,
        closeContextMenu: () => setShow(false),
    };
}
