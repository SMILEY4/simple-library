import {requestShowItemInFolder} from "../../common/eventInterface";
import {voidThen} from "../../../../common/utils";

export function useShowItemsFolder() {

	function hookFunction(itemId: number) {
		requestShowItemInFolder(itemId)
			.then(voidThen);
	}

	return hookFunction;
}
