import {useMount} from "./miscHooks";
import {fetchRootGroup, requestDeleteGroup, requestMoveGroup} from "../common/messaging/messagingInterface";
import {genNotificationId} from "../common/utils/notificationUtils";
import {AppNotificationType} from "../store/state";
import {useGlobalState} from "./old/miscAppHooks";
import {ActionType} from "../store/reducer";
import {extractGroups, Group} from "../../../common/commonModels";
import {useNotifications} from "./notificationHooks";

export function useGroups() {

	const {state, dispatch} = useGlobalState();
	const {addNotification} = useNotifications()

	useMount(() => load())

	function load(): void {
		fetchRootGroup()
			.then((group: Group) => {
				dispatch({
					type: ActionType.SET_ROOT_GROUP,
					payload: group,
				});
			})
			.catch(error => addNotification(genNotificationId(), AppNotificationType.ROOT_GROUP_FETCH_FAILED, error));
	}

	function find(groupId: number): Group | null {
		const result: Group | undefined = extractGroups(state.rootGroup).find(group => group.id === groupId);
		return result ? result : null;
	}

	function move(groupId: number, targetGroupId: number | null): void {
		requestMoveGroup(groupId, targetGroupId)
			.catch(error => addNotification(genNotificationId(), AppNotificationType.GROUP_MOVE_FAILED, error))
			.then(() => load());
	}

	function deleteGroup(groupId: number, keepContent: boolean): void {
		requestDeleteGroup(groupId, !keepContent)
			.catch(error => addNotification(genNotificationId(), AppNotificationType.GROUP_DELETE_FAILED, error))
			.then(() => load())
	}

	return {
		rootGroup: state.rootGroup,
		loadGroups: load,
		findGroup: find,
		moveGroup: move,
		deleteGroup: deleteGroup
	}

}