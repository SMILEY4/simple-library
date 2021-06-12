import React from "react";
import {VBox} from "../../../../components/layout/box/Box";
import {useItems, useItemSelection} from "../../../hooks/itemHooks";
import {ItemListEntry} from "./ItemListEntry";
import {Collection, ItemData} from "../../../../../common/commonModels";
import {isCopyMode, SelectModifier} from "../../../../components/utils/common";
import {DragAndDropItems} from "../../../common/dragAndDrop";
import {useCollections} from "../../../hooks/collectionHooks";
import {useGroups} from "../../../hooks/groupHooks";

interface ItemListProps {
}

export function ItemList(props: React.PropsWithChildren<ItemListProps>): React.ReactElement {

	const {
		activeCollectionId,
		findCollection
	} = useCollections()

	const {
		items,
		removeItems,
		deleteItems
	} = useItems();

	const {
		loadGroups
	} = useGroups()

	const {
		selectedItemIds,
		isSelected,
		setSelection,
		toggleSelection,
		selectRangeTo,
		selectAll,
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
					selectAll()
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
