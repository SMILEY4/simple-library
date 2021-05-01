import * as React from 'react';
import { MutableRefObject, ReactElement } from 'react';
import { addPropsToChildren, BaseProps } from '../../common/common';
import { Manager, Popper, Reference } from 'react-popper';
import { ToggleButton } from '../../input/togglebutton/ToggleButton';
import { sameWidthModifier } from '../../common/popperUtils';
import { useClickOutside, useStateRef } from '../../common/commonHooks';
import { getChildrenOfSlot, getFirstSlot } from '../../base/slot/Slot';
import { Menu } from '../menu/Menu';


export const SLOT_BUTTON = "button";
export const SLOT_MENU = "menu";

export interface MenuButtonProps extends BaseProps {
    switchContent?: boolean,
    keepSize?: boolean,
    onAction?: (itemId: string) => void;
}

export function MenuButton(props: React.PropsWithChildren<MenuButtonProps>): ReactElement {

    const [open, setOpen, refOpen] = useStateRef(false);
    const menuRef: MutableRefObject<any> = useClickOutside(handleClickOutside);

    return (
        <Manager>
            <Reference>
                {({ ref }) => (
                    <ToggleButton
                        switchContent={props.switchContent}
                        keepSize={props.keepSize}
                        forwardRef={ref}
                        onToggle={setOpen}
                        selected={open}
                        forceState
                    >
                        {getButtonChildren()}
                    </ToggleButton>
                )}
            </Reference>
            {open && (
                <Popper placement={"bottom"} modifiers={[sameWidthModifier]}>
                    {({ ref, style, placement }) => (
                        <div ref={ref} style={{ ...style, zIndex: 10 }} data-placement={placement}>
                            <div ref={menuRef} style={{ display: 'inline-block', minWidth: "100%" }}>
                                {getMenuChildren()}
                            </div>
                        </div>
                    )}
                </Popper>
            )}
        </Manager>
    );

    function getButtonChildren(): any {
        return getFirstSlot(props.children, SLOT_BUTTON);
    }

    function getMenuChildren(): any {
        return addPropsToChildren(
            getChildrenOfSlot(props.children, SLOT_MENU),
            (prevProps: any) => ({ ...prevProps, onAction: handleMenuItemAction }),
            (child: ReactElement) => child.type === Menu,
        );
    }

    function handleMenuItemAction(itemId: string) {
        setOpen(false);
        if (props.onAction) {
            props.onAction(itemId);
        }
    }

    function handleClickOutside() {
        if (refOpen.current) {
            setOpen(false);
        }
    }

}
