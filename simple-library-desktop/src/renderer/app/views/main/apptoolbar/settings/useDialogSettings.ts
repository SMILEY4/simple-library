import {useOpenConfigFile} from "../../../../hooks/core/configFileOpen";
import {useApplicationConfig} from "../../../../hooks/core/configApplication";
import {useEffect, useState} from "react";
import {
	ApplicationConfigDTO,
	AttributeMetaDTO,
	DefaultAttributeValueEntryDTO
} from "../../../../../../common/events/dtoModels";
import {useHideAttributes} from "../../../../hooks/core/hiddenAttributes";
import {ArrayUtils} from "../../../../../../common/arrayUtils";
import {useDefaultAttributeValues} from "../../../../hooks/core/defaultAttributeValues";

export enum SettingsDialogTab {
	APP,
	ATTRIBUTES,
}

export function useDialogSettings(onClose: () => void) {

	const [currentTab, setCurrentTab] = useState(SettingsDialogTab.APP);

	const openConfigFile = useOpenConfigFile();

	const {
		config,
		setAppConfig
	} = useApplicationSettingsDialog();

	const {
		hiddenAttributes,
		hideAttribute,
		showAttribute,
		discardHiddenAttributes,
		commitHiddenAttributes
	} = useHiddenAttributeSettingsDialog();

	const {
		defaultAttributeValueEntries,
		setDefaultAttributeValue,
		deleteDefaultAttributeValue,
		discardDefaultAttributeValues,
		commitDefaultAttributeValues
	} = useDefaultAttributeValuesSettingsDialog();

	const {
		commitAppConfig,
		discardAppConfig
	} = useApplicationConfig();

	function handleCancel() {
		discardAppConfig()
			.then(() => discardHiddenAttributes())
			.then(() => discardDefaultAttributeValues())
			.then(() => onClose());
	}

	function handleSave() {
		commitAppConfig()
			.then(() => commitHiddenAttributes())
			.then(() => commitDefaultAttributeValues())
			.then(() => onClose());
	}

	return {
		currentTab: currentTab,
		setCurrentTab: setCurrentTab,
		handleCancel: handleCancel,
		handleSave: handleSave,
		handleOpenConfigFile: openConfigFile,
		appConfig: config,
		setAppConfig: setAppConfig,
		hiddenAttributes: hiddenAttributes,
		hideAttribute: hideAttribute,
		showAttribute: showAttribute,
		defaultAttributeValues: defaultAttributeValueEntries,
		setDefaultAttributeValue: setDefaultAttributeValue,
		deleteDefaultAttributeValue: deleteDefaultAttributeValue
	};
}


export function useApplicationSettingsDialog() {

	const {
		config,
		setAppConfig
	} = useApplicationConfig();

	function handleSetAppConfig(config: ApplicationConfigDTO) {
		setAppConfig(config);
	}

	return {
		config: config,
		setAppConfig: handleSetAppConfig
	};

}


export function useHiddenAttributeSettingsDialog() {

	const [hiddenAttributes, setHiddenAttributes] = useState<AttributeMetaDTO[]>([]);

	const {
		showAttributes,
		hideAttributes,
		getHiddenAttributes
	} = useHideAttributes();

	useEffect(() => {
		getHiddenAttributes().then(setHiddenAttributes);
	}, []);


	function hide(attribute: AttributeMetaDTO) {
		const attribs = [...hiddenAttributes.filter(a => a.attId !== attribute.attId), attribute];
		setHiddenAttributes(attribs.sort((a, b) => a.key.name.localeCompare(b.key.name)));
	}

	function show(attribute: AttributeMetaDTO) {
		const attribs = hiddenAttributes.filter(a => a.attId !== attribute.attId);
		setHiddenAttributes(attribs);
	}

	function discard(): Promise<any> {
		return getHiddenAttributes().then(setHiddenAttributes);
	}

	async function commit(): Promise<any> {
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
		hiddenAttributes: hiddenAttributes,
		hideAttribute: hide,
		showAttribute: show,
		discardHiddenAttributes: discard,
		commitHiddenAttributes: commit
	};

}


export function useDefaultAttributeValuesSettingsDialog() {

	const [entries, setEntries] = useState<DefaultAttributeValueEntryDTO[]>([]);

	const {
		getDefaultAttributeValues,
		setDefaultAttributeValues
	} = useDefaultAttributeValues();


	useEffect(() => {
		getDefaultAttributeValues().then(setEntries);
	}, []);


	function setEntry(entry: DefaultAttributeValueEntryDTO) {
		if (ArrayUtils.contains(entries, entry, (a, b) => a.attributeMeta.attId === b.attributeMeta.attId)) {
			setEntries(entries.map(e => e.attributeMeta.attId === entry.attributeMeta.attId ? entry : e));
		} else {
			setEntries([...entries, entry].sort((a, b) => a.attributeMeta.key.name.localeCompare(b.attributeMeta.key.name)));
		}
	}

	function deleteEntry(attId: number) {
		setEntries(entries.filter(e => e.attributeMeta.attId !== attId));
	}

	function discard(): Promise<any> {
		return getDefaultAttributeValues().then(setEntries);
	}

	async function commit(): Promise<any> {
		return setDefaultAttributeValues(entries);
	}

	return {
		defaultAttributeValueEntries: entries,
		setDefaultAttributeValue: setEntry,
		deleteDefaultAttributeValue: deleteEntry,
		discardDefaultAttributeValues: discard,
		commitDefaultAttributeValues: commit
	};

}


