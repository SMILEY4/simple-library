import {
    CollectionType,
    Group,
    ImportProcessData,
    ImportResult,
    ImportStatus,
    ItemData,
    LastOpenedLibraryEntry,
    MetadataEntry
} from "../../../common/commonModels";
import {
    CollectionCreateChannel,
    CollectionDeleteChannel,
    CollectionEditChannel,
    CollectionMoveChannel,
    CollectionMoveItemsChannel,
    CollectionRemoveItemsChannel,
    ConfigGetExiftoolChannel,
    ConfigGetThemeChannel,
    ConfigOpenChannel,
    ConfigSetThemeChannel, GetExiftoolDataPayload,
    GroupCreateChannel,
    GroupDeleteChannel,
    GroupMoveChannel,
    GroupRenameChannel,
    GroupsGetAllChannel,
    ItemGetByIdChannel,
    ItemGetMetadataChannel,
    ItemsDeleteChannel,
    ItemSetMetadataChannel,
    ItemsGetByCollectionChannel,
    ItemsImportChannel,
    ItemsImportStatusChannel,
    ItemsOpenExternalChannel,
    LibrariesGetLastOpenedChannel,
    LibraryCloseChannel,
    LibraryCreateChannel,
    LibraryOpenChannel
} from "../../../common/messaging/channels/channels";
import {rendererIpcWrapper} from "../../../common/messaging/core/msgUtils";

// const appSender: RenderApplicationMsgSender = new RenderApplicationMsgSender().init();
// const collectionSender: RenderCollectionMsgSender = new RenderCollectionMsgSender().init();
// const groupSender: RenderGroupMsgSender = new RenderGroupMsgSender().init();
// const itemSender: RenderItemMsgSender = new RenderItemMsgSender().init();
// const librarySender: RenderLibraryMsgSender = new RenderLibraryMsgSender().init();
// const itemMsgHandler: RenderItemMsgHandler = new RenderItemMsgHandler().init();

const channelConfigOpenConfig = new ConfigOpenChannel(rendererIpcWrapper(), "r");
const channelConfigGetExiftoolData = new ConfigGetExiftoolChannel(rendererIpcWrapper(), "r");
const channelConfigGetTheme = new ConfigGetThemeChannel(rendererIpcWrapper(), "r");
const channelConfigSetTheme = new ConfigSetThemeChannel(rendererIpcWrapper(), "r");

const channelLibraryGetLastOpened = new LibrariesGetLastOpenedChannel(rendererIpcWrapper(), "r");
const channelLibraryCreate = new LibraryCreateChannel(rendererIpcWrapper(), "r");
const channelLibraryOpen = new LibraryOpenChannel(rendererIpcWrapper(), "r");
const channelLibraryClose = new LibraryCloseChannel(rendererIpcWrapper(), "r");

const channelItemsGetByCollection = new ItemsGetByCollectionChannel(rendererIpcWrapper(), "r");
const channelItemsGetById = new ItemGetByIdChannel(rendererIpcWrapper(), "r");
const channelItemsDelete = new ItemsDeleteChannel(rendererIpcWrapper(), "r");
const channelItemsImport = new ItemsImportChannel(rendererIpcWrapper(), "r");
const channelItemsImportStatus = new ItemsImportStatusChannel(rendererIpcWrapper(), "r");
const channelItemsGetMetadata = new ItemGetMetadataChannel(rendererIpcWrapper(), "r");
const channelItemsSetMetadata = new ItemSetMetadataChannel(rendererIpcWrapper(), "r");
const channelItemsOpenExternal = new ItemsOpenExternalChannel(rendererIpcWrapper(), "r");

const channelGroupsGetAll = new GroupsGetAllChannel(rendererIpcWrapper(), "r");
const channelGroupsCreate = new GroupCreateChannel(rendererIpcWrapper(), "r");
const channelGroupsDelete = new GroupDeleteChannel(rendererIpcWrapper(), "r");
const channelGroupsRename = new GroupRenameChannel(rendererIpcWrapper(), "r");
const channelGroupsMove = new GroupMoveChannel(rendererIpcWrapper(), "r");

const channelCollectionsCreate = new CollectionCreateChannel(rendererIpcWrapper(), "r");
const channelCollectionsDelete = new CollectionDeleteChannel(rendererIpcWrapper(), "r");
const channelCollectionsEdit = new CollectionEditChannel(rendererIpcWrapper(), "r");
const channelCollectionsMove = new CollectionMoveChannel(rendererIpcWrapper(), "r");
const channelCollectionsMoveItems = new CollectionMoveItemsChannel(rendererIpcWrapper(), "r");
const channelCollectionsRemoveItems = new CollectionRemoveItemsChannel(rendererIpcWrapper(), "r");


export function addImportStatusListener(listener: (status: ImportStatus) => void): void {
    channelItemsImportStatus.on(listener);
}

