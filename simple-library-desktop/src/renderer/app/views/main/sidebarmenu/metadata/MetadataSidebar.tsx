import React from "react";
import {SidebarTab} from "../../../../../components/misc/app/AppLayout";
import {IconType} from "../../../../../components/base/icon/Icon";
import {VBox} from "../../../../../components/layout/box/Box";
import {TextField} from "../../../../../components/input/textfield/TextField";
import {Label} from "../../../../../components/base/label/Label";
import {AttributeDTO, AttributeValueDTO} from "../../../../../../common/events/dtoModels";
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

    const {
        displayedItem,
        metadataEntries,
        updateMetadataEntry,
        copyAttributeValueToClipboard,
        deleteAttribute,
        searchString,
        setSearchString,
        hideAttribute
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
                    value={searchString}
                    onAccept={setSearchString}
                    onChange={setSearchString}
                    forceState
                    prependIcon={IconType.SEARCH}
                    appendIcon={IconType.CLOSE}
                    onClickAppendIcon={() => setSearchString("")}
                />

                {
                    group(metadataEntries)
                        .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
                        .map(group => {
                            return <MetadataGroupListEntry
                                key={group.title}
                                title={group.title}
                                entries={group.entries}
                                searchFilter={searchString.toLowerCase()}
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
                    attributeId={contextMenuPayload.attId}
                    attributeName={contextMenuPayload.name}
                    onCopy={handleCopyEntryValue}
                    onHide={handleHideEntry}
                    onDelete={handleDeleteEntry}
                />
            </ContextMenuBase>

        </>
    );

    function handleOpenContextMenu(attributeId: number, attributeName: string, event: React.MouseEvent) {
        openContextMenuWithEvent(event, {name: attributeName, attId: attributeId});
    }

    function handleCopyEntryValue(attributeId: number) {
        copyAttributeValueToClipboard(attributeId);
        closeContextMenu();
    }

    function handleHideEntry(attributeId: number) {
        hideAttribute(attributeId);
        closeContextMenu();
    }

    function handleDeleteEntry(attributeId: number) {
        openConfirmation("Delete", "Deleting '" + attributeId + "' is permanent and cannot be reversed.", "Delete",
            () => deleteAttribute(attributeId));
        closeContextMenu();
    }

    function handleOnUpdateEntryValue(entry: AttributeDTO, prev: AttributeValueDTO, next: AttributeValueDTO) {
        return updateMetadataEntry(entry.attId, prev, next);
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
