import {fetchRootGroup, requestRemoveItems} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {useDispatchItemSelectionRemove} from "../store/itemSelectionState";
import {GroupDTO} from "../../../../common/events/dtoModels";
import {useDispatchSetRootGroup} from "../store/collectionsState";
import {useActiveCollection} from "../store/collectionActiveState";
import {useLoadItems} from "./itemsLoad";

export function useRemoveItems() {

	const activeCollectionId = useActiveCollection();
	const throwErrorNotification = useThrowErrorWithNotification();
	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const dispatchSelectionRemove = useDispatchItemSelectionRemove();
	const loadItems = useLoadItems();


	function hookFunction(itemIds: number[], srcCollectionId?: number) {
		const collectionId = srcCollectionId ? srcCollectionId : activeCollectionId;
		removeItems(itemIds, collectionId)
			.then(() => updateSelection(itemIds))
			.then(() => updateItemState(collectionId))
			.then(() => updateGroupState());
	}


	function removeItems(itemIds: number[], collectionId: number) {
		return requestRemoveItems(collectionId, itemIds)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_REMOVE_FAILED, error));
	}


	function updateSelection(removedItemIds: number[]) {
		dispatchSelectionRemove(removedItemIds);
	}


	function updateItemState(collectionId: number) {
		if (activeCollectionId === collectionId) {
			return loadItems({});
		}
	}


	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}

	return hookFunction;
}
