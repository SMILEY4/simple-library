import {useDispatchSetRootGroup} from "../store/collectionsState";
import {fetchRootGroup, requestDeleteGroup} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {GroupDTO} from "../../../../common/events/dtoModels";

export function useDeleteGroup() {

	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(groupId: number, keepContent: boolean) {
		return Promise.resolve()
			.then(() => deleteGroup(groupId, keepContent))
			// TODO - Bug?: what happens when keepContent = false -> deleting active collection ?
			.then(() => updateGroupState())
	}

	function deleteGroup(groupId: number, keepContent: boolean): Promise<void> {
		return requestDeleteGroup(groupId, !keepContent)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GROUP_DELETE_FAILED, error))
	}

	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}

	return hookFunction;
}
