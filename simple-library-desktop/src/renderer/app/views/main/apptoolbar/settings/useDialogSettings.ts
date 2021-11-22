import {useOpenConfigFile} from "../../../../hooks/core/configFileOpen";

export function useDialogSettings(onClose: () => void) {

	const openConfigFile = useOpenConfigFile();

	function handleCancel() {
		onClose();
	}

	function handleSave() {
		onClose();
	}

	return {
		handleCancel: handleCancel,
		handleSave: handleSave,
		handleOpenConfigFile: openConfigFile
	};


}
