import {useState} from "react";
import {useMount} from "../../../components/utils/commonHooks";
import {fetchLastOpenedLibraries} from "../../common/messagingInterface";
import {useOpenLibrary} from "../../hooks/logic/core/libraryOpen";

const electron = window.require('electron');

export interface LastOpenedLibrary {
	name: string,
	filePath: string,
	onAction: () => void,
}


export function useWelcomeView(openedCallback: () => void) {

	const [lastOpened, setLastOpened] = useState<LastOpenedLibrary[]>([]);
	const openLibrary = useOpenLibrary(openedCallback);
	const browseLibraryAndOpen = useBrowseLibrariesAndOpen(openLibrary);

	useInitLastOpened(openLibrary, setLastOpened);

	return {
		lastOpenedLibraries: lastOpened,
		browseLibraryAndOpen: browseLibraryAndOpen,
		openLibrary: openLibrary
	}
}


function useInitLastOpened(openFunc: (path: string) => Promise<any>, setLastOpened: (e: LastOpenedLibrary[]) => void) {
	useMount(() => {
		fetchLastOpenedLibraries()
			.then(entries => entries.map(entry => ({
				name: entry.name,
				filePath: entry.path,
				onAction: () => openFunc(entry.path)
			})))
			.then(setLastOpened)
	});
}


function useBrowseLibrariesAndOpen(openFunc: (path: string) => Promise<any>) {

	function hookFunction(): Promise<string | null> {
		return electron.remote.dialog
			.showOpenDialog({
				title: 'Select Library',
				buttonLabel: 'Open',
				properties: ['openFile'],
				filters: [
					{name: 'All', extensions: ['*']},
					{name: 'Libraries', extensions: ['db']},
				],
			})
			.then((result: any) => {
				if (!result.canceled) {
					return openFunc(result.filePaths[0]).then(() => result.filePaths[0])
				} else {
					return null;
				}
			});
	}

	return hookFunction;
}
