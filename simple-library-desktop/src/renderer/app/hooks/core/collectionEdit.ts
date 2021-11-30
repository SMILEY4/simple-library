import {fetchRootGroup, requestEditCollection} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {GroupDTO} from "../../../../common/events/dtoModels";
import {useDispatchSetRootGroup} from "../store/collectionsState";
import {useDispatchItemSelectionClear} from "../store/itemSelectionState";
import {useActiveCollection} from "../store/collectionActiveState";
import {useLoadItems} from "./itemsLoad";

export function useEditCollection() {

	const activeCollectionId = useActiveCollection();
	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const dispatchClearSelection = useDispatchItemSelectionClear();
	const throwErrorNotification = useThrowErrorWithNotification();
	const loadItems = useLoadItems();

	function hookFunction(collectionId: number, name: string, query: string | null) {
		return Promise.resolve()
			.then(() => edit(collectionId, name, query))
			.then(() => updateGroupState())
			.then(() => handleActiveCollection(collectionId));
	}

	function edit(collectionId: number, name: string, query: string | null) {
		return requestEditCollection(collectionId, name, query)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_EDIT_FAILED, error));

	}

	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}

	function handleActiveCollection(collectionId: number) {
		if (activeCollectionId === collectionId) {
			dispatchClearSelection();
			return updateItemState(collectionId);
		}
	}

	function updateItemState(collectionId: number) {
		return loadItems({collectionId: collectionId});
	}

	return hookFunction;
}
