import {deleteItemMetadata} from "../../common/eventInterface";
import {useDispatchRemoveItemAttribute} from "../store/itemsState";
import {useDispatchRemoveAttribute} from "../store/attributeStore";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {genNotificationId} from "../../common/notificationUtils";
import {AttributeKeyDTO} from "../../../../common/events/dtoModels";
import {voidThen} from "../../../../common/utils";

export function useDeleteAttribute() {

	const throwErrorNotification = useThrowErrorWithNotification();
	const dispatchRemoveAttribute = useDispatchRemoveAttribute();
	const dispatchRemoveItemAttribute = useDispatchRemoveItemAttribute();


	function hookFunction(itemId: number, attributeKey: AttributeKeyDTO): Promise<void> {
		return deleteItemMetadata(itemId, attributeKey)
			.then(() => updateAttributeState(attributeKey))
			.then(() => updateItemState(itemId, attributeKey))
			.then(voidThen)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GENERIC, error));
	}

	function updateAttributeState(attributeKey: AttributeKeyDTO): void {
		dispatchRemoveAttribute(attributeKey);
	}

	function updateItemState(itemId: number, attributeKey: AttributeKeyDTO): void {
		dispatchRemoveItemAttribute(itemId, attributeKey);
	}

	return hookFunction;
}
