import {useState} from "react";
import {useLibraries} from "../base/libraryHooks";

const electron = window.require('electron');


export function useWelcome() {

	const [showCreateLibDialog, setShowCreateLibDialog] = useState(false);

	const {
		createLibrary,
		openLibrary
	} = useLibraries()

	function startCreateLibrary(): void {
		setShowCreateLibDialog(true)
	}

	function cancelCreateLibrary(): void {
		setShowCreateLibDialog(false)
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

	function create(name: string, targetDir: string): Promise<void> {
		setShowCreateLibDialog(false)
		return createLibrary(name, targetDir);
	}

	function browseLibrary(): Promise<string | null> {
		return electron.remote.dialog
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
					return openLibrary(result.filePaths[0]).then(() => result.filePaths[0])
				} else {
					return null;
				}
			});
	}

	function open(filepath: string): Promise<void> {
		return openLibrary(filepath)
	}

	return {
		showDialogCreateLibrary: showCreateLibDialog,
		openCreateLibrary: startCreateLibrary,
		cancelCreateLibrary: cancelCreateLibrary,
		browseTargetDir: browseTargetDir,
		createLibrary: create,
		browseLibrary: browseLibrary,
		openLibrary: open
	}

}