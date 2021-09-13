import {requestOpenConfigFile} from "../../../common/messagingInterface";
import {genNotificationId} from "../../base/notificationUtils";
import {AppNotificationType, useThrowErrorWithNotification} from "../../../store/notificationState";

export function useOpenConfigFile() {

	const throwErrorNotification = useThrowErrorWithNotification()

	function hookFunction() {
		requestOpenConfigFile()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.OPEN_CONFIG_FILE_FAILED, error))
	}

	return hookFunction;
}
