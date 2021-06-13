import {genNotificationId, toNotificationEntry} from "./notificationUtils";
import {useGlobalState} from "./miscAppHooks";
import {NotificationStackEntry} from "../../../components/modals/notification/NotificationStack";
import {AppActionType, AppNotificationType} from "../../store/globalAppState";

export function useNotifications() {

	const {state, dispatch} = useGlobalState();

	function throwError(notificationId: string, type: AppNotificationType, error: any) {
		add(notificationId, type, error);
		throw error
	}

	function add(notificationId: string, type: AppNotificationType, data: any) {
		dispatch({
			type: AppActionType.NOTIFICATIONS_ADD,
			payload: {
				notificationId: notificationId ? notificationId : genNotificationId(),
				notificationType: type,
				notificationData: data,
			},
		});
	}

	function remove(notificationId: string) {
		dispatch({
			type: AppActionType.NOTIFICATIONS_REMOVE,
			payload: {
				notificationId: notificationId,
			},
		});
	}

	function update(notificationId: string, data: any) {
		dispatch({
			type: AppActionType.NOTIFICATIONS_UPDATE,
			payload: {
				notificationId: notificationId,
				notificationData: data,
			},
		});
	}

	function getNotificationStackEntries(): NotificationStackEntry[] {
		return state.notifications
			.map(notification => toNotificationEntry(notification, () => remove(notification.id)))
	}

	return {
		notifications: state.notifications,
		addNotification: add,
		throwErrorNotification: throwError,
		removeNotification: remove,
		updateNotification: update,
		getNotificationStackEntries: getNotificationStackEntries
	};
}

