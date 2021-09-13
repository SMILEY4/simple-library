import {useDispatchItemSelectionClear, useDispatchItemSelectionSetLast} from "../../../store/itemSelectionState";

export function useItemSelectionClear() {

	const dispatchSelectionClear = useDispatchItemSelectionClear();
	const dispatchSelectionSetLast = useDispatchItemSelectionSetLast();

	function hookFunction() {
		dispatchSelectionClear();
		dispatchSelectionSetLast(null)
	}

	return hookFunction;
}
