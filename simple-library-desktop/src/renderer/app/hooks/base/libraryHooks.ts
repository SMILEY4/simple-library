import {
	fetchLastOpenedLibraries,
	requestCloseLibrary,
	requestCreateLibrary,
	requestOpenLibrary
} from "../../common/messagingInterface";
import {useState} from "react";
import {genNotificationId} from "./notificationUtils";
import {useModifyNotifications} from "./notificationHooks";
import {useMount} from "../../../components/utils/commonHooks";
import {AppNotificationType} from "../../store/notificationState";

export interface LastOpenedLibrary {
	name: string,
	filePath: string,
	onAction: () => void,
}

export function useLastOpenedLibraries(onOpen?: (path: string) => void) {

	const [lastOpened, setLastOpened] = useState<LastOpenedLibrary[]>([]);

	useMount(() => {
		fetchLastOpenedLibraries()
			.then(entries => entries.map(entry => ({
				name: entry.name,
				filePath: entry.path,
				onAction: () => onOpen && onOpen(entry.path)
			})))
			.then(setLastOpened)
	});

	return {
		lastOpenedLibraries: lastOpened
	}
}


export function useLibraries() {

	const {throwErrorNotification} = useModifyNotifications();

	function create(name: string, targetDir: string): Promise<void> {
		return requestCreateLibrary(name, targetDir)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.OPEN_LIBRARY_FAILED, error));
	}

	function open(filepath: string): Promise<void> {
		return requestOpenLibrary(filepath)
			.catch(error => throwErrorNotification(genNotificationId(), AppNotificationType.OPEN_LIBRARY_FAILED, error));
	}

	function close(): Promise<void> {
		return requestCloseLibrary();
	}

	return {
		createLibrary: create,
		openLibrary: open,
		closeLibrary: close
	}
}
