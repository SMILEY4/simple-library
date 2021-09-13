import {useCloseLibrary} from "../../../hooks/core/libraryClose";
import {useOpenConfigFile} from "../../../hooks/core/configFileOpen";


export function useAppToolbar(closeLibraryCallback: () => void) {

	const closeLibrary = useCloseLibrary(closeLibraryCallback)
	const openConfigFile = useOpenConfigFile();

	return {
		closeLibrary: closeLibrary,
		openConfigFile: openConfigFile
	}

}
