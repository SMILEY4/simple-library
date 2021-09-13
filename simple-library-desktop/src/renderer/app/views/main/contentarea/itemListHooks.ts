import React, {useEffect} from "react";
import {isCopyMode, isShortcut, SelectModifier} from "../../../../components/utils/common";
import {DragAndDropItems} from "../../../common/dragAndDrop";
import {useItemSelectionSet} from "../../../hooks/logic/core/itemSelectionSet";
import {useItemSelectionToggle} from "../../../hooks/logic/core/itemSelectionToggle";
import {useItemSelectionRangeTo} from "../../../hooks/logic/core/itemSelectionRange";
import {useItemSelectionClear} from "../../../hooks/logic/core/itemSelectionClear";
import {useOpenItemsExternal} from "../../../hooks/logic/core/itemsOpenExternal";
import {useRemoveItems} from "../../../hooks/logic/core/itemsRemove";
import {useUpdateAttribute} from "../../../hooks/logic/core/attributeUpdate";
import {useActiveCollection} from "../../../store/collectionActiveState";
import {useGetItemIds, useItems} from "../../../store/itemsState";
import {useIsItemSelected, useSelectedItemIds} from "../../../store/itemSelectionState";

export function useItemList(activeCollectionId: number) {

	const items = useItems();
	const selectedItemIds = useSelectedItemIds();
	const isSelected = useIsItemSelected();
	const itemSelectionClear = useItemSelectionClear();

	useEffect(() => {
		itemSelectionClear();
	}, [activeCollectionId])

	return {
		items: items,
		isSelected: isSelected,
		itemIdsSelected: selectedItemIds,
		handleOnKeyDown: useKeyboardShortcuts(),
		handleSelectItem: useSelectItems(),
		openItemExternal: useOpenItemExternal(),
		openSelectedItemsExternal: useOpenSelectedItemsExternal(),
		handleDragItem: useDragItems(),
		handleRemoveSelectedItems: useRemoveSelectedItems(),
		handleUpdateItemAttributeValue: useUpdateItemAttribute()
	}

}


function useOpenItemExternal() {
	const openItemsExternal = useOpenItemsExternal();

	function hookFunction(itemId: number) {
		openItemsExternal([itemId])
	}

	return hookFunction;
}


function useOpenSelectedItemsExternal() {
	const openItemsExternal = useOpenItemsExternal();
	const selectedItemIds = useSelectedItemIds();

	function hookFunction() {
		openItemsExternal(selectedItemIds)
	}

	return hookFunction;
}


function useRemoveSelectedItems() {
	const selectedItemIds = useSelectedItemIds();
	const removeItems = useRemoveItems();

	function hookFunction() {
		removeItems(selectedItemIds)
	}

	return hookFunction;
}


function useUpdateItemAttribute() {
	const updateAttribute = useUpdateAttribute();

	function hookFunction(itemId: number, attributeKey: string, prevValue: any, nextValue: any) {
		updateAttribute(itemId, attributeKey, nextValue)
	}

	return hookFunction;
}


function useKeyboardShortcuts() {

	const getItemIds = useGetItemIds();
	const itemSelectionSet = useItemSelectionSet();

	function hookFunction(event: React.KeyboardEvent): void {
		if (isShortcut(event) && event.keyCode === 65) {
			event.preventDefault();
			event.stopPropagation();
			itemSelectionSet(getItemIds())
		}
	}

	return hookFunction;
}


function useSelectItems() {
	const itemSelectionSet = useItemSelectionSet();
	const itemSelectionToggle = useItemSelectionToggle();
	const itemSelectionRangeTo = useItemSelectionRangeTo();

	function hookFunction(itemId: number, selectMod: SelectModifier): void {
		switch (selectMod) {
			case SelectModifier.NONE: {
				itemSelectionSet([itemId])
				break;
			}
			case SelectModifier.TOGGLE: {
				itemSelectionToggle([itemId])
				break;
			}
			case SelectModifier.RANGE: {
				itemSelectionRangeTo(itemId, false)
				break;
			}
			case SelectModifier.ADD_RANGE: {
				itemSelectionRangeTo(itemId, true)
				break;
			}
		}
	}

	return hookFunction;
}


function useDragItems() {
	const activeCollectionId = useActiveCollection();
	const selectedItemIds = useSelectedItemIds();
	const isSelected = useIsItemSelected();
	const itemSelectionSet = useItemSelectionSet();

	function hookFunction(itemId: number, event: React.DragEvent): void {
		const copyMode: boolean = isCopyMode(event);
		let dragItemIds: number[];
		if (isSelected(itemId)) {
			dragItemIds = selectedItemIds;
		} else {
			itemSelectionSet([itemId])
			dragItemIds = [itemId]
		}
		DragAndDropItems.setDragData(event.dataTransfer, activeCollectionId, dragItemIds, copyMode);
		DragAndDropItems.setDragLabel(event.dataTransfer, copyMode, dragItemIds.length);

	}

	return hookFunction;
}
