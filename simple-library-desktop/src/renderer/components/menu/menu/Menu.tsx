import * as React from "react";
import {ReactElement} from "react";
import "./menu.css";
import {VBox} from "../../layout/box/Box";
import {addPropsToChildren, BaseProps, concatClasses} from "../../utils/common";
import {MenuItem} from "../menuitem/MenuItem";
import {SubMenuItem} from "../submenu/SubMenuItem";
import {Label} from "../../base/label/Label";

export interface MenuProps extends BaseProps {
	__onActionInternal?: (itemId: string, requestClose: boolean) => void,
	onAction?: (itemId: string) => void,
	title?: string,
}

export function Menu(props: React.PropsWithChildren<MenuProps>): ReactElement {

	return (
		<div
			className={concatClasses(props.className, "menu", "with-shadow-1")}
			style={props.style}
			ref={props.forwardRef}
		>
			<VBox alignMain="start" alignCross="stretch">
				{props.title && (
                    <Label type="header-4" noSelect className="menu-title">{props.title}</Label>
                )}
				{getModifiedChildren()}
			</VBox>
		</div>
	);

	function getModifiedChildren() {
		return addPropsToChildren(
			props.children,
			(prevProps: any) => ({...prevProps, __onActionInternal: onMenuItemAction}),
			(child: ReactElement) => child.type === MenuItem || child.type === SubMenuItem
		);
	}

	function onMenuItemAction(itemId: string, requestClose: boolean) {
		if (props.onAction) {
			props.onAction(itemId);
		}
		if (props.__onActionInternal) {
			props.__onActionInternal(itemId, requestClose);
		}
	}

}
