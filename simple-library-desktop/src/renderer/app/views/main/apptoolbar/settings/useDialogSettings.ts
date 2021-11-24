import {useOpenConfigFile} from "../../../../hooks/core/configFileOpen";
import {useApplicationConfig} from "../../../../hooks/core/configApplication";
import {useEffect, useState} from "react";
import {ApplicationConfigDTO, AttributeKeyDTO, attributeKeysDtoEquals} from "../../../../../../common/events/dtoModels";
import {useHideAttributes} from "../../../../hooks/core/hiddenAttributes";

export enum SettingsDialogTab {
	APP,
	ATTRIBUTES,
}

export function useDialogSettings(onClose: () => void) {

	const [currentTab, setCurrentTab] = useState(SettingsDialogTab.APP);
	const [hiddenAttributes, setHiddenAttributes] = useState<AttributeKeyDTO[]>([]);

	const openConfigFile = useOpenConfigFile();
	const {
		config,
		setAppConfig,
		commitAppConfig,
		discardAppConfig
	} = useApplicationConfig();
	const {
		showAttributes,
		hideAttributes,
		getHiddenAttributes
	} = useHideAttributes();

	useEffect(() => {
		getHiddenAttributes().then(setHiddenAttributes);
	}, []);

	function handleCancel() {
		discardAppConfig()
			.then(() => discardHiddenAttributes())
			.then(() => onClose());
	}

	function handleSave() {
		commitAppConfig()
			.then(() => commitHiddenAttributes())
			.then(() => onClose());
	}

	function handleSetAppConfig(config: ApplicationConfigDTO) {
		setAppConfig(config);
	}

	function handleHideAttribute(attribute: AttributeKeyDTO) {
		const attribs = [...hiddenAttributes.filter(a => !attributeKeysDtoEquals(a, attribute)), attribute];
		setHiddenAttributes(attribs.sort((a, b) => a.name.localeCompare(b.name)));
	}

	function handleShowAttribute(attribute: AttributeKeyDTO) {
		const attribs = hiddenAttributes.filter(a => !attributeKeysDtoEquals(a, attribute));
		setHiddenAttributes(attribs);
	}

	function discardHiddenAttributes(): Promise<any> {
		return getHiddenAttributes().then(setHiddenAttributes);
	}

	async function commitHiddenAttributes(): Promise<any> {
		const base = await getHiddenAttributes();

		const added = hiddenAttributes.filter(a => base.findIndex(b => attributeKeysDtoEquals(a, b)) === -1);
		const removed = base.filter(b => hiddenAttributes.findIndex(a => attributeKeysDtoEquals(a, b)) !== -1);

		return showAttributes(removed)
			.then(() => hideAttributes(added))
			.then(() => getHiddenAttributes())
			.then(setHiddenAttributes);
	}

	return {
		currentTab: currentTab,
		setCurrentTab: setCurrentTab,
		handleCancel: handleCancel,
		handleSave: handleSave,
		handleOpenConfigFile: openConfigFile,
		appConfig: config,
		setAppConfig: handleSetAppConfig,
		hiddenAttributes: hiddenAttributes,
		hideAttribute: handleHideAttribute,
		showAttribute: handleShowAttribute
	};


}
