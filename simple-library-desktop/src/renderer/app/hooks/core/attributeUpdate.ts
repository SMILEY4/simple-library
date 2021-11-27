import {setItemMetadata} from "../../common/eventInterface";
import {AttributeDTO, AttributeValueDTO} from "../../../../common/events/dtoModels";
import {useDispatchUpdateItemAttribute} from "../store/itemsState";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {genNotificationId} from "../../common/notificationUtils";
import {voidThen} from "../../../../common/utils";
import {useDispatchUpdateAttribute} from "../store/attributeStore";

export function useUpdateAttribute() {

	const throwErrorNotification = useThrowErrorWithNotification();
	const dispatchUpdateAttribute = useDispatchUpdateAttribute();
	const dispatchUpdateItemAttribute = useDispatchUpdateItemAttribute();


	function hookFunction(itemId: number, attributeId: number, prevValue: AttributeValueDTO, newValue: AttributeValueDTO): Promise<void> {
		if (prevValue === newValue) {
			return Promise.resolve();
		} else {
			return Promise.resolve(newValue)
				.then((value: AttributeValueDTO) => setItemMetadata(itemId, attributeId, "" + value))
				.then((newEntry: AttributeDTO) => updateAttributeState(newEntry))
				.then((newEntry: AttributeDTO) => updateItemState(newEntry, itemId))
				.then(voidThen)
				.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GENERIC, error));
		}
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
