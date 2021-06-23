import {useLibraries} from "../../base/libraryHooks";
import {requestOpenConfigFile} from "../../../common/messagingInterface";
import {useModifyNotifications} from "../../base/notificationHooks";
import {genNotificationId} from "../../base/notificationUtils";
import {AppNotificationType} from "../../../store/notificationState";


export function useAppToolbar() {

	const {
		closeLibrary
	} = useLibraries()

	const {
		throwErrorNotification,
	} = useModifyNotifications()

	function openConfigFile() {
		requestOpenConfigFile()
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.OPEN_CONFIG_FILE_FAILED, error))
	}

	return {
		closeLibrary: closeLibrary,
		openConfigFile: openConfigFile
	}

}