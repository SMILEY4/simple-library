import {fetchLastOpenedLibraries} from "../../../common/messagingInterface";

export interface LastOpenedLibrary {
	name: string,
	filePath: string,
	onAction: () => void,
}

export function useGetLastOpenedLibraries(openLibrary: (filepath: string) => void) {

	function hookFunction(): Promise<LastOpenedLibrary[]> {
		return fetchLastOpenedLibraries()
			.then(entries => entries.map(entry => ({
				name: entry.name,
				filePath: entry.path,
				onAction: () => openLibrary(entry.path)
			})))
	}

	return hookFunction;
}
