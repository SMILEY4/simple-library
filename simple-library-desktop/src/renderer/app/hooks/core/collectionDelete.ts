import {useDispatchSetRootGroup} from "../store/collectionsState";
import {fetchRootGroup, requestDeleteCollection} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {GroupDTO} from "../../../../common/events/dtoModels";
import {useDispatchItemSelectionClear} from "../store/itemSelectionState";
import {useActiveCollection, useDispatchClearActiveCollection} from "../store/collectionActiveState";

export function useDeleteCollection() {

	const activeCollectionId = useActiveCollection();
	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const dispatchClearSelection = useDispatchItemSelectionClear()
	const dispatchClearActiveCollection = useDispatchClearActiveCollection();
	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(collectionId: number) {
		return Promise.resolve()
			.then(() => deleteCollection(collectionId))
			.then(() => updateGroupState())
			.then(() => handleActiveCollection(collectionId))
	}

	function deleteCollection(collectionId: number): Promise<void> {
		return requestDeleteCollection(collectionId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_DELETE_FAILED, error))
	}

	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}

	function handleActiveCollection(collectionId: number) {
		if (activeCollectionId === collectionId) {
			dispatchClearSelection();
			dispatchClearActiveCollection();
		}
	}

	return hookFunction;
}
