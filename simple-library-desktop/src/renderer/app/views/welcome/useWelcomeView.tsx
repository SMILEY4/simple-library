import {useState} from "react";
import {useMount} from "../../../components/utils/commonHooks";
import {useOpenLibrary} from "../../hooks/logic/core/libraryOpen";
import {LastOpenedLibrary, useGetLastOpenedLibraries} from "../../hooks/logic/core/librariesGetLastOpened";

const electron = window.require('electron');


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


function useInitLastOpened(openLibrary: (path: string) => Promise<any>, setLastOpened: (e: LastOpenedLibrary[]) => void) {
	const getLastOpened = useGetLastOpenedLibraries(openLibrary)

	useMount(() => {
		getLastOpened().then(setLastOpened)
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
