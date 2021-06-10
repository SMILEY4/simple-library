import React from "react";
import {VBox} from "../../../../newcomponents/layout/box/Box";
import {useItems, useItemSelection} from "../../../hooks/itemHooks";
import {ItemListEntry} from "./ItemListEntry";
import {ItemData} from "../../../../../common/commonModels";
import {SelectModifier} from "../../../../newcomponents/utils/common";

interface ItemListProps {
}

export function ItemList(props: React.PropsWithChildren<ItemListProps>): React.ReactElement {

	const {
		items,
	} = useItems();

	const {
		isSelected,
		setSelection,
		toggleSelection,
		selectRangeTo
	} = useItemSelection();

	return (
		<VBox
			fill
			padding="0-5"
			spacing="0-5"
			alignMain="start"
			alignCross="stretch"
			overflow="auto"
		>
			{items && items.map((itemData: ItemData) => <ItemListEntry
				item={itemData}
				selected={isSelected(itemData.id)}
				onSelect={(selectMod: SelectModifier) => handleSelectItem(itemData.id, selectMod)}
			/>)}
		</VBox>
	);

	function handleSelectItem(itemId: number, selectMod: SelectModifier): void {
		switch (selectMod) {
			case SelectModifier.NONE: {
				setSelection([itemId])
				break;
			}
			case SelectModifier.TOGGLE: {
				toggleSelection([itemId])
				break;
			}
			case SelectModifier.RANGE: {
				selectRangeTo(itemId, false)
				break;
			}
			case SelectModifier.ADD_RANGE: {
				selectRangeTo(itemId, true)
				break;
			}
		}
	}

}
