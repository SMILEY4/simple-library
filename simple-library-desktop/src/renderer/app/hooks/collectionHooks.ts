import {requestMoveCollection} from "../common/messaging/messagingInterface";
import {genNotificationId} from "../common/utils/notificationUtils";
import {AppNotificationType} from "../store/state";
import {useNotifications} from "./notificationHooks";
import {useGroups} from "./groupHooks";

export function useCollections() {

	const {addNotification} = useNotifications()
	const {loadGroups} = useGroups()

	function move(collectionId: number, targetGroupId: number | null): void {
		requestMoveCollection(collectionId, targetGroupId)
			.catch(error => addNotification(genNotificationId(), AppNotificationType.COLLECTION_MOVE_FAILED, error))
			.then(() => loadGroups());
	}

	return {
		moveCollection: move
	}

}