import {requestCloseLibrary} from "../../common/eventInterface";

export function useCloseLibrary(closeLibraryCallback: () => void) {

	function hookFunction() {
		requestCloseLibrary()
			.then(() => closeLibraryCallback())
	}

	return hookFunction;
}
