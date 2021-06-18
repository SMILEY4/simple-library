import React from "react";
import {VBox} from "../../../../components/layout/box/Box";
import {useItems, useItemSelection} from "../../../hooks/base/itemHooks";
import {ItemListEntry} from "./ItemListEntry";
import {Collection, ItemData} from "../../../../../common/commonModels";
import {isCopyMode, SelectModifier} from "../../../../components/utils/common";
import {DragAndDropItems} from "../../../common/dragAndDrop";
import {useActiveCollection, useCollections} from "../../../hooks/base/collectionHooks";

interface ItemListProps {
}

export function ItemList(props: React.PropsWithChildren<ItemListProps>): React.ReactElement {

	const {
		findCollection,
		loadGroups
	} = useCollections()

	const {
		activeCollectionId,
	} = useActiveCollection()

	const {
		items,
		getItemsIds,
		removeItems,
		deleteItems
	} = useItems();

	const {
		selectedItemIds,
		isSelected,
		setSelection,
		toggleSelection,
		selectRangeTo,
		clearSelection
	} = useItemSelection();

	const activeCollection: Collection | null = findCollection(activeCollectionId)


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
					setSelection(getItemsIds())
				}
			}}
		>
			{items && items.map((itemData: ItemData) => <ItemListEntry
				key={itemData.id}
				item={itemData}
				activeCollectionType={activeCollection ? activeCollection.type : undefined}
				selected={isSelected(itemData.id)}
				onSelect={(selectMod: SelectModifier) => handleSelectItem(itemData.id, selectMod)}
				onDragStart={(event: React.DragEvent) => handleDragItem(itemData.id, event)}
				onRemove={handleRemoveItems}
				onDelete={handleDeleteItems}
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
				selectRangeTo(itemId, false, getItemsIds())
				break;
			}
			case SelectModifier.ADD_RANGE: {
				selectRangeTo(itemId, true, getItemsIds())
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

	function handleRemoveItems(): void {
		removeItems(activeCollectionId, selectedItemIds)
			.then(() => clearSelection())
			.then(() => loadGroups())
	}

	function handleDeleteItems(): void {
		deleteItems(selectedItemIds)
			.then(() => clearSelection())
			.then(() => loadGroups())
	}

}
