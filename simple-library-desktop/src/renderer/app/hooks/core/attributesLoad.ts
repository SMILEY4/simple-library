import {AttributeDTO} from "../../../../common/events/dtoModels";
import {fetchItemMetadata} from "../../common/eventInterface";
import {useDispatchSetAttributes} from "../store/attributeStore";

export function useLoadAttributes() {

	const setAttributes = useDispatchSetAttributes();

	function hookFunction(itemId: number | null): Promise<void> {
		if (itemId) {
			return fetchItemMetadata(itemId, false)
				.then((attribs: AttributeDTO[]) => setAttributes(itemId, attribs));
		} else {
			return Promise.resolve()
				.then(() => setAttributes(null, []));
		}
	}

	return hookFunction;
}
