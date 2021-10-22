import {useEffect, useState} from "react";
import {fetchItemById, fetchItemMetadata} from "../../../../common/eventInterface";
import {
	AttributeDTO,
	AttributeKeyDTO,
	attributeKeysDtoEquals,
	AttributeValueDTO,
	ItemDTO
} from "../../../../../../common/events/dtoModels";
import {useSelectedItemIds} from "../../../../hooks/store/itemSelectionState";
import {useDispatchSetAttributes, useStateAttributes} from "../../../../hooks/store/attributeStore";
import {useUpdateAttribute} from "../../../../hooks/core/attributeUpdate";
import {useDeleteAttribute} from "../../../../hooks/core/attributeDelete";

export function useMetadataSidebar() {

	const [search, setSearch] = useState<string>("");
	const [item, setItem] = useState<ItemDTO | null>(null);
	const attributes: AttributeDTO[] = useStateAttributes();
	const setAttributes = useDispatchSetAttributes();

	useListenSelectionChanges(setItem, setAttributes);

	return {
		displayedItem: item,
		metadataEntries: attributes,
		updateMetadataEntry: useUpdateMetadataEntry(item ? item.id : null),
		copyAttributeValueToClipboard: useCopyAttributeValueToClipboard(attributes),
		deleteAttribute: useDeleteAttributeEntry(item ? item.id : null),
		searchString: search,
		setSearchString: setSearch
	};
}


function useListenSelectionChanges(setItem: (item: ItemDTO | null) => void, setMetadata: (itemId: number | null, attribs: AttributeDTO[]) => void) {
	const selectedItemIds = useSelectedItemIds();
	useEffect(() => {
		if (selectedItemIds && selectedItemIds.length === 1) {
			const itemId: number = selectedItemIds[0];
			fetchItemMetadata(itemId)
				.then((entries: AttributeDTO[]) => setMetadata(itemId, entries))
				.then(() => fetchItemById(selectedItemIds[0]))
				.then(setItem);
		} else {
			setMetadata(null, []);
			setItem(null);
		}
	}, [selectedItemIds]);
}


function useCopyAttributeValueToClipboard(attributes: AttributeDTO[]) {

	function hookFunction(attributeKey: AttributeKeyDTO) {
		const attribute = attributes.find(a => attributeKeysDtoEquals(a.key, attributeKey));
		const attribValue = (attribute && attribute.value) ? attribute.value.toString() : "";
		navigator.clipboard.writeText(attribValue).then();
	}

	return hookFunction;
}


function useDeleteAttributeEntry(itemId: number | null) {

	const deleteAttribute = useDeleteAttribute();

	function hookFunction(attributeKey: AttributeKeyDTO) {
		if (itemId && attributeKey) {
			deleteAttribute(itemId, attributeKey).then();
		}
	}

	return hookFunction;
}


function useUpdateMetadataEntry(itemId: number | null) {

	const updateAttribute = useUpdateAttribute();

	function hookFunction(attributeKey: AttributeKeyDTO, prevValue: AttributeValueDTO, newValue: AttributeValueDTO) {
		if (itemId && attributeKey) {
			return updateAttribute(itemId, attributeKey, prevValue, newValue);
		} else {
			return Promise.resolve();
		}
	}

	return hookFunction;
}