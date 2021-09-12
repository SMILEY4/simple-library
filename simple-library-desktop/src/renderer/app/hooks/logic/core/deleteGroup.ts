import {useModifyNotifications} from "../../base/notificationHooks";
import {useDispatchSetRootGroup} from "../../../store/collectionsState";
import {fetchRootGroup, requestDeleteGroup} from "../../../common/messagingInterface";
import {genNotificationId} from "../../base/notificationUtils";
import {AppNotificationType} from "../../../store/notificationState";
import {GroupDTO} from "../../../../../common/events/dtoModels";

export function useDeleteGroup() {

	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const {throwErrorNotification} = useModifyNotifications();

	function deleteGroup(groupId: number, keepContent: boolean): Promise<void> {
		return requestDeleteGroup(groupId, !keepContent)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GROUP_DELETE_FAILED, error))
	}

	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}

	return (groupId: number, keepContent: boolean) => {
		return Promise.resolve()
			.then(() => deleteGroup(groupId, keepContent))
			// TODO - Bug: what happens when keepContent = false -> deleting active collection ?
			.then(() => updateGroupState())
	}
}