export function removeImportStatusListener(listener: (status: ImportStatus) => void): void {
    channelItemsImportStatus.on(null); // todo: allow multiple listeners/handlers ?
}

export function fetchLastOpenedLibraries(): Promise<LastOpenedLibraryEntry[]> {
    return channelLibraryGetLastOpened.send();
}

export function requestOpenLibrary(filepath: string): Promise<void> {
    return channelLibraryOpen.send(filepath);
}

export function requestCreateLibrary(name: string, targetDir: string): Promise<void> {
    return channelLibraryCreate.send({targetDir: targetDir, name: name});
}

export function fetchRootGroup(): Promise<Group> {
    return channelGroupsGetAll.send({includeItemCount: true, includeCollections: true})
        .then((groups: Group[]) => groups[0]);
}

export function fetchItems(collectionId: number, itemAttributeKeys: string[]): Promise<ItemData[]> {
    return channelItemsGetByCollection.send({collectionId: collectionId, itemAttributeKeys: itemAttributeKeys});
}

export function fetchItemById(itemId: number): Promise<ItemData | null> {
    return channelItemsGetById.send(itemId);
}

export function requestMoveItems(srcCollectionId: number, tgtCollectionId: number, itemIds: number[], copy: boolean): Promise<void> {
    return channelCollectionsMoveItems.send({
        sourceCollectionId: srcCollectionId,
        targetCollectionId: tgtCollectionId,
        itemIds: itemIds,
        copy: copy
    });
}


export function requestRemoveItems(collectionId: number, itemIds: number[]): Promise<void> {
    return channelCollectionsRemoveItems.send({collectionId: collectionId, itemIds: itemIds});
}


export function requestDeleteItems(itemIds: number[]): Promise<void> {
    return channelItemsDelete.send(itemIds);
}


export function fetchItemMetadata(itemId: number): Promise<MetadataEntry[]> {
    return channelItemsGetMetadata.send(itemId);
}

export function setItemMetadata(itemId: number, entryKey: string, value: string): Promise<MetadataEntry> {
    return channelItemsSetMetadata.send({itemId: itemId, entryKey: entryKey, newValue: value});
}

export function requestImport(
    data: ImportProcessData,
    callbackSuccess: (result: ImportResult) => void,
    callbackFailed: (result: ImportResult) => void,
    callbackWithErrors: (result: ImportResult) => void
): Promise<ImportResult> {
    return channelItemsImport.send(data)
        .then((result: ImportResult) => {
            if (result.failed) {
                callbackFailed(result);
            } else if (result.encounteredErrors) {
                callbackWithErrors(result);
            } else {
                callbackSuccess(result);
            }
            return result;
        });
}

export function requestCloseLibrary(): Promise<void> {
    return channelLibraryClose.send();
}

export function requestCreateCollection(name: string, type: CollectionType, query: string | null, parentGroupId: number | null): Promise<void> {
    return channelCollectionsCreate.send({
        name: name, type: type, parentGroupId: parentGroupId, smartQuery: type === CollectionType.SMART ? query : null
    }).then();
}

export function requestEditCollection(collectionId: number, name: string, query: string | null): Promise<void> {
    return channelCollectionsEdit.send({collectionId: collectionId, newName: name, newSmartQuery: query});
}

export function requestDeleteCollection(collectionId: number): Promise<void> {
    return channelCollectionsDelete.send(collectionId);
}

export function requestCreateGroup(name: string, parentGroupId: number | null): Promise<void> {
    return channelGroupsCreate.send({name: name, parentGroupId: parentGroupId}).then();
}

export function requestRenameGroup(groupId: number, name: string): Promise<void> {
    return channelGroupsRename.send({groupId: groupId, newName: name});
}

export function requestDeleteGroup(groupId: number, deleteChildren: boolean): Promise<void> {
    return channelGroupsDelete.send({groupId: groupId, deleteChildren: deleteChildren});
}

export function requestMoveGroup(groupId: number, targetGroupId: number | null): Promise<void> {
    return channelGroupsMove.send({groupId: groupId, targetGroupId: targetGroupId});
}

export function requestMoveCollection(collectionId: number, targetGroupId: number | null): Promise<void> {
    return channelCollectionsMove.send({collectionId: collectionId, targetGroupId: targetGroupId});
}

export function requestOpenItemsExternal(itemIds: number[]): Promise<void> {
    return channelItemsOpenExternal.send(itemIds);
}

export function requestOpenConfigFile(): Promise<void> {
    console.log("request open config")
    return channelConfigOpenConfig.send();
}

export function fetchExiftoolData(): Promise<[string | null, boolean]> {
    return channelConfigGetExiftoolData.send()
        .then((data: GetExiftoolDataPayload) => [data.location, data.defined]);
}

export function setTheme(theme: "dark" | "light"): Promise<void> {
    return channelConfigSetTheme.send(theme);
}

export function getTheme(): Promise<"dark" | "light"> {
    return channelConfigGetTheme.send();
}