import {fetchRootGroup, requestDeleteItems} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {useDispatchItemSelectionSet} from "../store/itemSelectionState";
import {GroupDTO} from "../../../../common/events/dtoModels";
import {useDispatchSetRootGroup} from "../store/collectionsState";
import {useLoadItems} from "./itemsLoad";

export function useDeleteItems() {

	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const dispatchSelectionSet = useDispatchItemSelectionSet();
	const throwErrorNotification = useThrowErrorWithNotification();
	const loadItems = useLoadItems();

	function hookFunction(itemIds: number[]) {
		deleteItems(itemIds)
			.then(() => clearSelection())
			.then(() => updateItemState())
			.then(() => updateGroupState());
	}


	function deleteItems(itemIds: number[]) {
		return requestDeleteItems(itemIds)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ITEMS_REMOVE_FAILED, error));
	}


	function clearSelection() {
		dispatchSelectionSet([]);
	}


	function updateItemState() {
		return loadItems({});
	}


	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}


	return hookFunction;
}
