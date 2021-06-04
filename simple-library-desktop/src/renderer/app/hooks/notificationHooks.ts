import {AppNotificationType} from "../store/state";
import {ActionType} from "../store/reducer";
import {genNotificationId, toNotificationEntry} from "../common/utils/notificationUtils";
import {useGlobalState} from "./old/miscAppHooks";
import {NotificationProps} from "../../newcomponents/modals/notification/Notification";
import {Type} from "../../components/common/common";

export function useNotifications() {

	const {state, dispatch} = useGlobalState();

	const add = (notificationId: string, type: AppNotificationType, data: any) => {
		dispatch({
			type: ActionType.NOTIFICATIONS_ADD,
			payload: {
				notificationId: notificationId ? notificationId : genNotificationId(),
				notificationType: type,
				notificationData: data,
			},
		});
	};

	function remove(notificationId: string) {
		dispatch({
			type: ActionType.NOTIFICATIONS_REMOVE,
			payload: {
				notificationId: notificationId,
			},
		});
	}

	function update(notificationId: string, data: any) {
		dispatch({
			type: ActionType.NOTIFICATIONS_UPDATE,
			payload: {
				notificationId: notificationId,
				notificationData: data,
			},
		});
	}

	function getNotificationProps(): NotificationProps[] {
		return state.notifications
			.map(notification => toNotificationEntry(notification, () => remove(notification.id)))
			.map(notification => ({
				type: convertNotificationType(notification.type),
				icon: notification.icon,
				title: notification.title,
				caption: notification.caption,
				onClose: notification.onClose,
				closable: true,
				children: notification.content
			}))
	}

	function convertNotificationType(type: Type): "info" | "success" | "warn" | "error" {
		switch (type) {
			case Type.DEFAULT:
				return "info"
			case Type.PRIMARY:
				return "info";
			case Type.SUCCESS:
				return "success";
			case Type.ERROR:
				return "error";
			case Type.WARN:
				return "warn";
		}
	}

	return {
		notifications: state.notifications,
		addNotification: add,
		removeNotification: remove,
		updateNotification: update,
		getNotificationProps: getNotificationProps
	};
}
