import {fetchItems, fetchRootGroup, requestDeleteItems} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {useDispatchItemSelectionSet} from "../store/itemSelectionState";
import {GroupDTO, ItemDTO} from "../../../../common/events/dtoModels";
import {useDispatchSetItems} from "../store/itemsState";
import {useDispatchSetRootGroup} from "../store/collectionsState";
import {useActiveCollection} from "../store/collectionActiveState";
import {TEMP_ATTRIBUTE_KEYS} from "./temp";

export function useDeleteItems() {

	const activeCollectionId = useActiveCollection();
	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const dispatchSetItems = useDispatchSetItems();
	const dispatchSelectionSet = useDispatchItemSelectionSet();
	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(itemIds: number[]) {
		deleteItems(itemIds)
			.then(() => clearSelection())
			.then(() => updateItemState())
			.then(() => updateGroupState())
	}


	function deleteItems(itemIds: number[]) {
		return requestDeleteItems(itemIds)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_REMOVE_FAILED, error));
	}


	function clearSelection() {
		dispatchSelectionSet([]);
	}


	function updateItemState() {
		return fetchItems(activeCollectionId, TEMP_ATTRIBUTE_KEYS, true)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_FETCH_FAILED, error))
			.then((items: ItemDTO[]) => dispatchSetItems(items));
	}


	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}


	return hookFunction;
}
