import {useLastOpenedLibraries, useLibraries} from "../../base/libraryHooks";

const electron = window.require('electron');


export function useWelcome(onOpenRecent?: (path: string) => void) {

	const {
		lastOpenedLibraries
	} = useLastOpenedLibraries(onOpenRecent);

	const {
		openLibrary
	} = useLibraries()

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
		lastOpenedLibraries: lastOpenedLibraries,
		browseLibrary: browseLibrary,
		openLibrary: open
	}

}