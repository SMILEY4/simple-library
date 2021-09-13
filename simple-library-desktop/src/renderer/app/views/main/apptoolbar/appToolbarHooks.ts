import {useCloseLibrary} from "../../../hooks/logic/core/libraryClose";
import {useOpenConfigFile} from "../../../hooks/logic/core/configFileOpen";


export function useAppToolbar(closeLibraryCallback: () => void) {

	const closeLibrary = useCloseLibrary(closeLibraryCallback)
	const openConfigFile = useOpenConfigFile();

	return {
		closeLibrary: closeLibrary,
		openConfigFile: openConfigFile
	}

}
