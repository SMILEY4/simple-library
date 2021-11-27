import {useOpenConfigFile} from "../../../../hooks/core/configFileOpen";
import {useApplicationConfig} from "../../../../hooks/core/configApplication";
import {useEffect, useState} from "react";
import {ApplicationConfigDTO, AttributeMetaDTO} from "../../../../../../common/events/dtoModels";
import {useHideAttributes} from "../../../../hooks/core/hiddenAttributes";
import {ArrayUtils} from "../../../../../../common/arrayUtils";

export enum SettingsDialogTab {
	APP,
	ATTRIBUTES,
}

export function useDialogSettings(onClose: () => void) {

	const [currentTab, setCurrentTab] = useState(SettingsDialogTab.APP);
	const [hiddenAttributes, setHiddenAttributes] = useState<AttributeMetaDTO[]>([]);

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

	function handleHideAttribute(attribute: AttributeMetaDTO) {
		const attribs = [...hiddenAttributes.filter(a => a.attId !== attribute.attId), attribute];
		setHiddenAttributes(attribs.sort((a, b) => a.key.name.localeCompare(b.key.name)));
	}

	function handleShowAttribute(attribute: AttributeMetaDTO) {
		const attribs = hiddenAttributes.filter(a => a.attId !== attribute.attId);
		setHiddenAttributes(attribs);
	}

	function discardHiddenAttributes(): Promise<any> {
		return getHiddenAttributes().then(setHiddenAttributes);
	}

	async function commitHiddenAttributes(): Promise<any> {
		const currIds = (await getHiddenAttributes()).map(a => a.attId);
		const newIds = hiddenAttributes.map(a => a.attId);

		const added = newIds.filter(e => ArrayUtils.containsNot(currIds, e));
		const removed = currIds.filter(e => ArrayUtils.containsNot(newIds, e));

		if (removed.length > 0) {
			await showAttributes(removed);
		}
		if (added.length > 0) {
			await hideAttributes(added);
		}
		if (removed.length > 0 && added.length > 0) {
			return getHiddenAttributes()
				.then(setHiddenAttributes);
		} else {
			return Promise.resolve();
		}
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
