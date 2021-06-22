import {useItems, useItemsState} from "../../base/itemHooks";
import React, {useEffect} from "react";
import {useCollections} from "../../base/collectionHooks";
import {isCopyMode, SelectModifier} from "../../../../components/utils/common";
import {DragAndDropItems} from "../../../common/dragAndDrop";
import {useItemSelection, useItemSelectionState} from "../../base/itemSelectionHooks";

export function useItemList(activeCollectionId: number) {

	const {
		loadGroups
	} = useCollections()

	const {
		items,
		getItemsIds,
	} = useItemsState();

	const {
		removeItems,
		deleteItems,
		loadItems
	} = useItems();

	const {
		selectedItemIds,
		isSelected,
		lastSelectedItemId
	} = useItemSelectionState();

	const {
		setSelection,
		toggleSelection,
		selectRangeTo,
		clearSelection
	} = useItemSelection();

	useEffect(() => {
		clearSelection();
	}, [activeCollectionId])

	function handleOnKeyDown(event: React.KeyboardEvent): void {
		if (event.ctrlKey && event.keyCode === 65) {
			event.preventDefault();
			event.stopPropagation();
			setSelection(getItemsIds())
		}
	}

	function handleSelectItem(itemId: number, selectMod: SelectModifier): void {
		switch (selectMod) {
			case SelectModifier.NONE: {
				setSelection([itemId])
				break;
			}
			case SelectModifier.TOGGLE: {
				toggleSelection([itemId], selectedItemIds)
				break;
			}
			case SelectModifier.RANGE: {
				selectRangeTo(itemId, false, getItemsIds(), selectedItemIds, lastSelectedItemId)
				break;
			}
			case SelectModifier.ADD_RANGE: {
				selectRangeTo(itemId, true, getItemsIds(), selectedItemIds, lastSelectedItemId)
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

	function handleRemoveSelectedItems(): void {
		removeItems(activeCollectionId, selectedItemIds)
			.then(() => clearSelection())
			.then(() => loadItems(activeCollectionId))
			.then(() => loadGroups())
	}

	function handleDeleteSelectedItems(): void {
		deleteItems(selectedItemIds)
			.then(() => clearSelection())
			.then(() => loadItems(activeCollectionId))
			.then(() => loadGroups())
	}

	return {
		items: items,
		isSelected: isSelected,
		handleOnKeyDown: handleOnKeyDown,
		handleSelectItem: handleSelectItem,
		handleDragItem: handleDragItem,
		handleRemoveSelectedItems: handleRemoveSelectedItems,
		handleDeleteSelectedItems: handleDeleteSelectedItems,
	}

}