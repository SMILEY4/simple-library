import { BaseProps, concatClasses, getIf } from '../../common/common';
import * as React from 'react';
import { MutableRefObject, ReactElement, useRef, useState } from 'react';
import { MenuItem } from '../menuitem/MenuItem';
import { Manager, Popper, Reference } from 'react-popper';
import { Menu } from '../menu/Menu';
import { getChildrenOfSlot } from '../../base/slot/Slot';
import { Icon, IconType } from '../../base/icon/Icon';
import "./submenuitem.css";

export const SLOT_ITEM = "item";
export const SLOT_MENU = "menu";

export interface SubMenuItemProps extends BaseProps {
    itemId?: string,
    __onActionInternal?: (itemId: string) => void,
    onAction?: (itemId: string) => void,
}

export function SubMenuItem(props: React.PropsWithChildren<SubMenuItemProps>): ReactElement {

    const [isOpen, setOpen] = useState(false);
    const menuRef: MutableRefObject<any> = useRef(null);

    return (
        <Manager>
            <Reference>
                {({ ref }) => (
                    <MenuItem
                        className={concatClasses("sub-menu", getIf(isOpen, "sub-menu-open"))}
                        onMouseEnter={handleEnterItem}
                        onMouseExit={handleExitItem}
                        icon={IconType.CARET_RIGHT}
                        forwardRef={ref}
                    >
                        {getChildrenItem()}
                    </MenuItem>
                )}
            </Reference>
            {isOpen && (
                <Popper placement={"right-start"}>
                    {({ ref, style, placement }) => (
                        <div ref={ref} style={{ ...style, zIndex: 10 }} data-placement={placement}>
                            <div
                                ref={menuRef}
                                style={{ display: 'inline-block', minWidth: "100%" }}
                                onMouseEnter={handleEnterMenu}
                                onMouseLeave={handleExitMenu}
                            >
                                <Menu onAction={handleItemAction}>
                                    {getChildrenMenu()}
                                </Menu>
                            </div>
                        </div>
                    )}
                </Popper>
            )}
        </Manager>
    );

    function getChildrenItem(): ReactElement[] {
        return getChildrenOfSlot(props.children, SLOT_ITEM);
    }

    function getChildrenMenu(): ReactElement[] {
        return getChildrenOfSlot(props.children, SLOT_MENU);
    }

    function handleItemAction(itemId: string) {
        setOpen(false);
        if (props.onAction) {
            props.onAction(itemId);
        }
        if (props.__onActionInternal) {
            props.__onActionInternal(itemId);
        }
    }

    function handleEnterItem() {
        setOpen(true);
    }

    function handleExitItem() {
        setOpen(false);
    }

    function handleEnterMenu() {
        setOpen(true);
    }

    function handleExitMenu() {
        setOpen(false);
    }

}
