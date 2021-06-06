import {
	requestDeleteCollection,
	requestEditCollection,
	requestMoveCollection
} from "../common/messaging/messagingInterface";
import {genNotificationId} from "../common/utils/notificationUtils";
import {AppNotificationType} from "../store/state";
import {useNotifications} from "./notificationHooks";
import {useGroups} from "./groupHooks";
import {Collection, extractCollections} from "../../../common/commonModels";
import {useGlobalState} from "./old/miscAppHooks";

export function useCollections() {

	const {state} = useGlobalState();
	const {addNotification} = useNotifications()
	const {loadGroups} = useGroups()

	function move(collectionId: number, targetGroupId: number | null): void {
		requestMoveCollection(collectionId, targetGroupId)
			.catch(error => addNotification(genNotificationId(), AppNotificationType.COLLECTION_MOVE_FAILED, error))
			.then(() => loadGroups());
	}

	function find(collectionId: number): Collection | null {
		const result: Collection | undefined = extractCollections(state.rootGroup).find(collection => collection.id === collectionId);
		return result ? result : null;
	}

	function deleteCollection(collectionId: number): void {
		requestDeleteCollection(collectionId)
			.catch(error => addNotification(genNotificationId(), AppNotificationType.COLLECTION_DELETE_FAILED, error))
			.then(() => loadGroups())
	}

	function edit(collectionId: number, name: string, query: string | null): void {
		requestEditCollection(collectionId, name, query)
			.catch(error => addNotification(genNotificationId(), AppNotificationType.COLLECTION_EDIT_FAILED, error))
			.then(() => loadGroups())
	}

	return {
		moveCollection: move,
		findCollection: find,
		deleteCollection: deleteCollection,
		editCollection: edit
	}

}