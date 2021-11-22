import {useCloseLibrary} from "../../../hooks/core/libraryClose";


export function useAppToolbar(closeLibraryCallback: () => void) {

	const closeLibrary = useCloseLibrary(closeLibraryCallback);

	return {
		closeLibrary: closeLibrary
	};

}
