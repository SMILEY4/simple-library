import {useDispatchItemSelectionAdd, useDispatchItemSelectionSetLast} from "../store/itemSelectionState";

export function useItemSelectionAdd() {

	const dispatchSelectionAdd = useDispatchItemSelectionAdd();
	const dispatchSelectionSetLast = useDispatchItemSelectionSetLast();

	function hookFunction(itemIds: number[]) {
		dispatchSelectionAdd(itemIds);
		dispatchSelectionSetLast(itemIds.length > 0 ? itemIds[0] : null)
	}

	return hookFunction;
}
