import {setItemMetadata} from "../../../common/messagingInterface";
import {AttributeDTO} from "../../../../../common/events/dtoModels";
import {useDispatchUpdateItemAttribute} from "../../../store/itemsState";

export function useUpdateAttribute() {

	const dispatchUpdateItemAttribute = useDispatchUpdateItemAttribute();

	function hookFunction(itemId: number, attributeKey: string, newValue: any): void {
		setItemMetadata(itemId, attributeKey, newValue)
			.then((newEntry: AttributeDTO) => dispatchUpdateItemAttribute(itemId, attributeKey, newEntry.value))
	}

	return hookFunction;
}
