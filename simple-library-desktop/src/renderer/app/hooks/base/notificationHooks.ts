import {toNotificationEntry} from "./notificationUtils";
import {NotificationStackEntry} from "../../../components/modals/notification/NotificationStack";
import {
	AppNotificationType,
	useDispatchAddNotification,
	useDispatchRemoveNotification,
	useDispatchUpdateNotification,
	useNotificationContext
} from "../../store/notificationState";


export function useNotificationsState() {

	const [state] = useNotificationContext();

	const {
		removeNotification,
	} = useModifyNotifications();

	function getNotificationStackEntries(): NotificationStackEntry[] {
		return state.notifications
			.map(notification => toNotificationEntry(notification, () => removeNotification(notification.id)))
	}

	return {
		notifications: state.notifications,
		getNotificationStackEntries: getNotificationStackEntries
	};
}


export function useThrowErrorWithNotification() {

	const dispatchAdd = useDispatchAddNotification();

	function throwError(notificationId: string, type: AppNotificationType, error: any) {
		dispatchAdd(notificationId, type, error);
		throw error
	}

	return throwError;
}


export function useModifyNotifications() {

	const dispatchAdd = useDispatchAddNotification();
	const dispatchRemove = useDispatchRemoveNotification();
	const dispatchUpdate = useDispatchUpdateNotification();

	function throwError(notificationId: string, type: AppNotificationType, error: any) {
		add(notificationId, type, error);
		throw error
	}

	function add(notificationId: string, type: AppNotificationType, data: any) {
		dispatchAdd(notificationId, type, data);
	}

	function remove(notificationId: string) {
		dispatchRemove(notificationId);
	}

	function update(notificationId: string, data: any) {
		dispatchUpdate(notificationId, data);
	}

	return {
		addNotification: add,
		throwErrorNotification: throwError,
		removeNotification: remove,
		updateNotification: update,
	};
}

