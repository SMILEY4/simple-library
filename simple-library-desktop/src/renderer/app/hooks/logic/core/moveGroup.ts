import {fetchRootGroup, requestMoveGroup} from "../../../common/messagingInterface";
import {genNotificationId} from "../../base/notificationUtils";
import {AppNotificationType} from "../../../store/notificationState";
import {useDispatchSetRootGroup} from "../../../store/collectionsState";
import {useThrowErrorWithNotification} from "../../base/notificationHooks";
import {GroupDTO} from "../../../../../common/events/dtoModels";

export function useMoveGroup() {

	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(groupId: number, targetGroupId: number | null) {
		Promise.resolve()
			.then(() => moveGroup(groupId, targetGroupId))
			.then(() => updateGroupState())
	}

	function moveGroup(groupId: number, targetGroupId: number | null): Promise<any> {
		return requestMoveGroup(groupId, targetGroupId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GROUP_MOVE_FAILED, error))
	}

	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}

	return hookFunction;
}
