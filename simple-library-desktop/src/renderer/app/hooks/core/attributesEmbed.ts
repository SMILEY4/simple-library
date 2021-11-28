import {
	AppNotificationType,
	useDispatchAddNotification,
	useDispatchRemoveNotification,
	useDispatchUpdateNotification,
	useThrowErrorWithNotification
} from "../store/notificationState";
import {
	addEmbedStatusListener,
	fetchItemMetadata,
	fetchItems,
	removeEmbedStatusListener,
	requestEmbedAttributes
} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {useSelectedItemIds} from "../store/itemSelectionState";
import {EmbedStatusDTO, ItemDTO} from "../../../../common/events/dtoModels";
import {useDispatchSetAttributes, useStateAttributeStoreItemId} from "../store/attributeStore";
import {useDispatchSetItems} from "../store/itemsState";
import {useActiveCollection} from "../store/collectionActiveState";
import {TEMP_ATTRIBUTE_IDS} from "./temp";

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
	const attributeItemId = useStateAttributeStoreItemId();
	const setAttributes = useDispatchSetAttributes();
	const activeCollection = useActiveCollection();
	const dispatchSetItems = useDispatchSetItems();

	function hookFunction(itemIds: number[] | null, allAttributes: boolean): Promise<void> {

		const statusNotificationId = genNotificationId();
		notificationAdd(statusNotificationId, AppNotificationType.ATTRIBUTES_EMBED_STATUS, null);

		addEmbedStatusListener((status: EmbedStatusDTO) => notificationUpdate(statusNotificationId, status));

		return requestEmbedAttributes(itemIds, allAttributes)
			.then((report) => notificationAdd(genNotificationId(), AppNotificationType.ATTRIBUTES_EMBED_FINISHED, report))
			.then(() => updateAttributeState())
			.then(() => updateItemState())
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ATTRIBUTES_EMBED_FAILED, error))
			.finally(() => {
				notificationRemove(statusNotificationId);
				removeEmbedStatusListener();
			});

		function updateAttributeState(): Promise<any> {
			if (attributeItemId) {
				return fetchItemMetadata(attributeItemId, false)
					.then(attribs => setAttributes(attributeItemId, attribs));
			} else {
				return Promise.resolve();
			}
		}

		function updateItemState(): Promise<any> {
			if (activeCollection) {
				return fetchItems(activeCollection, TEMP_ATTRIBUTE_IDS, true, false)
					.then((items: ItemDTO[]) => dispatchSetItems(items));
			} else {
				return Promise.resolve();
			}
		}

	}

	return hookFunction;
}
