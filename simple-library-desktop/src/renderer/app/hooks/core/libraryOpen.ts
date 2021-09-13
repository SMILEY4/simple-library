import {requestOpenLibrary} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";

export function useOpenLibrary(openedCallback: () => void) {

	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(filepath: string) {
		return requestOpenLibrary(filepath)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.OPEN_LIBRARY_FAILED, error))
			.then(() => openedCallback());
	}

	return hookFunction;
}

