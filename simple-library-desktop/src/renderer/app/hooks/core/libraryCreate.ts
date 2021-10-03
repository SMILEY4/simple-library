import {requestCreateLibrary} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {
	AppNotificationType,
	useDispatchAddNotification,
	useDispatchRemoveNotification,
	useThrowErrorWithNotification
} from "../store/notificationState";

export function useCreateLibrary() {

	const notificationAdd = useDispatchAddNotification();
	const notificationRemove = useDispatchRemoveNotification();
	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(name: string, targetDir: string) {
		const notificationId = genNotificationId();
		notificationAdd(notificationId, AppNotificationType.CREATE_LIBRARY, null);
		return requestCreateLibrary(name, targetDir)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.OPEN_LIBRARY_FAILED, error))
			.finally(() => notificationRemove(notificationId));
	}

	return hookFunction;
}
