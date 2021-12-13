import {useOpenConfigFile} from "../../../../hooks/core/configFileOpen";
import {useApplicationConfig} from "../../../../hooks/core/configApplication";
import {useEffect, useState} from "react";
import {
	ApplicationConfigDTO,
	AttributeKeyDTO,
	AttributeMetaDTO,
	DefaultAttributeValueEntryDTO
} from "../../../../../../common/events/dtoModels";
import {useHideAttributes} from "../../../../hooks/core/hiddenAttributes";
import {ArrayUtils} from "../../../../../../common/arrayUtils";
import {useDefaultAttributeValues} from "../../../../hooks/core/defaultAttributeValues";
import {fetchItemListAttributes, requestSetItemListAttributes} from "../../../../common/eventInterface";
import {useLoadItems} from "../../../../hooks/core/itemsLoad";
import {useCustomAttributes} from "../../../../hooks/core/customAttributes";

export enum SettingsDialogTab {
	APP,
	ATTRIBUTES,
	APPEARANCE
}

export function useDialogSettings(onClose: () => void) {

	const [currentTab, setCurrentTab] = useState(SettingsDialogTab.APP);

	const openConfigFile = useOpenConfigFile();

	const {
		commitAppConfig,
		discardAppConfig
	} = useApplicationConfig();

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
		customAttributes,
		createCustomAttribute,
		deleteCustomAttribute,
		discardCustomAttributes,
		commitCustomAttributes
	} = useCreateCustomAttributesSettingsDialog();

	const {
		listAppearanceEntries,
		addListAppearanceEntry,
		deleteListAppearanceEntry,
		moveListAppearanceEntryUp,
		moveListAppearanceEntryDown,
		discardListAppearanceEntries,
		commitListAppearanceEntries
	} = useListAppearanceSettingsDialog();

	function handleCancel() {
		discardAppConfig()
			.then(() => discardHiddenAttributes())
			.then(() => discardDefaultAttributeValues())
			.then(() => discardCustomAttributes())
			.then(() => discardListAppearanceEntries())
			.then(() => onClose());
	}

	function handleSave() {
		commitAppConfig()
			.then(() => commitHiddenAttributes())
			.then(() => commitDefaultAttributeValues())
			.then(() => commitCustomAttributes())
			.then(() => commitListAppearanceEntries())
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
		deleteDefaultAttributeValue: deleteDefaultAttributeValue,

		customAttributes: customAttributes,
		createCustomAttribute: createCustomAttribute,
		deleteCustomAttribute: deleteCustomAttribute,

		listAppearanceEntries: listAppearanceEntries,
		addListAppearanceEntry: addListAppearanceEntry,
		deleteListAppearanceEntry: deleteListAppearanceEntry,
		moveListAppearanceEntryUp: moveListAppearanceEntryUp,
		moveListAppearanceEntryDown: moveListAppearanceEntryDown
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


export function useCreateCustomAttributesSettingsDialog() {

	const [customAttributes, setCustomAttributes] = useState<AttributeMetaDTO[]>([]);
	const [addedCustomAttributes, setAddedCustomAttributes] = useState<AttributeMetaDTO[]>([]);
	const [deletedCustomAttributes, setDeletedCustomAttributes] = useState<AttributeMetaDTO[]>([]);

	const {
		getCustomAttributes,
		addCustomAttributes,
		deleteCustomAttributes
	} = useCustomAttributes();

	useEffect(() => {
		getCustomAttributes().then(attribs => {
			setCustomAttributes(attribs);
			setAddedCustomAttributes([]);
			setDeletedCustomAttributes([]);
		})
	}, []);


	function createAttribute(entry: AttributeKeyDTO) {
		if (!keyExists(entry)) {
		console.log("create", entry, "from", customAttributes)
			const attribute: AttributeMetaDTO = {
				attId: null,
				key: {
					id: entry.id.trim(),
					name: entry.name.trim(),
					g0: (entry.g0 && entry.g0.trim().length > 0) ? entry.g0.trim() : "Custom",
					g1: (entry.g1 && entry.g1.trim().length > 0) ? entry.g1.trim() : "Custom",
					g2: (entry.g2 && entry.g2.trim().length > 0) ? entry.g2.trim() : "Custom",
				},
				type: "?",
				writable: true,
			};
			setCustomAttributes([...customAttributes, attribute].sort((a, b) => a.key.name.localeCompare(b.key.name)));
			markAdded(attribute);
		}
	}

	function deleteAttribute(attribute: AttributeMetaDTO) {
		console.log("delete", attribute, "from", customAttributes)
		setCustomAttributes(ArrayUtils.remove(customAttributes, attribute, attributeMetaEquals))
		markDeleted(attribute);
	}

	function discard(): Promise<any> {
		return getCustomAttributes().then(attribs => {
			setCustomAttributes(attribs);
			setAddedCustomAttributes([]);
			setDeletedCustomAttributes([]);
		})
	}

	function markAdded(attribute: AttributeMetaDTO) {
		setAddedCustomAttributes([...addedCustomAttributes, attribute]);
		setDeletedCustomAttributes(ArrayUtils.remove(deletedCustomAttributes, attribute, attributeMetaEquals))
	}

	function markDeleted(attribute: AttributeMetaDTO) {
		setAddedCustomAttributes(ArrayUtils.remove(addedCustomAttributes, attribute, attributeMetaEquals))
		setDeletedCustomAttributes([...deletedCustomAttributes, attribute]);
	}

	async function commit(): Promise<any> {
		return Promise.resolve()
			.then(() => addCustomAttributes(addedCustomAttributes.map(a => a.key)))
			.then(() => deleteCustomAttributes(deletedCustomAttributes.map(a => a.attId).filter(id => id !== null)))
	}

	function keyExists(key: AttributeKeyDTO) {
		return ArrayUtils.contains(customAttributes, key, (a, b) => {
			const keyA = a.key;
			return keyA.id === b.id
				&& keyA.name === b.name
				&& keyA.g0 === b.g0
				&& keyA.g1 === b.g1
				&& keyA.g2 === b.g2;
		});
	}

	function attributeMetaEquals(b: AttributeMetaDTO, a: AttributeMetaDTO) {
		if (a.attId === null || a.attId === undefined || b.attId === null || b.attId === undefined) {
			const keyA = a.key;
			const keyB = b.key;
			return keyA.id === keyB.id
				&& keyA.name === keyB.name
				&& keyA.g0 === keyB.g0
				&& keyA.g1 === keyB.g1
				&& keyA.g2 === keyB.g2;
		} else {
			return a.attId === b.attId;
		}
	}

	return {
		customAttributes: customAttributes,
		createCustomAttribute: createAttribute,
		deleteCustomAttribute: deleteAttribute,
		discardCustomAttributes: discard,
		commitCustomAttributes: commit
	};

}


export function useListAppearanceSettingsDialog() {

	const [entries, setEntries] = useState<AttributeMetaDTO[]>([]);
	const loadItems = useLoadItems();

	useEffect(() => {
		fetchItemListAttributes().then(setEntries);
	}, []);

	function addEntry(entry: AttributeMetaDTO) {
		if (ArrayUtils.containsNot(entries, entry, (a, b) => a.attId === b.attId)) {
			setEntries([...entries, entry]);
		}
	}

	function deleteEntry(entry: AttributeMetaDTO) {
		setEntries(ArrayUtils.remove(entries, entry, (a, b) => a.attId === b.attId));
	}

	function moveUp(entry: AttributeMetaDTO) {
		const currentIndex = ArrayUtils.removeInPlace(entries, entry, (a, b) => a.attId === b.attId);
		if (currentIndex !== null) {
			const newIndex = Math.max(0, currentIndex - 1);
			setEntries(ArrayUtils.insertAt(entries, entry, newIndex));
		}
	}

	function moveDown(entry: AttributeMetaDTO) {
		const currentIndex = ArrayUtils.removeInPlace(entries, entry, (a, b) => a.attId === b.attId);
		if (currentIndex !== null) {
			const newIndex = currentIndex + 1;
			setEntries(ArrayUtils.insertAt(entries, entry, newIndex));
		}
	}

	function discard() {
		fetchItemListAttributes().then(setEntries);
	}

	function commit() {
		return requestSetItemListAttributes(entries.map(e => e.attId))
			.then(() => loadItems({}));
	}

	return {
		listAppearanceEntries: entries,
		addListAppearanceEntry: addEntry,
		deleteListAppearanceEntry: deleteEntry,
		moveListAppearanceEntryUp: moveUp,
		moveListAppearanceEntryDown: moveDown,
		discardListAppearanceEntries: discard,
		commitListAppearanceEntries: commit
	};

}
