import {
	useDispatchItemSelectionAdd,
	useDispatchItemSelectionRemove,
	useDispatchItemSelectionSet,
	useDispatchItemSelectionSetLast,
	useItemSelectionContext,
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

	const dispatchSelectionSet = useDispatchItemSelectionSet();
	const dispatchSelectionAdd = useDispatchItemSelectionAdd();
	const dispatchSelectionRemove = useDispatchItemSelectionRemove();
	const dispatchSelectionSetLast = useDispatchItemSelectionSetLast();


	function setSelection(itemIds: number[]) {
		dispatchSelectionSet(itemIds);
		dispatchSelectionSetLast(itemIds.length > 0 ? itemIds[0] : null)
	}

	function addToSelection(itemIds: number[]) {
		dispatchSelectionAdd(itemIds);
		dispatchSelectionSetLast(itemIds.length > 0 ? itemIds[0] : null)
	}

	function removeFromSelection(itemIds: number[]) {
		dispatchSelectionRemove(itemIds);
		dispatchSelectionSetLast(itemIds.length > 0 ? itemIds[0] : null)
	}

	function toggleSelection(itemIds: number[], selectedItemIds: number[]) {
		const newSelection: number[] = selectedItemIds.filter(itemId => itemIds.indexOf(itemId) === -1);
		itemIds.forEach(itemId => {
			if (selectedItemIds.indexOf(itemId) === -1) {
				newSelection.push(itemId);
			}
		});
		setSelection(newSelection);
		dispatchSelectionSetLast(itemIds.length > 0 ? itemIds[0] : null)
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
					dispatchSelectionAdd(idsInRange);
				} else {
					dispatchSelectionSet(idsInRange);
				}
			}
		} else {
			if (additive) {
				if (selectedItemIds.indexOf(itemId) === -1) {
					dispatchSelectionAdd([itemId]);
				} else {
					dispatchSelectionRemove([itemId]);
				}
			} else {
				dispatchSelectionSet([itemId]);
			}
		}

		dispatchSelectionSetLast(pivotItemId);
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
