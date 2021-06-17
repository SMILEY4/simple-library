import {
	fetchRootGroup,
	requestCreateGroup,
	requestDeleteGroup,
	requestMoveGroup,
	requestRenameGroup
} from "../../common/messagingInterface";
import {genNotificationId} from "./notificationUtils";
import {extractGroups, Group} from "../../../../common/commonModels";
import {useNotifications} from "./notificationHooks";
import {AppNotificationType} from "../../store/notificationState";
import {CollectionsActionType, useCollectionsState} from "../../store/collectionsState";

export function useGroups() {

	const {throwErrorNotification} = useNotifications()
	const [collectionsState, collectionsDispatch] = useCollectionsState();


	// TODO: implement function "updateItemCounts", that only fetches and modifies that count -> no need to "rebuild" the whole tree
	function load(): Promise<void> {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: Group) => {
				collectionsDispatch({
					type: CollectionsActionType.SET_ROOT_GROUP,
					payload: group,
				});
			})
	}

	function find(groupId: number): Group | null {
		const result: Group | undefined = extractGroups(collectionsState.rootGroup).find(group => group.id === groupId);
		return result ? result : null;
	}

	function move(groupId: number, targetGroupId: number | null): Promise<void> {
		return requestMoveGroup(groupId, targetGroupId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GROUP_MOVE_FAILED, error))
			.then(() => load());
	}

	function deleteGroup(groupId: number, keepContent: boolean): Promise<void> {
		return requestDeleteGroup(groupId, !keepContent)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GROUP_DELETE_FAILED, error))
			.then(() => load())
	}

	function create(parentGroupId: number | null, name: string): Promise<void> {
		return requestCreateGroup(name, parentGroupId)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GROUP_CREATE_FAILED, error))
			.then(() => load())
	}

	function rename(groupId: number, newName: string): Promise<void> {
		return requestRenameGroup(groupId, newName)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.GROUP_RENAME_FAILED, error))
			.then(() => load())
	}

	return {
		rootGroup: collectionsState.rootGroup,
		loadGroups: load,
		findGroup: find,
		moveGroup: move,
		deleteGroup: deleteGroup,
		createGroup: create,
		renameGroup: rename
	}

}