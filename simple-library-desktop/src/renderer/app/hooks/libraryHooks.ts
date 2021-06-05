import {
	fetchLastOpenedLibraries,
	requestCloseLibrary,
	requestCreateLibrary,
	requestOpenLibrary
} from "../common/messaging/messagingInterface";
import {useState} from "react";
import {useMount} from "./miscHooks";
import {genNotificationId} from "../common/utils/notificationUtils";
import {AppNotificationType} from "../store/state";
import {useNotifications} from "./notificationHooks";

const electron = window.require('electron');

export interface LastOpenedLibrary {
	name: string,
	filePath: string,
	onAction: () => void,
}

export function useLastOpenedLibraries(onOpen: (path: string) => void) {

	const [lastOpened, setLastOpened] = useState<LastOpenedLibrary[]>([]);

	useMount(() => {
		fetchLastOpenedLibraries()
			.then(entries => entries.map(entry => ({
				name: entry.name,
				filePath: entry.path,
				onAction: () => onOpen(entry.path)
			})))
			.then(setLastOpened)
	});

	return {
		lastOpenedLibraries: lastOpened
	}
}


export function useCreateLibrary(onLoadLibrary?: () => void) {

	const {addNotification} = useNotifications();
	const [showDialog, setShowDialog] = useState(false);

	function start(): void {
		setShowDialog(true)
	}

	function cancel(): void {
		setShowDialog(false)
	}

	function browseTargetDir(): Promise<string | null> {
		return electron.remote.dialog
			.showOpenDialog({
				title: 'Select target directory',
				buttonLabel: 'Select',
				properties: [
					'openDirectory',
					'createDirectory',
				],
			})
			.then((result: any) => {
				if (result.canceled) {
					return null;
				} else {
					return result.filePaths[0];
				}
			});
	}

	function create(name: string, targetDir: string) {
		setShowDialog(false)
		requestCreateLibrary(name, targetDir)
			.then(() => onLoadLibrary && onLoadLibrary())
			.catch(error => addNotification(genNotificationId(), AppNotificationType.OPEN_LIBRARY_FAILED, error));
	}

	return {
		showCreateLibraryDialog: showDialog,
		startCreateLibrary: start,
		cancelCreateLibrary: cancel,
		browseTargetDir: browseTargetDir,
		createLibrary: create
	}
}

export function useOpenLibrary(onLoadLibrary: () => void) {

	const {addNotification} = useNotifications();

	function browse(): void {
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
					open(result.filePaths[0]);
				}
			});
	}

	function open(filepath: string): void {
		requestOpenLibrary(filepath)
			.then(() => {
				console.log("opened library", filepath)
				onLoadLibrary()
			})
			.catch(error => {
				console.log("error opening library", filepath, error)
				addNotification(genNotificationId(), AppNotificationType.OPEN_LIBRARY_FAILED, error)
			});
	}

	return {
		browseLibraries: browse,
		openLibrary: open
	}
}


export function useCloseLibrary(onClose: () => void) {

	function close(): void {
		requestCloseLibrary()
			.then(() => onClose())
	}

	return {
		closeLibrary: close
	}
}

