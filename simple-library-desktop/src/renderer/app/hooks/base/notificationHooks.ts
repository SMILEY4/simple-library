import {genNotificationId, toNotificationEntry} from "./notificationUtils";
import {NotificationStackEntry} from "../../../components/modals/notification/NotificationStack";
import {AppNotificationType, NotificationActionType, useNotificationState} from "../../store/notificationState";

export function useNotifications() {

	const {state, dispatch} = useNotificationState();

	function throwError(notificationId: string, type: AppNotificationType, error: any) {
		add(notificationId, type, error);
		throw error
	}

	function add(notificationId: string, type: AppNotificationType, data: any) {
		dispatch({
			type: NotificationActionType.NOTIFICATIONS_ADD,
			payload: {
				notificationId: notificationId ? notificationId : genNotificationId(),
				notificationType: type,
				notificationData: data,
			},
		});
	}

	function remove(notificationId: string) {
		dispatch({
			type: NotificationActionType.NOTIFICATIONS_REMOVE,
			payload: {
				notificationId: notificationId,
			},
		});
	}

	function update(notificationId: string, data: any) {
		dispatch({
			type: NotificationActionType.NOTIFICATIONS_UPDATE,
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

