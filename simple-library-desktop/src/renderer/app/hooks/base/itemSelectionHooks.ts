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

