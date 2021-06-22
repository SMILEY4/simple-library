import {
	ItemSelectionActionType,
	useItemSelectionContext,
	useItemSelectionDispatch
} from "../../store/itemSelectionState";


export function useItemSelectionState() {

	const [itemSelectionState] = useItemSelectionContext();

	function isSelected(itemId: number): boolean {
		return itemSelectionState.selectedItemIds.indexOf(itemId) !== -1;
	}

	return {
		selectedItemIds: itemSelectionState.selectedItemIds,
		isSelected: isSelected,
		lastSelectedItemId: itemSelectionState.lastSelectedItemId
	};
}


export function useItemSelection() {

	const itemSelectionDispatch = useItemSelectionDispatch();

	function setSelection(itemIds: number[]) {
		itemSelectionDispatch({
			type: ItemSelectionActionType.ITEM_SELECTION_SET,
			payload: itemIds,
		});
		itemSelectionDispatch({
			type: ItemSelectionActionType.ITEM_SELECTION_SET_LAST,
			payload: itemIds.length > 0 ? itemIds[0] : null,
		});
	}

	function addToSelection(itemIds: number[]) {
		itemSelectionDispatch({
			type: ItemSelectionActionType.ITEM_SELECTION_ADD,
			payload: itemIds,
		});
		itemSelectionDispatch({
			type: ItemSelectionActionType.ITEM_SELECTION_SET_LAST,
			payload: itemIds.length > 0 ? itemIds[0] : null,
		});
	}

	function removeFromSelection(itemIds: number[]) {
		itemSelectionDispatch({
			type: ItemSelectionActionType.ITEM_SELECTION_REMOVE,
			payload: itemIds,
		});
		itemSelectionDispatch({
			type: ItemSelectionActionType.ITEM_SELECTION_SET_LAST,
			payload: itemIds.length > 0 ? itemIds[0] : null,
		});
	}

	function toggleSelection(itemIds: number[], selectedItemIds: number[]) {
		const newSelection: number[] = selectedItemIds.filter(itemId => itemIds.indexOf(itemId) === -1);
		itemIds.forEach(itemId => {
			if (selectedItemIds.indexOf(itemId) === -1) {
				newSelection.push(itemId);
			}
		});
		setSelection(newSelection);
		itemSelectionDispatch({
			type: ItemSelectionActionType.ITEM_SELECTION_SET_LAST,
			payload: itemIds.length > 0 ? itemIds[0] : null,
		});
	}

	function selectRangeTo(itemId: number, additive: boolean, allItemIds: number[], selectedItemIds: number[], lastSelectedItemId: number) {
		const pivotItemId: number | null = lastSelectedItemId;
		if (pivotItemId) {
			const indexTo: number = allItemIds.indexOf(itemId);
			const indexLast: number = allItemIds.indexOf(pivotItemId);

			if (indexTo >= 0 && indexLast >= 0) {
				const indexStart: number = Math.min(indexTo, indexLast);
				const indexEnd: number = Math.max(indexTo, indexLast);
				const idsInRange: number[] = allItemIds.slice(indexStart, indexEnd + 1);
				if (additive) {
					itemSelectionDispatch({
						type: ItemSelectionActionType.ITEM_SELECTION_ADD,
						payload: idsInRange,
					});
				} else {
					itemSelectionDispatch({
						type: ItemSelectionActionType.ITEM_SELECTION_SET,
						payload: idsInRange,
					});
				}
			}
		} else {
			if (additive) {
				if (selectedItemIds.indexOf(itemId) === -1) {
					itemSelectionDispatch({
						type: ItemSelectionActionType.ITEM_SELECTION_ADD,
						payload: [itemId],
					});
				} else {
					itemSelectionDispatch({
						type: ItemSelectionActionType.ITEM_SELECTION_REMOVE,
						payload: [itemId],
					});
				}
			} else {
				itemSelectionDispatch({
					type: ItemSelectionActionType.ITEM_SELECTION_SET,
					payload: [itemId],
				});
			}
		}
		itemSelectionDispatch({
			type: ItemSelectionActionType.ITEM_SELECTION_SET_LAST,
			payload: pivotItemId,
		});
	}

	function clearSelection() {
		setSelection([]);
	}

	return {
		addToSelection: addToSelection,
		removeFromSelection: removeFromSelection,
		setSelection: setSelection,
		toggleSelection: toggleSelection,
		selectRangeTo: selectRangeTo,
		clearSelection: clearSelection,
	};

}