import {fetchRootGroup, requestRenameGroup} from "../../../common/messagingInterface";
import {genNotificationId} from "../../base/notificationUtils";
import {AppNotificationType} from "../../../store/notificationState";
import {GroupDTO} from "../../../../../common/events/dtoModels";
import {useModifyNotifications} from "../../base/notificationHooks";
import {useDispatchSetRootGroup} from "../../../store/collectionsState";

export function useEditGroup() {

	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const {throwErrorNotification} = useModifyNotifications();

	function rename(groupId: number, newName: string) {
		return requestRenameGroup(groupId, newName)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GROUP_RENAME_FAILED, error))
	}

	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}

	return (groupId: number, newName: string) => {
		Promise.resolve()
			.then(() => rename(groupId, newName))
			.then(() => updateGroupState())
	}
}
