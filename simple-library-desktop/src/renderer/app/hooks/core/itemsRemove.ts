import {fetchItems, fetchRootGroup, requestRemoveItems} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {useDispatchItemSelectionRemove} from "../store/itemSelectionState";
import {GroupDTO, ItemDTO} from "../../../../common/events/dtoModels";
import {useDispatchSetItems} from "../store/itemsState";
import {useDispatchSetRootGroup} from "../store/collectionsState";
import {useActiveCollection} from "../store/collectionActiveState";

export function useRemoveItems() {

	const activeCollectionId = useActiveCollection();
	const throwErrorNotification = useThrowErrorWithNotification();
	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const dispatchSetItems = useDispatchSetItems();
	const dispatchSelectionRemove = useDispatchItemSelectionRemove();

	const itemAttributeKeys: string[] = ["File.FileName", "File.FileCreateDate", "File.FileSize", "File.FileType", "JFIF.JFIFVersion", "PNG.Gamma"];


	function hookFunction(itemIds: number[], srcCollectionId?: number) {
		const collectionId = srcCollectionId ? srcCollectionId : activeCollectionId;
		removeItems(itemIds, collectionId)
			.then(() => updateSelection(itemIds))
			.then(() => updateItemState(collectionId))
			.then(() => updateGroupState())
	}


	function removeItems(itemIds: number[], collectionId: number) {
		return requestRemoveItems(collectionId, itemIds)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_REMOVE_FAILED, error))
	}


	function updateSelection(removedItemIds: number[]) {
		dispatchSelectionRemove(removedItemIds);
	}


	function updateItemState(collectionId: number) {
		if (activeCollectionId === collectionId) {
			return fetchItems(activeCollectionId, itemAttributeKeys, true)
				.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
				.then((items: ItemDTO[]) => dispatchSetItems(items));
		}
	}


	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}

	return hookFunction;
}
