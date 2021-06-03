import React, {useState} from "react";
import {Theme} from "../../application";
import {WelcomeView} from "./WelcomeView";
import {
	CreateLibraryMessage,
	GetLastOpenedLibrariesMessage,
	OpenLibraryMessage
} from "../../../../common/messaging/messagesLibrary";
import {useNotifications} from "../../hooks/miscAppHooks";
import {AppNotificationType} from "../../store/state";
import {genNotificationId} from "../../common/utils/notificationUtils";
import {componentDidMount} from "../../common/utils/functionalReactLifecycle";
import {LastOpenedLibraryEntry} from "../../../../common/commonModels";
import {DialogCreateLibrary} from "./DialogCreateLibrary";

const electron = window.require('electron');
const {ipcRenderer} = window.require('electron');

export interface RecentlyUsedEntry {
	name: string,
	filePath: string,
	onAction: () => void,
}

interface WelcomeViewControllerProps {
	theme: Theme,
	onChangeTheme: () => void,
	onLoadProject: () => void
}

export function WelcomeViewController(props: React.PropsWithChildren<WelcomeViewControllerProps>): React.ReactElement {

	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const {notifications, addNotification, removeNotification} = useNotifications();
	const [recentlyUsed, setRecentlyUsed] = useState<RecentlyUsedEntry[]>([]);

	componentDidMount(() => {
		GetLastOpenedLibrariesMessage.request(ipcRenderer)
			.then((response: GetLastOpenedLibrariesMessage.ResponsePayload) => {
				setRecentlyUsed(response.lastOpened.map((entry: LastOpenedLibraryEntry) => ({
					name: entry.name,
					filePath: entry.path,
					onAction: () => openLibrary(entry.path)
				})))
			});
	});

	return (
		<>
			<WelcomeView
				recentlyUsed={recentlyUsed}
				notifications={notifications}
				onCloseNotification={removeNotification}
				onCreate={handleShowCreate}
				onOpen={handleOpen}
			/>
			{showCreateDialog && (<DialogCreateLibrary
				onCancel={handleCancelCreate}
				onCreate={handleCreate}
			/>)}
		</>
	);

	function handleShowCreate(): void {
		setShowCreateDialog(true)
	}

	function handleCancelCreate() {
		setShowCreateDialog(false)
	}

	function handleCreate(name: string, targetDir: string) {
		setShowCreateDialog(false)
		CreateLibraryMessage.request(ipcRenderer, {targetDir: targetDir, name: name})
			.then(() => props.onLoadProject())
			.catch(error => addNotification(genNotificationId(), AppNotificationType.OPEN_LIBRARY_FAILED, error));
	}

	function handleOpen(): void {
		electron.remote.dialog
			.showOpenDialog({
				title: 'Select Library',
				buttonLabel: 'Open',
				properties: [
					'openFile',
				],
				filters: [
					{
						name: 'All',
						extensions: ['*'],
					},
					{
						name: 'Libraries',
						extensions: ['db'],
					},
				],
			})
			.then((result: any) => {
				if (!result.canceled) {
					openLibrary(result.filePaths[0]);
				}
			});
	}

	function openLibrary(filepath: string): void {
		OpenLibraryMessage.request(ipcRenderer, {path: filepath})
			.then(() => props.onLoadProject())
			.catch(error => addNotification(genNotificationId(), AppNotificationType.OPEN_LIBRARY_FAILED, error));
	}

}
