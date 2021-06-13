import {BaseProps} from "../../utils/common";
import React, {MutableRefObject, ReactElement} from "react";
import "./menubutton.css"
import {Button} from "../button/Button";
import {addPropsToChildren, concatClasses} from "../../utils/common";
import {useClickOutside, useStateRef} from "../../utils/commonHooks";
import {Manager, Popper, Reference} from "react-popper";
import {Menu} from "../../menu/menu/Menu";
import {sameWidthModifier} from "../../utils/popperUtils";
import {getChildrenOfSlot, getFirstSlot} from "../../base/slot/Slot";

export const SLOT_BUTTON = "button";
export const SLOT_MENU = "menu";

export interface MenuButtonProps extends BaseProps {
	disabled?: boolean,
	error?: boolean,
	variant?: "info" | "success" | "error" | "warn",
	groupPos?: "left" | "right" | "center"
	square?: boolean,
	onAction?: (itemId: string) => void,
}

export function MenuButton(props: React.PropsWithChildren<MenuButtonProps>): React.ReactElement {

	const [open, setOpen, refOpen] = useStateRef(false);
	const menuRef: MutableRefObject<any> = useClickOutside(handleClickOutside);

	return (
		<Manager>
			<Reference>
				{({ref}) => (
					<Button
						className={concatClasses("menu-button", props.className)}
						disabled={props.disabled}
						error={props.error}
						variant={props.variant}
						groupPos={props.groupPos}
						square={props.square}
						style={props.style}
						forwardRef={ref}
						onAction={handleOnAction}
					>
						{getButtonChildren()}
					</Button>
				)}
			</Reference>
			{open && (
				<Popper placement={"bottom"} modifiers={[sameWidthModifier()]}>
					{({ref, style, placement}) => (
						<div ref={ref} style={{...style, zIndex: 10}} data-placement={placement}>
							<div ref={menuRef} style={{display: 'inline-block', minWidth: "100%"}}>
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
			(prevProps: any) => ({...prevProps, onAction: handleMenuItemAction}),
			(child: ReactElement) => child.type === Menu,
		);
	}

	function handleOnAction() {
		setOpen(!open)
	}

	function handleClickOutside() {
		if (refOpen.current) {
			setOpen(false);
		}
	}

	function handleMenuItemAction(itemId: string) {
		setOpen(false);
		if (props.onAction) {
			props.onAction(itemId);
		}
	}

}
