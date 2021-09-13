import {useDispatchItemSelectionAdd, useDispatchItemSelectionSetLast} from "../../../store/itemSelectionState";

export function useItemSelectionRemove() {

	const dispatchSelectionRemove = useDispatchItemSelectionAdd();
	const dispatchSelectionSetLast = useDispatchItemSelectionSetLast();

	function hookFunction(itemIds: number[]) {
		dispatchSelectionRemove(itemIds);
		dispatchSelectionSetLast(itemIds.length > 0 ? itemIds[0] : null)
	}

	return hookFunction;
}
