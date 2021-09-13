import {requestOpenItemsExternal} from "../../common/eventInterface";

export function useOpenItemsExternal() {

	function hookFunction(itemIds: number[]) {
		requestOpenItemsExternal(itemIds)
	}

	return hookFunction;
}
