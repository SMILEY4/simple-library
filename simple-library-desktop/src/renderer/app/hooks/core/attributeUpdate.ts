import {setItemMetadata} from "../../common/eventInterface";
import {AttributeDTO, AttributeKeyDTO, AttributeValueDTO} from "../../../../common/events/dtoModels";
import {useDispatchUpdateItemAttribute} from "../store/itemsState";
import {useDispatchUpdateAttribute} from "../store/attributeStore";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {genNotificationId} from "../../common/notificationUtils";
import {voidThen} from "../../../../common/utils";

export function useUpdateAttribute() {

	const throwErrorNotification = useThrowErrorWithNotification();
	const dispatchUpdateAttribute = useDispatchUpdateAttribute();
	const dispatchUpdateItemAttribute = useDispatchUpdateItemAttribute();


	function hookFunction(itemId: number, attributeKey: AttributeKeyDTO, newValue: AttributeValueDTO): Promise<void> {
		return Promise.resolve(newValue)
			.then((value: AttributeValueDTO) => setItemMetadata(itemId, attributeKey, value))
			.then((newEntry: AttributeDTO) => updateAttributeState(newEntry))
			.then((newEntry: AttributeDTO) => updateItemState(newEntry, itemId))
			.then(voidThen)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GENERIC, error))
	}

	function updateAttributeState(newEntry: AttributeDTO): AttributeDTO {
		dispatchUpdateAttribute(newEntry);
		return newEntry;
	}

	function updateItemState(newEntry: AttributeDTO, itemId: number): AttributeDTO {
		dispatchUpdateItemAttribute(itemId, newEntry);
		return newEntry;
	}

	return hookFunction;
}
