import {useDispatchItemSelectionSetLast, useDispatchItemSelectionToggle} from "../store/itemSelectionState";

export function useItemSelectionToggle() {

	const dispatchSelectionToggle = useDispatchItemSelectionToggle();
	const dispatchSelectionSetLast = useDispatchItemSelectionSetLast();

	function hookFunction(itemIds: number[]) {
		dispatchSelectionToggle(itemIds);
		dispatchSelectionSetLast(itemIds.length > 0 ? itemIds[0] : null)
	}

	return hookFunction;
}
