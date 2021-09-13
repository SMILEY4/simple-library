import {
	useDispatchItemSelectionAdd, useDispatchItemSelectionRemove,
	useDispatchItemSelectionSet,
	useDispatchItemSelectionSetLast,
	useItemSelectionContext
} from "../../../store/itemSelectionState";
import {useItemsContext} from "../../../store/itemsState";

export function useItemSelectionRangeTo() {

	const [itemsState] = useItemsContext();
	const [itemSelectionState] = useItemSelectionContext();
	const dispatchSelectionSet = useDispatchItemSelectionSet();
	const dispatchSelectionAdd = useDispatchItemSelectionAdd();
	const dispatchSelectionRemove = useDispatchItemSelectionRemove();
	const dispatchSelectionSetLast = useDispatchItemSelectionSetLast();

	function hookFunction(toItemId: number, additive: boolean) {
		const allItemIds: number[] = itemsState.items.map(item => item.id);
		const pivotItemId: number | null = itemSelectionState.lastSelectedItemId;

		if (pivotItemId) {
			const indexTo: number = allItemIds.indexOf(toItemId);
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
				if (itemSelectionState.selectedItemIds.indexOf(toItemId) === -1) {
					dispatchSelectionAdd([toItemId]);
				} else {
					dispatchSelectionRemove([toItemId]);
				}
			} else {
				dispatchSelectionSet([toItemId]);
			}
		}
		dispatchSelectionSetLast(pivotItemId);
	}

	return hookFunction;
}
