import {
	fetchRootGroup,
	requestCreateGroup,
	requestDeleteGroup,
	requestMoveGroup,
	requestRenameGroup
} from "../common/messaging/messagingInterface";
import {genNotificationId} from "../common/utils/notificationUtils";
import {AppNotificationType} from "../store/state";
import {useGlobalState} from "./old/miscAppHooks";
import {ActionType} from "../store/reducer";
import {extractGroups, Group} from "../../../common/commonModels";
import {useNotifications} from "./notificationHooks";

export function useGroups() {

	const {state, dispatch} = useGlobalState();
	const {throwErrorNotification} = useNotifications()

	function load(): Promise<void> {
		return fetchRootGroup()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error))
			.then((group: Group) => {
				dispatch({
					type: ActionType.SET_ROOT_GROUP,
					payload: group,
				});
			})
	}

	function find(groupId: number): Group | null {
		const result: Group | undefined = extractGroups(state.rootGroup).find(group => group.id === groupId);
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
		rootGroup: state.rootGroup,
		loadGroups: load,
		findGroup: find,
		moveGroup: move,
		deleteGroup: deleteGroup,
		createGroup: create,
		renameGroup: rename
	}

}