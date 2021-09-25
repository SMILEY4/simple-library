import {setItemMetadata} from "../../common/eventInterface";
import {AttributeDTO, AttributeValueDTO} from "../../../../common/events/dtoModels";
import {useDispatchUpdateItemAttribute} from "../store/itemsState";
import {useDispatchUpdateAttribute} from "../store/attributeStore";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {genNotificationId} from "../../common/notificationUtils";

export function useUpdateAttribute() {

	const throwErrorNotification = useThrowErrorWithNotification();
	const dispatchUpdateAttribute = useDispatchUpdateAttribute();
	const dispatchUpdateItemAttribute = useDispatchUpdateItemAttribute();


	function hookFunction(itemId: number, attributeKey: string, newValue: AttributeValueDTO): Promise<void> {
		return Promise.resolve(newValue)
			.then((value: AttributeValueDTO) => setItemMetadata(itemId, attributeKey, value))
			.then((newEntry: AttributeDTO) => updateAttributeState(newEntry))
			.then((newEntry: AttributeDTO) => updateItemState(newEntry, itemId))
			.then(() => undefined)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GENERIC, error))
	}

	function updateAttributeState(newEntry: AttributeDTO): AttributeDTO {
		dispatchUpdateAttribute(newEntry.key, newEntry.value);
		return newEntry;
	}

	function updateItemState(newEntry: AttributeDTO, itemId: number): AttributeDTO {
		dispatchUpdateItemAttribute(itemId, newEntry.key, newEntry.value);
		return newEntry;
	}

	return hookFunction;
}
