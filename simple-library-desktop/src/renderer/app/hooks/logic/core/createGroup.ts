import {fetchRootGroup, requestCreateGroup} from "../../../common/messagingInterface";
import {genNotificationId} from "../../base/notificationUtils";
import {AppNotificationType} from "../../../store/notificationState";
import {GroupDTO} from "../../../../../common/events/dtoModels";
import {useModifyNotifications} from "../../base/notificationHooks";
import {useDispatchSetRootGroup} from "../../../store/collectionsState";

export function useCreateGroup() {

	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const {throwErrorNotification} = useModifyNotifications();

	function create(name: string, parentGroupId: number | null) {
		return requestCreateGroup(name, parentGroupId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GROUP_CREATE_FAILED, error))
	}

	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}

	return (name: string, parentGroupId: number | null) => {
		return Promise.resolve()
			.then(() => create(name, parentGroupId))
			.then(() => updateGroupState())
	}
}
