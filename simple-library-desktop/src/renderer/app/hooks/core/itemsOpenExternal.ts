import {requestOpenItemsExternal} from "../../common/eventInterface";
import {voidThen} from "../../../../common/utils";

export function useOpenItemsExternal() {

	function hookFunction(itemIds: number[]) {
		requestOpenItemsExternal(itemIds)
			.then(voidThen)
	}

	return hookFunction;
}
