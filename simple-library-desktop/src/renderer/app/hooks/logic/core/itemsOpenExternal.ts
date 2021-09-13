import {requestOpenItemsExternal} from "../../../common/messagingInterface";

export function useOpenItemsExternal() {

	function hookFunction(itemIds: number[]) {
		requestOpenItemsExternal(itemIds)
	}

	return hookFunction;
}
