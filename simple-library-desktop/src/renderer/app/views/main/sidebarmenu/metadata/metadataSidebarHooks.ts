import {useItemSelectionState} from "../../../../hooks/base/itemSelectionHooks";
import {useEffect, useState} from "react";
import {fetchItemMetadata, setItemMetadata} from "../../../../common/messagingInterface";
import {useItems} from "../../../../hooks/base/itemHooks";
import {AttributeDTO, ItemDTO} from "../../../../../../common/events/dtoModels";

export function useMetadataSidebar() {

    const [item, setItem] = useState<ItemDTO | null>(null);
    const [metadata, setMetadata] = useState<AttributeDTO[]>([]);

    const {
        selectedItemIds
    } = useItemSelectionState();

    const {
        fetchItem,
        updateItemAttributeState
    } = useItems();

    useEffect(() => onSelectionChanged(), [selectedItemIds]);

    function onSelectionChanged() {
        if (selectedItemIds && selectedItemIds.length === 1) {
            fetchItemMetadata(selectedItemIds[0])
                .then((entries: AttributeDTO[]) => setMetadata(entries))
                .then(() => fetchItem(selectedItemIds[0]))
                .then(setItem);
        } else {
            setMetadata([]);
            setItem(null);
        }
    }

    function updateEntry(entryKey: string, prevValue: string, newValue: string) {
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
                    updateItemAttributeState(item.id, newEntry.key, newEntry.value);
                });
        }
    }

    return {
        displayedItem: item,
        metadataEntries: metadata,
        updateMetadataEntry: updateEntry
    };

}