import React from "react";
import {VBox} from "../../../../newcomponents/layout/box/Box";
import {useItems, useItemSelection} from "../../../hooks/itemHooks";
import {ItemListEntry} from "./ItemListEntry";
import {ItemData} from "../../../../../common/commonModels";
import {isCopyMode, SelectModifier} from "../../../../newcomponents/utils/common";
import {DragAndDropItems} from "../../../common/dragAndDrop";
import {useCollections} from "../../../hooks/collectionHooks";

interface ItemListProps {
}

export function ItemList(props: React.PropsWithChildren<ItemListProps>): React.ReactElement {

	const {
		activeCollectionId
	} = useCollections()

	const {
		items,
	} = useItems();

	const {
		selectedItemIds,
		isSelected,
		setSelection,
		toggleSelection,
		selectRangeTo,
		selectAll
	} = useItemSelection();

	return (
		<VBox
			fill
			padding="0-5"
			spacing="0-5"
			alignMain="start"
			alignCross="stretch"
			overflow="auto"
			focusable
			onKeyDown={(event: React.KeyboardEvent) => {
				if (event.ctrlKey && event.keyCode === 65) {
					event.preventDefault();
					event.stopPropagation();
					selectAll()
				}
			}}
		>
			{items && items.map((itemData: ItemData) => <ItemListEntry
				item={itemData}
				selected={isSelected(itemData.id)}
				onSelect={(selectMod: SelectModifier) => handleSelectItem(itemData.id, selectMod)}
				onDragStart={(event: React.DragEvent) => handleDragItem(itemData.id, event)}
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

	function handleDragItem(itemId: number, event: React.DragEvent): void {
		const copyMode: boolean = isCopyMode(event);
		let dragItemIds: number[];
		if (isSelected(itemId)) {
			dragItemIds = selectedItemIds;
		} else {
			handleSelectItem(itemId, SelectModifier.NONE)
			dragItemIds = [itemId]
		}
		DragAndDropItems.setDragData(event.dataTransfer, activeCollectionId, dragItemIds, copyMode);
		DragAndDropItems.setDragLabel(event.dataTransfer, copyMode, dragItemIds.length);
	}

}
