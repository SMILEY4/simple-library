import {useDispatchItemSelectionSet, useDispatchItemSelectionSetLast} from "../../../store/itemSelectionState";

export function useItemSelectionSet() {

	const dispatchSelectionSet = useDispatchItemSelectionSet();
	const dispatchSelectionSetLast = useDispatchItemSelectionSetLast();

	function hookFunction(itemIds: number[]) {
		dispatchSelectionSet(itemIds);
		dispatchSelectionSetLast(itemIds.length > 0 ? itemIds[0] : null)
	}

	return hookFunction;
}
