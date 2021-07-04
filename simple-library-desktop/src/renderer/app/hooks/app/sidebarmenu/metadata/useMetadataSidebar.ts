import {useItemSelectionState} from "../../../base/itemSelectionHooks";
import {useEffect, useState} from "react";
import {ItemData, MetadataEntry} from "../../../../../../common/commonModels";
import {fetchItemMetadata, setItemMetadata} from "../../../../common/messagingInterface";
import {useItems} from "../../../base/itemHooks";

export function useMetadataSidebar() {

    const [item, setItem] = useState<ItemData | null>(null)
    const [metadata, setMetadata] = useState<MetadataEntry[]>([])

    const {
        selectedItemIds
    } = useItemSelectionState();

    const {
        fetchItem
    } = useItems();

    useEffect(() => onSelectionChanged(), [selectedItemIds])

    function onSelectionChanged() {
        if (selectedItemIds && selectedItemIds.length === 1) {
            fetchItemMetadata(selectedItemIds[0])
                .then((entries: MetadataEntry[]) => setMetadata(entries))
                .then(() => fetchItem(selectedItemIds[0]))
                .then(setItem)
        } else {
            setMetadata([])
            setItem(null)
        }
    }

    function updateEntry(entryKey: string, prevValue: string, newValue: string) {
        if (item) {
            setItemMetadata(item.id, entryKey, newValue)
                .then((newEntry: MetadataEntry) => {
                    const newMetadata = metadata.map(entry => {
                        if (entry.key === entryKey) {
                            return newEntry;
                        } else {
                            return entry;
                        }
                    })
                    setMetadata(newMetadata)
                });
        }
    }

    return {
        displayedItem: item,
        metadataEntries: metadata,
        updateMetadataEntry: updateEntry
    }

}
