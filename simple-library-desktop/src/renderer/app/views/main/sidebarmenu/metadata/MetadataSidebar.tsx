import React, {useState} from "react";
import {SidebarTab} from "../../../../../components/misc/app/AppLayout";
import {IconType} from "../../../../../components/base/icon/Icon";
import {VBox} from "../../../../../components/layout/box/Box";
import {Accordion} from "../../../../../components/misc/accordion/Accordion";
import {TextField} from "../../../../../components/input/textfield/TextField";
import {MetadataListEntry} from "./MetadataListEntry";
import {Label} from "../../../../../components/base/label/Label";
import {AttributeDTO} from "../../../../../../common/events/dtoModels";
import {useMetadataSidebar} from "./useMetadataSidebar";
import {useContextMenu} from "../../../../../components/menu/contextmenu/contextMenuHook";
import {APP_ROOT_ID} from "../../../../Application";
import {MetadataListEntryContextMenu} from "./MetadataListEntryContextMenu";
import {ContextMenuBase} from "../../../../../components/menu/contextmenu/ContextMenuBase";
import {useDispatchOpenConfirmationDialog} from "../../../../hooks/store/dialogState";


export const TAB_DATA_METADATA: SidebarTab = {
    id: "tab-metadata",
    title: "Metadata",
    icon: IconType.TAGS
};

interface MetadataSidebarProps {
}

export function MetadataSidebar(props: React.PropsWithChildren<MetadataSidebarProps>): React.ReactElement {

    const [search, setSearch] = useState<string>("");

    const {
        displayedItem,
        metadataEntries,
        updateMetadataEntry,
        copyAttributeValueToClipboard,
        deleteAttribute
    } = useMetadataSidebar();

    const {
        showContextMenu,
        contextMenuPayload,
        contextMenuX,
        contextMenuY,
        contextMenuRef,
        openContextMenuWithEvent,
        closeContextMenu
    } = useContextMenu();

    const openConfirmation = useDispatchOpenConfirmationDialog();

    return (
        <>

            <VBox spacing="0-5" padding="0-5" alignCross="stretch">

                {displayedItem && (
                    <VBox spacing="0-5" padding="0-5" alignCross="center">
                        <Label type="header-3">
                            {displayedItem.filepath}
                        </Label>
                        <img src={displayedItem.thumbnail} alt="img" draggable={false}/>
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
                                key={group.title}
                                title={group.title}
                                entries={group.entries}
                                searchFilter={search.toLowerCase()}
                                onUpdateValue={handleOnUpdateEntryValue}
                                onContextMenu={handleOpenContextMenu}
                            />;
                        })
                }
            </VBox>

            <ContextMenuBase
                modalRootId={APP_ROOT_ID}
                show={showContextMenu}
                pageX={contextMenuX}
                pageY={contextMenuY}
                menuRef={contextMenuRef}
                onRequestClose={closeContextMenu}
            >
                <MetadataListEntryContextMenu
                    attributeKey={contextMenuPayload}
                    onCopy={handleCopyEntryValue}
                    onDelete={handleDeleteEntry}
                />
            </ContextMenuBase>

        </>
    );

    function handleOpenContextMenu(attributeKey: string, event: React.MouseEvent) {
        openContextMenuWithEvent(event, attributeKey);
    }

    function handleCopyEntryValue(attributeKey: string) {
        copyAttributeValueToClipboard(attributeKey);
        closeContextMenu();
    }

    function handleDeleteEntry(attributeKey: string) {
        openConfirmation("Delete", "Deleting '" + attributeKey + "' is permanent and cannot be reversed.", "Delete",
            () => deleteAttribute(attributeKey));
        closeContextMenu();
    }

    function handleOnUpdateEntryValue(entry: AttributeDTO, prev: string, next: string) {
        return updateMetadataEntry(entry.key, prev, next);
    }

    function group(entries: AttributeDTO[]): ({ title: string, entries: ([string, AttributeDTO])[] })[] {

        const groups: ({ title: string, entries: ([string, AttributeDTO])[] })[] = [];

        function insert(groupName: string, entryName: string, entry: AttributeDTO): void {
            let group = groups.find(g => g.title === groupName);
            if (!group) {
                groups.push({title: groupName, entries: [[entryName, entry]]});
            } else {
                group.entries.push([entryName, entry]);
            }
        }

        entries.forEach((entry: AttributeDTO) => {
            const parts: string[] = entry.key.split(/\.(.+)/);
            if (parts.length >= 2) {
                insert(parts[0], parts[1], entry);
            } else {
                insert("Miscellaneous", entry.key, entry);
            }
        });

        return groups;
    }


}


interface MetadataGroupListEntryProps {
    searchFilter: string,
    title: string,
    entries: ([string, AttributeDTO])[];
    onUpdateValue: (entry: AttributeDTO, prev: string, next: string) => void,
    onContextMenu: (attributeKey: string, event: React.MouseEvent) => void,
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
                            .map((entry: [string, AttributeDTO]) => {
                                return <MetadataListEntry
                                    key={entry[1].key}
                                    entry={entry[1]}
                                    shortName={entry[0]}
                                    onUpdateValue={(prev, next) => props.onUpdateValue(entry[1], prev, next)}
                                    onContextMenu={props.onContextMenu}
                                />;
                            })
                    }
                </VBox>
            </Accordion>
        );
    }

}

