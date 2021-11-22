import {useOpenConfigFile} from "../../../../hooks/core/configFileOpen";
import {useApplicationConfig} from "../../../../hooks/core/configApplication";
import {useState} from "react";
import {ApplicationConfigDTO} from "../../../../../../common/events/dtoModels";

export enum SettingsDialogTab {
	APP,
	PLACEHOLDER,
}

export function useDialogSettings(onClose: () => void) {

	const [currentTab, setCurrentTab] = useState(SettingsDialogTab.APP);

	const openConfigFile = useOpenConfigFile();
	const {
		config,
		setAppConfig,
		commitAppConfig,
		discardAppConfig
	} = useApplicationConfig();


	function handleCancel() {
		discardAppConfig()
			.then(() => onClose());
	}

	function handleSave() {
		commitAppConfig()
			.then(() => onClose());
	}

	function handleSetAppConfig(config: ApplicationConfigDTO) {
		setAppConfig(config);
	}

	return {
		currentTab: currentTab,
		setCurrentTab: setCurrentTab,
		handleCancel: handleCancel,
		handleSave: handleSave,
		handleOpenConfigFile: openConfigFile,
		appConfig: config,
		setAppConfig: handleSetAppConfig
	};


}
