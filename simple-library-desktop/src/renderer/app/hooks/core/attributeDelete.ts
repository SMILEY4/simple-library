import {deleteItemMetadata} from "../../common/eventInterface";
import {useDispatchRemoveItemAttribute} from "../store/itemsState";
import {useDispatchRemoveAttribute} from "../store/attributeStore";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {genNotificationId} from "../../common/notificationUtils";

export function useDeleteAttribute() {

	const throwErrorNotification = useThrowErrorWithNotification();
	const dispatchRemoveAttribute = useDispatchRemoveAttribute();
	const dispatchRemoveItemAttribute = useDispatchRemoveItemAttribute();


	function hookFunction(itemId: number, attributeKey: string): Promise<void> {
		return deleteItemMetadata(itemId, attributeKey)
			.then(() => updateAttributeState(attributeKey))
			.then(() => updateItemState(itemId, attributeKey))
			.then(() => undefined)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GENERIC, error));
	}

	function updateAttributeState(attributeKey: string): void {
		dispatchRemoveAttribute(attributeKey);
	}

	function updateItemState(itemId: number, attributeKey: string): void {
		dispatchRemoveItemAttribute(itemId, attributeKey);
	}

	return hookFunction;
}
