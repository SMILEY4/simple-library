import {useItems, useItemSelection} from "../base/itemHooks";
import React, {useCallback, useEffect} from "react";
import {useCollections} from "../base/collectionHooks";
import {isCopyMode, SelectModifier} from "../../../components/utils/common";
import {DragAndDropItems} from "../../common/dragAndDrop";

export function useItemList(activeCollectionId: number) {

	const {
		loadGroups
	} = useCollections()

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

	function handleRemoveSelectedItems(): void {
		removeItems(activeCollectionId, selectedItemIds)
			.then(() => clearSelection())
			.then(() => loadGroups())
	}

	function handleDeleteSelectedItems(): void {
		deleteItems(selectedItemIds)
			.then(() => clearSelection())
			.then(() => loadGroups())
	}

	return {
		items: items,
		isSelected: isSelected,
		handleOnKeyDown: useCallback(handleOnKeyDown, []),
		handleSelectItem: useCallback(handleSelectItem, []),
		handleDragItem: useCallback(handleDragItem, []),
		handleRemoveSelectedItems: useCallback(handleRemoveSelectedItems, []),
		handleDeleteSelectedItems: useCallback(handleDeleteSelectedItems, []),
	}

}