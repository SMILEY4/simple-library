import {fetchRootGroup, requestMoveCollection} from "../../../common/messagingInterface";
import {genNotificationId} from "../../base/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../../../store/notificationState";
import {GroupDTO} from "../../../../../common/events/dtoModels";
import {useDispatchSetRootGroup} from "../../../store/collectionsState";

export function useMoveCollection() {

	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(collectionId: number, targetGroupId: number | null) {
		Promise.resolve()
			.then(() => moveCollection(collectionId, targetGroupId))
			.then(() => updateGroupState());
	}

	function moveCollection(collectionId: number, targetGroupId: number | null): Promise<any> {
		return requestMoveCollection(collectionId, targetGroupId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_MOVE_FAILED, error));
	}

	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}

	return hookFunction;
}
