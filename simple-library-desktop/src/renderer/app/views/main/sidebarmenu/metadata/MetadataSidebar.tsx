import React, {useState} from "react";
import {SidebarTab} from "../../../../../components/misc/app/AppLayout";
import {IconType} from "../../../../../components/base/icon/Icon";
import {useMetadataSidebar} from "../../../../hooks/app/sidebarmenu/metadata/useMetadataSidebar";
import {VBox} from "../../../../../components/layout/box/Box";
import {Accordion} from "../../../../../components/misc/accordion/Accordion";
import {TextField} from "../../../../../components/input/textfield/TextField";
import {MetadataEntry} from "../../../../../../common/commonModels";
import {MetadataListEntry} from "./MetadataListEntry";
import {Label} from "../../../../../components/base/label/Label";


export const TAB_DATA_METADATA: SidebarTab = {
    id: "tab-metadata",
    title: "Metadata",
    icon: IconType.TAGS
}

interface MetadataSidebarProps {
}

export function MetadataSidebar(props: React.PropsWithChildren<MetadataSidebarProps>): React.ReactElement {

    const [search, setSearch] = useState<string>("");

    const {
        displayedItem,
        metadataEntries,
        updateMetadataEntry
    } = useMetadataSidebar();

    return (
        <>

            <VBox spacing="0-5" padding="0-5" alignCross="stretch">

                {displayedItem && (
                    <VBox spacing="0-5" padding="0-5" alignCross="center">
                        <Label type="header-3">
                            {displayedItem.filepath}
                        </Label>
                        <img src={displayedItem.thumbnail} alt='img' draggable={false}/>
                    </VBox>
                )}

                <TextField
                    placeholder={"Search"}
                    value={search}
                    onAccept={setSearch}
                    onChange={setSearch}
                    forceState
                    prependIcon={IconType.SEARCH}
                    appendIcon={IconType.CLOSE}
                    onClickAppendIcon={() => setSearch("")}
                />

                {
                    group(metadataEntries)
                        .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
                        .map(group => {
                            return <MetadataGroupListEntry
                                title={group.title}
                                entries={group.entries}
                                searchFilter={search.toLowerCase()}
                                onUpdateValue={handleOnUpdateEntryValue}
                            />
                        })
                }
            </VBox>

        </>
    );

    function handleOnUpdateEntryValue(entry: MetadataEntry, prev: string, next: string) {
        updateMetadataEntry(entry.key, prev, next);
    }


    function group(entries: MetadataEntry[]): ({ title: string, entries: ([string, MetadataEntry])[] })[] {

        const groups: ({ title: string, entries: ([string, MetadataEntry])[] })[] = [];

        function insert(groupName: string, entryName: string, entry: MetadataEntry): void {
            let group = groups.find(g => g.title === groupName)
            if (!group) {
                groups.push({title: groupName, entries: [[entryName, entry]]})
            } else {
                group.entries.push([entryName, entry])
            }
        }

        entries.forEach((entry: MetadataEntry) => {
            const parts: string[] = entry.key.split(/\.(.+)/);
            if (parts.length >= 2) {
                insert(parts[0], parts[1], entry);
            } else {
                insert("Miscellaneous", entry.key, entry);
            }
        })

        return groups;
    }


}


interface MetadataGroupListEntryProps {
    searchFilter: string,
    title: string,
    entries: ([string, MetadataEntry])[];
    onUpdateValue: (entry: MetadataEntry, prev: string, next: string) => void
}


function MetadataGroupListEntry(props: React.PropsWithChildren<MetadataGroupListEntryProps>): React.ReactElement {

    const doSearch: boolean = !!props.searchFilter && props.searchFilter.trim().length > 0;

    const displayEntries = props.entries
        .filter(entry => !entry[1].key.startsWith("ExifTool."))
        .filter(entry => !doSearch || entry[1].key.toLowerCase().includes(props.searchFilter.trim()));

    if (displayEntries.length === 0) {
        return null;
    } else {
        return (
            <Accordion title={props.title}
                       label={doSearch ? displayEntries.length + "/" + props.entries.length : "" + props.entries.length}>
                <VBox spacing="0-5" padding="0-5" alignCross="stretch">
                    {
                        displayEntries
                            .sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()))
                            .map((entry: [string, MetadataEntry]) => {
                                return <MetadataListEntry
                                    key={entry[1].key}
                                    entry={entry[1]}
                                    shortName={entry[0]}
                                    onUpdateValue={(prev, next) => props.onUpdateValue(entry[1], prev, next)}
                                />
                            })
                    }
                </VBox>
            </Accordion>
        );
    }

}

