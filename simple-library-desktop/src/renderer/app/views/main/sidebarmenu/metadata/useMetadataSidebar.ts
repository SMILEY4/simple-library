import {useEffect, useState} from "react";
import {fetchItemById, fetchItemMetadata, setItemMetadata} from "../../../../common/eventInterface";
import {AttributeDTO, ItemDTO} from "../../../../../../common/events/dtoModels";
import {useDispatchUpdateItemAttribute} from "../../../../hooks/store/itemsState";
import {useSelectedItemIds} from "../../../../hooks/store/itemSelectionState";

export function useMetadataSidebar() {

    const [item, setItem] = useState<ItemDTO | null>(null);
    const [metadata, setMetadata] = useState<AttributeDTO[]>([]);
    useListenSelectionChanges(setItem, setMetadata)

    return {
        displayedItem: item,
        metadataEntries: metadata,
        updateMetadataEntry: useUpdateEntry(item, metadata, setMetadata)
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


function useUpdateEntry(item: ItemDTO | null, metadata: AttributeDTO[], setMetadata: (attribs: AttributeDTO[]) => void) {
    const dispatchUpdateItemAttribute = useDispatchUpdateItemAttribute();

    function hookFunction(entryKey: string, prevValue: string, newValue: string) {
        if (item) {
            setItemMetadata(item.id, entryKey, newValue)
                .then((newEntry: AttributeDTO) => {
                    const newMetadata = metadata.map(entry => {
                        if (entry.key === entryKey) {
                            return newEntry;
                        } else {
                            return entry;
                        }
                    });
                    setMetadata(newMetadata);
                    dispatchUpdateItemAttribute(item.id, newEntry.key, newEntry.value)
                });
        }
    }

    return hookFunction;
}
