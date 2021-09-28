import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {requestEmbedAttributes} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {useSelectedItemIds} from "../store/itemSelectionState";

export function useEmbedAttributes() {

	const selectedItemIds = useSelectedItemIds();
	const embedAttribsOfItemIds = useEmbedAttributesOfItemIds();

	function hookFunction(selectedItems: boolean, allAttributes: boolean): Promise<void> {
		return embedAttribsOfItemIds(selectedItems ? selectedItemIds : null, allAttributes);
	}

	return hookFunction;
}


export function useEmbedAttributesOfItemIds() {

	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(itemIds: number[] | null, allAttributes: boolean): Promise<void> {
		return requestEmbedAttributes(itemIds, allAttributes)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ATTRIBUTES_EMBED_FAILED, error));
		// todo: update display/highlighting of modified attributes
	}

	return hookFunction;
}
