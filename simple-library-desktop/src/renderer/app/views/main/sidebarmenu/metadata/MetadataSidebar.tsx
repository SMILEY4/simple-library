import React, {useState} from "react";
import {SidebarTab} from "../../../../../components/misc/app/AppLayout";
import {IconType} from "../../../../../components/base/icon/Icon";
import {VBox} from "../../../../../components/layout/box/Box";
import {TextField} from "../../../../../components/input/textfield/TextField";
import {Label} from "../../../../../components/base/label/Label";
import {AttributeDTO, AttributeKeyDTO, AttributeValueDTO} from "../../../../../../common/events/dtoModels";
import {useMetadataSidebar} from "./useMetadataSidebar";
import {useContextMenu} from "../../../../../components/menu/contextmenu/contextMenuHook";
import {APP_ROOT_ID} from "../../../../Application";
import {MetadataListEntryContextMenu} from "./MetadataListEntryContextMenu";
import {ContextMenuBase} from "../../../../../components/menu/contextmenu/ContextMenuBase";
import {useDispatchOpenConfirmationDialog} from "../../../../hooks/store/dialogState";
import {MetadataGroupListEntry} from "./MetadataGroupListEntry";


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

    function handleOpenContextMenu(attributeKey: AttributeKeyDTO, event: React.MouseEvent) {
        openContextMenuWithEvent(event, attributeKey);
    }

    function handleCopyEntryValue(attributeKey: AttributeKeyDTO) {
        copyAttributeValueToClipboard(attributeKey);
        closeContextMenu();
    }

    function handleDeleteEntry(attributeKey: AttributeKeyDTO) {
        openConfirmation("Delete", "Deleting '" + attributeKey + "' is permanent and cannot be reversed.", "Delete",
            () => deleteAttribute(attributeKey));
        closeContextMenu();
    }

    function handleOnUpdateEntryValue(entry: AttributeDTO, prev: AttributeValueDTO, next: AttributeValueDTO) {
        console.log("UPDATE", prev, "->", next)
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
            insert(entry.key.g0, entry.key.name, entry);
        });

        return groups;
    }

}
