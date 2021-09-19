import {useEffect, useState} from "react";
import {fetchItemById, fetchItemMetadata} from "../../../../common/eventInterface";
import {AttributeDTO, ItemDTO} from "../../../../../../common/events/dtoModels";
import {useSelectedItemIds} from "../../../../hooks/store/itemSelectionState";
import {useDispatchSetAttributes, useStateAttributes} from "../../../../hooks/store/attributeStore";
import {useUpdateAttribute} from "../../../../hooks/core/attributeUpdate";
import {useDeleteAttribute} from "../../../../hooks/core/attributeDelete";

export function useMetadataSidebar() {

	const [item, setItem] = useState<ItemDTO | null>(null);

	const attributes = useStateAttributes();
	const setAttributes = useDispatchSetAttributes();
	const updateAttribute = useUpdateAttribute();

	useListenSelectionChanges(setItem, setAttributes);

	return {
		displayedItem: item,
		metadataEntries: attributes,
		updateMetadataEntry: (key: string, prevValue: string, newValue: string) => updateAttribute(item.id, key, newValue),
		copyAttributeValueToClipboard: useCopyAttributeValueToClipboard(attributes),
		deleteAttribute: useDeleteAttributeEntry(item ? item.id : null)
	};
}


function useListenSelectionChanges(setItem: (item: ItemDTO | null) => void, setMetadata: (attribs: AttributeDTO[]) => void) {
	const selectedItemIds = useSelectedItemIds();
	useEffect(() => {
		if (selectedItemIds && selectedItemIds.length === 1) {
			fetchItemMetadata(selectedItemIds[0])
				.then((entries: AttributeDTO[]) => setMetadata(entries))
				.then(() => fetchItemById(selectedItemIds[0]))
				.then(setItem);
		} else {
			setMetadata([]);
			setItem(null);
		}
	}, [selectedItemIds]);
}


function useCopyAttributeValueToClipboard(attributes: AttributeDTO[]) {

	function hookFunction(attributeKey: string) {
		const attribute: AttributeDTO | undefined = attributes.find(a => a.key === attributeKey);
		const attribValue: string = attribute ? attribute.value : "";
		navigator.clipboard.writeText(attribValue).then();
	}

	return hookFunction;
}


function useDeleteAttributeEntry(itemId: number | null) {

	const deleteAttribute = useDeleteAttribute();

	function hookFunction(attributeKey: string) {
		if(itemId && attributeKey) {
			deleteAttribute(itemId, attributeKey).then();
		}
	}

	return hookFunction;
}