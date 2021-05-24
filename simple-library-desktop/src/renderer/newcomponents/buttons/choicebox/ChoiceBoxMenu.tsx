import React, {CSSProperties, PropsWithChildren, ReactElement} from "react";
import {ChoiceBoxItem} from "./ChoiceBox";
import {BaseProps} from "../../common";
import {Menu} from "../../menu/menu/Menu";
import {MenuItem} from "../../menu/menuitem/MenuItem";
import {IconType} from "../../base/icon/Icon";

export interface ChoiceBoxMenuProps extends BaseProps {
	items: ChoiceBoxItem[]
	selectedItemId: string,
	maxVisibleItems: number,
	onItemAction: (itemId: string) => void,
}

export function ChoiceBoxMenu(props: PropsWithChildren<ChoiceBoxMenuProps>): ReactElement {

	return (
		<Menu
			onAction={props.onItemAction}
			style={getStyle()}
		>
			{props.items.map((item: ChoiceBoxItem) => {
				if (item.id === props.selectedItemId) {
					return renderSelectedMenuItem(item);
				} else {
					return renderMenuItem(item);
				}
			})}
		</Menu>
	);

	function renderSelectedMenuItem(item: ChoiceBoxItem) {
		return (
			<MenuItem itemId={item.id} key={item.id} appendIcon={IconType.CHECKMARK}>
				{item.text}
			</MenuItem>
		);
	}

	function renderMenuItem(item: ChoiceBoxItem) {
		return (
			<MenuItem itemId={item.id} key={item.id}>
				{item.text}
			</MenuItem>
		);
	}

	function getStyle(): CSSProperties {
		return props.items.length > props.maxVisibleItems
			? {
				maxHeight: "calc(var(--s-1-5)*" + props.maxVisibleItems + ")",
				overflowY: "auto",
			}
			: undefined;
	}


}