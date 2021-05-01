import * as React from 'react';
import { MutableRefObject, ReactElement } from 'react';
import { BaseProps } from '../../common/common';
import { Manager, Popper, Reference } from 'react-popper';
import "./menubutton.css";
import { ToggleButton } from '../togglebutton/ToggleButton';
import { sameWidthModifier } from '../../common/popperUtils';
import { useClickOutside, useStateRef } from '../../common/commonHooks';


export interface MenuButtonProps extends BaseProps {
}


export function MenuButton(props: React.PropsWithChildren<MenuButtonProps>): ReactElement {

    const [open, setOpen, refOpen] = useStateRef(false);
    const menuRef: MutableRefObject<any> = useClickOutside(handleClickOutside);

    return (
        <Manager>

            <Reference>
                {({ ref }) => (
                    <ToggleButton forwardRef={ref} onToggle={setOpen} selected={open} forceState>
                        {getChildrenButton()}
                    </ToggleButton>
                )}
            </Reference>

            {open && (
                <Popper placement={"bottom"} modifiers={[sameWidthModifier]}>
                    {({ ref, style, placement }) => (
                        <div ref={ref} style={{ ...style, zIndex: 10 }} data-placement={placement}>
                            <div ref={menuRef} style={{ display: 'inline-block', minWidth: "100%" }}>
                                {getChildrenMenu()}
                            </div>
                        </div>
                    )}
                </Popper>
            )}

        </Manager>
    );

    function getChildrenButton() {
        return React.Children
            .toArray(props.children)
            .find(child => React.isValidElement(child) && (child as React.ReactElement).props.__TYPE === "ButtonSlot");
    }

    function getChildrenMenu() {
        return React.Children
            .toArray(props.children)
            .find(child => React.isValidElement(child) && (child as React.ReactElement).props.__TYPE === "MenuSlot");
    }

    function handleClickOutside() {
        if (refOpen.current) {
            setOpen(false);
        }
    }

}


interface MenuButtonChildrenMarkerProps {
    __TYPE?: string
}

function ButtonSlot(props: React.PropsWithChildren<MenuButtonChildrenMarkerProps>): ReactElement {
    return <>{props.children}</>;
}

ButtonSlot.defaultProps = {
    __TYPE: "ButtonSlot",
};


function MenuSlot(props: React.PropsWithChildren<MenuButtonChildrenMarkerProps>): ReactElement {
    return <>{props.children}</>;
}

MenuSlot.defaultProps = {
    __TYPE: "MenuSlot",
};


MenuButton.ButtonSlot = ButtonSlot;
MenuButton.MenuSlot = MenuSlot;
