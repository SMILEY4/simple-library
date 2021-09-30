import {
	AppNotificationType,
	useDispatchAddNotification,
	useDispatchRemoveNotification,
	useDispatchUpdateNotification,
	useThrowErrorWithNotification
} from "../store/notificationState";
import {addEmbedStatusListener, removeEmbedStatusListener, requestEmbedAttributes} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {useSelectedItemIds} from "../store/itemSelectionState";
import {EmbedStatusDTO} from "../../../../common/events/dtoModels";

export function useEmbedAttributes() {

	const selectedItemIds = useSelectedItemIds();
	const embedAttribsOfItemIds = useEmbedAttributesOfItemIds();

	function hookFunction(selectedItems: boolean, allAttributes: boolean): Promise<void> {
		return embedAttribsOfItemIds(selectedItems ? selectedItemIds : null, allAttributes);
	}

	return hookFunction;
}


export function useEmbedAttributesOfItemIds() {

	const notificationAdd = useDispatchAddNotification();
	const notificationRemove = useDispatchRemoveNotification();
	const notificationUpdate = useDispatchUpdateNotification();
	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(itemIds: number[] | null, allAttributes: boolean): Promise<void> {

		const statusNotificationId = genNotificationId();
		notificationAdd(statusNotificationId, AppNotificationType.ATTRIBUTES_EMBED_STATUS, null);

		const statusListener = (status: EmbedStatusDTO) => {
			notificationUpdate(statusNotificationId, status);
			if(status.totalAmountItems === status.completedItems) {
				notificationAdd(genNotificationId(), AppNotificationType.ATTRIBUTES_EMBED_FINISHED, status)
			}
		}
		addEmbedStatusListener(statusListener);

		return requestEmbedAttributes(itemIds, allAttributes)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ATTRIBUTES_EMBED_FAILED, error))
			.then(() => notificationRemove(statusNotificationId))
			.finally(() => removeEmbedStatusListener());
	}

	return hookFunction;
}
