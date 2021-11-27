import {deleteItemMetadata} from "../../common/eventInterface";
import {useDispatchRemoveItemAttribute} from "../store/itemsState";
import {useDispatchRemoveAttribute} from "../store/attributeStore";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {genNotificationId} from "../../common/notificationUtils";
import {voidThen} from "../../../../common/utils";

export function useDeleteAttribute() {

	const throwErrorNotification = useThrowErrorWithNotification();
	const dispatchRemoveAttribute = useDispatchRemoveAttribute();
	const dispatchRemoveItemAttribute = useDispatchRemoveItemAttribute();


	function hookFunction(itemId: number, attributeId: number): Promise<void> {
		return deleteItemMetadata(itemId, attributeId)
			.then(() => updateAttributeState(attributeId))
			.then(() => updateItemState(itemId, attributeId))
			.then(voidThen)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GENERIC, error));
	}

	function updateAttributeState(attributeId: number): void {
		dispatchRemoveAttribute(attributeId);
	}

	function updateItemState(itemId: number, attributeId: number): void {
		dispatchRemoveItemAttribute(itemId, attributeId);
	}

	return hookFunction;
}
