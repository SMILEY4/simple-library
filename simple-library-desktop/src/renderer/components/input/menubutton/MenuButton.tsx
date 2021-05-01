import * as React from 'react';
import { MutableRefObject, ReactElement } from 'react';
import { BaseProps } from '../../common/common';
import { Manager, Popper, Reference } from 'react-popper';
import "./menubutton.css";
import { ToggleButton } from '../togglebutton/ToggleButton';
import { sameWidthModifier } from '../../common/popperUtils';
import { useClickOutside, useStateRef } from '../../common/commonHooks';
import { getFirstSlot } from '../../base/slot/Slot';


export const SLOT_BUTTON = "button";
export const SLOT_MENU = "menu";

export interface MenuButtonProps extends BaseProps {
    switchContent?: boolean,
    keepSize?: boolean,
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
                        {getFirstSlot(props.children, SLOT_BUTTON)}
                    </ToggleButton>
                )}
            </Reference>
            {open && (
                <Popper placement={"bottom"} modifiers={[sameWidthModifier]}>
                    {({ ref, style, placement }) => (
                        <div ref={ref} style={{ ...style, zIndex: 10 }} data-placement={placement}>
                            <div ref={menuRef} style={{ display: 'inline-block', minWidth: "100%" }}>
                                {getFirstSlot(props.children, SLOT_MENU)}
                            </div>
                        </div>
                    )}
                </Popper>
            )}
        </Manager>
    );

    function handleClickOutside() {
        if (refOpen.current) {
            setOpen(false);
        }
    }

}
