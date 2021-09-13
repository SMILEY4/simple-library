import {requestCloseLibrary} from "../../../common/messagingInterface";

export function useCloseLibrary(closeLibraryCallback: () => void) {

	function hookFunction() {
		requestCloseLibrary()
			.then(() => closeLibraryCallback())
	}

	return hookFunction;
}
