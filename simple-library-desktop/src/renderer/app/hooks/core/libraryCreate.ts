import {requestCreateLibrary} from "../../common/eventInterface";
import {genNotificationId} from "../../common/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../store/notificationState";

export function useCreateLibrary() {

	const throwErrorNotification = useThrowErrorWithNotification();

	function hookFunction(name: string, targetDir: string) {
		return requestCreateLibrary(name, targetDir)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.OPEN_LIBRARY_FAILED, error));
	}

	return hookFunction;
}
