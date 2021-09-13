import {fetchRootGroup, requestCreateCollection} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";
import {CollectionTypeDTO, GroupDTO} from "../../../../common/events/dtoModels";
import {useDispatchSetRootGroup} from "../store/collectionsState";

export function useCreateCollection() {

	const dispatchSetRootGroup = useDispatchSetRootGroup();
	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(name: string, type: CollectionTypeDTO, query: string | null, parentGroupId: number | null) {
		return Promise.resolve()
			.then(() => create(name, type, query, parentGroupId))
			.then(() => updateGroupState());
	}

	function create(name: string, type: CollectionTypeDTO, query: string | null, parentGroupId: number | null) {
		return requestCreateCollection(name, type, type === "smart" ? query : null, parentGroupId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.COLLECTION_CREATE_FAILED, error))
	}

	function updateGroupState() {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: GroupDTO) => dispatchSetRootGroup(group));
	}

	return hookFunction;
}
