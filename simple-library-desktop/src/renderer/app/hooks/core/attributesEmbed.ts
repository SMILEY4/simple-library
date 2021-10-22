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
import {useDispatchAttributesClearModifiedFlags, useStateAttributeStoreItemId} from "../store/attributeStore";
import {useDispatchItemsClearAttributeModifiedFlags} from "../store/itemsState";

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
	const dispatchAttributesClearModifiedFlags = useDispatchAttributesClearModifiedFlags();
	const attributeStoreItemId = useStateAttributeStoreItemId();
	const dispatchItemsClearAttributeModifiedFlags = useDispatchItemsClearAttributeModifiedFlags();

	function hookFunction(itemIds: number[] | null, allAttributes: boolean): Promise<void> {

		const statusNotificationId = genNotificationId();
		notificationAdd(statusNotificationId, AppNotificationType.ATTRIBUTES_EMBED_STATUS, null);

		addEmbedStatusListener((status: EmbedStatusDTO) => notificationUpdate(statusNotificationId, status));

		return requestEmbedAttributes(itemIds, allAttributes)
			.then((report) => notificationAdd(genNotificationId(), AppNotificationType.ATTRIBUTES_EMBED_FINISHED, report))
			.then(() => updateAttributeState(itemIds, allAttributes))
			.then(() => updateItemState(itemIds))
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ATTRIBUTES_EMBED_FAILED, error))
			.finally(() => {
				notificationRemove(statusNotificationId);
				removeEmbedStatusListener();
			});

		function updateAttributeState(itemIds: number[] | null, allAttributes: boolean): void {
			if (allAttributes || itemIds === null) {
				dispatchAttributesClearModifiedFlags();
			} else {
				if (itemIds.indexOf(attributeStoreItemId) !== -1) {
					dispatchAttributesClearModifiedFlags();
				}
			}
		}

		function updateItemState(itemIds: number[] | null): void {
			dispatchItemsClearAttributeModifiedFlags(itemIds);
		}

	}

	return hookFunction;
}
