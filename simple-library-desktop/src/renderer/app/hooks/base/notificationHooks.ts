import {toNotificationEntry} from "./notificationUtils";
import {NotificationStackEntry} from "../../../components/modals/notification/NotificationStack";
import {useDispatchRemoveNotification, useNotificationContext} from "../../store/notificationState";


export function useNotificationsState() {

	const [state] = useNotificationContext();
	const removeNotification = useDispatchRemoveNotification();

	function getNotificationStackEntries(): NotificationStackEntry[] {
		return state.notifications
			.map(notification => toNotificationEntry(notification, () => removeNotification(notification.id)))
	}

	return {
		notifications: state.notifications,
		getNotificationStackEntries: getNotificationStackEntries
	};
}

