import {useLibraries} from "../../base/libraryHooks";

export function useAppToolbar() {

	const {
		closeLibrary
	} = useLibraries()

	return {
		closeLibrary: closeLibrary
	}

}