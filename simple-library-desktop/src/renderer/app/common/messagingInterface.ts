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
    ConfigSetThemeChannel,
    GroupCreateChannel,
    GroupDeleteChannel,
    GroupMoveChannel,
    GroupRenameChannel,
    GroupsGetTreeChannel,
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
import {rendererIpcWrapper} from "../../../common/messaging/core/ipcWrapper";
import {
    AttributeDTO,
    CollectionTypeDTO,
    ExiftoolInfoDTO,
    GroupDTO,
    ImportProcessDataDTO,
    ImportResultDTO,
    ImportStatusDTO,
    ItemDTO,
    LastOpenedLibraryDTO
} from "../../../common/messaging/dtoModels";

const ipcWrapper = rendererIpcWrapper();

const channelConfigOpenConfig = new ConfigOpenChannel(ipcWrapper, "r");
const channelConfigGetExiftoolData = new ConfigGetExiftoolChannel(ipcWrapper, "r");
const channelConfigGetTheme = new ConfigGetThemeChannel(ipcWrapper, "r");
const channelConfigSetTheme = new ConfigSetThemeChannel(ipcWrapper, "r");

const channelLibraryGetLastOpened = new LibrariesGetLastOpenedChannel(ipcWrapper, "r");
const channelLibraryCreate = new LibraryCreateChannel(ipcWrapper, "r");
const channelLibraryOpen = new LibraryOpenChannel(ipcWrapper, "r");
const channelLibraryClose = new LibraryCloseChannel(ipcWrapper, "r");

const channelItemsGetByCollection = new ItemsGetByCollectionChannel(ipcWrapper, "r");
const channelItemsGetById = new ItemGetByIdChannel(ipcWrapper, "r");
const channelItemsDelete = new ItemsDeleteChannel(ipcWrapper, "r");
const channelItemsImport = new ItemsImportChannel(ipcWrapper, "r");
const channelItemsImportStatus = new ItemsImportStatusChannel(ipcWrapper, "r");
const channelItemsGetMetadata = new ItemGetMetadataChannel(ipcWrapper, "r");
const channelItemsSetMetadata = new ItemSetMetadataChannel(ipcWrapper, "r");
const channelItemsOpenExternal = new ItemsOpenExternalChannel(ipcWrapper, "r");

const channelGroupsGetAll = new GroupsGetTreeChannel(ipcWrapper, "r");
const channelGroupsCreate = new GroupCreateChannel(ipcWrapper, "r");
const channelGroupsDelete = new GroupDeleteChannel(ipcWrapper, "r");
const channelGroupsRename = new GroupRenameChannel(ipcWrapper, "r");
const channelGroupsMove = new GroupMoveChannel(ipcWrapper, "r");

const channelCollectionsCreate = new CollectionCreateChannel(ipcWrapper, "r");
const channelCollectionsDelete = new CollectionDeleteChannel(ipcWrapper, "r");
const channelCollectionsEdit = new CollectionEditChannel(ipcWrapper, "r");
const channelCollectionsMove = new CollectionMoveChannel(ipcWrapper, "r");
const channelCollectionsMoveItems = new CollectionMoveItemsChannel(ipcWrapper, "r");
const channelCollectionsRemoveItems = new CollectionRemoveItemsChannel(ipcWrapper, "r");


export function addImportStatusListener(listener: (status: ImportStatusDTO) => void): void {
    channelItemsImportStatus.on(listener);
}

export function removeImportStatusListener(): void {
    channelItemsImportStatus.on(null);
}

export function fetchLastOpenedLibraries(): Promise<LastOpenedLibraryDTO[]> {
    return channelLibraryGetLastOpened.send();
}

export function requestOpenLibrary(filepath: string): Promise<void> {
    return channelLibraryOpen.send(filepath);
}

export function requestCreateLibrary(name: string, targetDir: string): Promise<void> {
    return channelLibraryCreate.send({targetDir: targetDir, name: name});
}

export function fetchRootGroup(): Promise<GroupDTO> {
    return channelGroupsGetAll.send({includeItemCount: true, includeCollections: true});
}

export function fetchItems(collectionId: number, itemAttributeKeys: string[]): Promise<ItemDTO[]> {
    return channelItemsGetByCollection.send({collectionId: collectionId, itemAttributeKeys: itemAttributeKeys});
}

export function fetchItemById(itemId: number): Promise<ItemDTO | null> {
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


export function fetchItemMetadata(itemId: number): Promise<AttributeDTO[]> {
    return channelItemsGetMetadata.send(itemId);
}

export function setItemMetadata(itemId: number, entryKey: string, value: string): Promise<AttributeDTO> {
    return channelItemsSetMetadata.send({itemId: itemId, entryKey: entryKey, newValue: value});
}

export function requestImport(
    data: ImportProcessDataDTO,
    callbackSuccess: (result: ImportResultDTO) => void,
    callbackFailed: (result: ImportResultDTO) => void,
    callbackWithErrors: (result: ImportResultDTO) => void
): Promise<ImportResultDTO> {
    return channelItemsImport.send(data)
        .then((result: ImportResultDTO) => {
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

export function requestCreateCollection(name: string, type: CollectionTypeDTO, query: string | null, parentGroupId: number | null): Promise<void> {
    return channelCollectionsCreate.send({
        name: name,
        type: type,
        parentGroupId: parentGroupId,
        smartQuery: type === "smart" ? query : null
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
    console.log("request open config");
    return channelConfigOpenConfig.send();
}

export function fetchExiftoolData(): Promise<[string | null, boolean]> {
    return channelConfigGetExiftoolData.send()
        .then((data: ExiftoolInfoDTO) => [data.location, data.defined]);
}

export function setTheme(theme: "dark" | "light"): Promise<void> {
    return channelConfigSetTheme.send(theme);
}

export function getTheme(): Promise<"dark" | "light"> {
    return channelConfigGetTheme.send();
}