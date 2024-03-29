import {fetchRootGroup, requestRenameGroup} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {GroupDTO} from "../../../../common/events/dtoModels";
import {useDispatchSetRootGroup} from "../store/collectionsState";

export function useEditGroup() {

	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(groupId: number, newName: string) {
		Promise.resolve()
			.then(() => rename(groupId, newName))
			.then(() => updateGroupState())
	}

	function rename(groupId: number, newName: string) {
		return requestRenameGroup(groupId, newName)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GROUP_RENAME_FAILED, error))
	}

	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}

	return hookFunction;
}
