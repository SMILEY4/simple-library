import {ipcComWith} from "../../../common/events/core/ipcWrapper";
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
} from "../../../common/events/dtoModels";
import {
    CollectionCreateEventSender,
    CollectionDeleteEventSender,
    CollectionEditEventSender,
    CollectionMoveEventSender,
    CollectionMoveItemsEventSender,
    CollectionRemoveItemsEventSender,
    ConfigGetExiftoolEventSender,
    ConfigGetThemeEventSender,
    ConfigOpenEventSender,
    ConfigSetThemeEventSender,
    EventIds,
    GroupCreateEventSender,
    GroupDeleteEventSender,
    GroupMoveEventSender,
    GroupRenameEventSender,
    GroupsGetTreeEventSender,
    ItemGetAttributesEventSender,
    ItemGetByIdEventSender,
    ItemsDeleteEventSender,
    ItemSetAttributeEventSender,
    ItemsGetByCollectionEventSender,
    ItemsImportEventSender,
    ItemsOpenExternalEventSender,
    LibrariesGetLastOpenedEventSender,
    LibraryCloseEventSender,
    LibraryCreateEventSender,
    LibraryOpenEventSender
} from "../../../common/events/events";
import {EventReceiver} from "../../../common/events/core/eventReceiver";
import {EventBroadcaster} from "../../../common/eventsNew/core/eventBroadcaster";

const ipcWrapper = ipcComWith("main");

const senderConfigOpenConfig = new ConfigOpenEventSender(ipcWrapper, "r");
const senderConfigGetExiftoolData = new ConfigGetExiftoolEventSender(ipcWrapper, "r");
const senderConfigGetTheme = new ConfigGetThemeEventSender(ipcWrapper, "r");
const senderConfigSetTheme = new ConfigSetThemeEventSender(ipcWrapper, "r");

const senderLibraryGetLastOpened = new LibrariesGetLastOpenedEventSender(ipcWrapper, "r");
const senderLibraryCreate = new LibraryCreateEventSender(ipcWrapper, "r");
const senderLibraryOpen = new LibraryOpenEventSender(ipcWrapper, "r");
const senderLibraryClose = new LibraryCloseEventSender(ipcWrapper, "r");

const senderItemsGetByCollection = new ItemsGetByCollectionEventSender(ipcWrapper, "r");
const senderItemsGetById = new ItemGetByIdEventSender(ipcWrapper, "r");
const senderItemsDelete = new ItemsDeleteEventSender(ipcWrapper, "r");
const senderItemsImport = new ItemsImportEventSender(ipcWrapper, "r");
const senderItemsGetMetadata = new ItemGetAttributesEventSender(ipcWrapper, "r");
const senderItemsSetMetadata = new ItemSetAttributeEventSender(ipcWrapper, "r");
const senderItemsOpenExternal = new ItemsOpenExternalEventSender(ipcWrapper, "r");

const senderGroupsGetAll = new GroupsGetTreeEventSender(ipcWrapper, "r");
const senderGroupsCreate = new GroupCreateEventSender(ipcWrapper, "r");
const senderGroupsDelete = new GroupDeleteEventSender(ipcWrapper, "r");
const senderGroupsRename = new GroupRenameEventSender(ipcWrapper, "r");
const senderGroupsMove = new GroupMoveEventSender(ipcWrapper, "r");

const senderCollectionsCreate = new CollectionCreateEventSender(ipcWrapper, "r");
const senderCollectionsDelete = new CollectionDeleteEventSender(ipcWrapper, "r");
const senderCollectionsEdit = new CollectionEditEventSender(ipcWrapper, "r");
const senderCollectionsMove = new CollectionMoveEventSender(ipcWrapper, "r");
const senderCollectionsMoveItems = new CollectionMoveItemsEventSender(ipcWrapper, "r");
const senderCollectionsRemoveItems = new CollectionRemoveItemsEventSender(ipcWrapper, "r");

const eventReceiver = new EventReceiver(ipcWrapper, {
    idPrefix: "r"
})
eventReceiver.addEventId([EventIds.IMPORT_STATUS]);

const eventBroadcaster = new EventBroadcaster({
    comPartner: {
        partner: "main"
    },
    eventIdPrefix: "r",
    suppressPayloadLog: [EventIds.GET_ITEMS_BY_COLLECTION, EventIds.GET_ITEM_BY_ID],
});

export function addImportStatusListener(listener: (status: ImportStatusDTO) => void): void {
    eventReceiver.setListener((eventId: string, payload: any) => {
        if (eventId === EventIds.IMPORT_STATUS) {
            listener(payload);
        }
    })
}

export function removeImportStatusListener(): void {
    eventReceiver.clearListener();
}

export function fetchLastOpenedLibraries(): Promise<LastOpenedLibraryDTO[]> {
    return eventBroadcaster.send(EventIds.GET_LAST_OPENED_LIBS);
}

export function requestOpenLibrary(filepath: string): Promise<void> {
    return senderLibraryOpen.send(filepath);
}

export function requestCreateLibrary(name: string, targetDir: string): Promise<void> {
    return senderLibraryCreate.send({targetDir: targetDir, name: name});
}

export function fetchRootGroup(): Promise<GroupDTO> {
    return senderGroupsGetAll.send({includeItemCount: true, includeCollections: true});
}

export function fetchItems(collectionId: number, itemAttributeKeys: string[]): Promise<ItemDTO[]> {
    return senderItemsGetByCollection.send({collectionId: collectionId, itemAttributeKeys: itemAttributeKeys});
}

export function fetchItemById(itemId: number): Promise<ItemDTO | null> {
    return senderItemsGetById.send(itemId);
}

export function requestMoveItems(srcCollectionId: number, tgtCollectionId: number, itemIds: number[], copy: boolean): Promise<void> {
    return senderCollectionsMoveItems.send({
        sourceCollectionId: srcCollectionId,
        targetCollectionId: tgtCollectionId,
        itemIds: itemIds,
        copy: copy
    });
}


export function requestRemoveItems(collectionId: number, itemIds: number[]): Promise<void> {
    return senderCollectionsRemoveItems.send({collectionId: collectionId, itemIds: itemIds});
}


export function requestDeleteItems(itemIds: number[]): Promise<void> {
    return senderItemsDelete.send(itemIds);
}


export function fetchItemMetadata(itemId: number): Promise<AttributeDTO[]> {
    return senderItemsGetMetadata.send(itemId);
}

export function setItemMetadata(itemId: number, entryKey: string, value: string): Promise<AttributeDTO> {
    return senderItemsSetMetadata.send({itemId: itemId, entryKey: entryKey, newValue: value});
}

export function requestImport(
    data: ImportProcessDataDTO,
    callbackSuccess: (result: ImportResultDTO) => void,
    callbackFailed: (result: ImportResultDTO) => void,
    callbackWithErrors: (result: ImportResultDTO) => void
): Promise<ImportResultDTO> {
    return senderItemsImport.send(data)
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
    return senderLibraryClose.send();
}

export function requestCreateCollection(name: string, type: CollectionTypeDTO, query: string | null, parentGroupId: number | null): Promise<void> {
    return senderCollectionsCreate.send({
        name: name,
        type: type,
        parentGroupId: parentGroupId,
        smartQuery: type === "smart" ? query : null
    }).then();
}

export function requestEditCollection(collectionId: number, name: string, query: string | null): Promise<void> {
    return senderCollectionsEdit.send({collectionId: collectionId, newName: name, newSmartQuery: query});
}

export function requestDeleteCollection(collectionId: number): Promise<void> {
    return senderCollectionsDelete.send(collectionId);
}

export function requestCreateGroup(name: string, parentGroupId: number | null): Promise<void> {
    return senderGroupsCreate.send({name: name, parentGroupId: parentGroupId}).then();
}

export function requestRenameGroup(groupId: number, name: string): Promise<void> {
    return senderGroupsRename.send({groupId: groupId, newName: name});
}

export function requestDeleteGroup(groupId: number, deleteChildren: boolean): Promise<void> {
    return senderGroupsDelete.send({groupId: groupId, deleteChildren: deleteChildren});
}

export function requestMoveGroup(groupId: number, targetGroupId: number | null): Promise<void> {
    return senderGroupsMove.send({groupId: groupId, targetGroupId: targetGroupId});
}

export function requestMoveCollection(collectionId: number, targetGroupId: number | null): Promise<void> {
    return senderCollectionsMove.send({collectionId: collectionId, targetGroupId: targetGroupId});
}

export function requestOpenItemsExternal(itemIds: number[]): Promise<void> {
    return senderItemsOpenExternal.send(itemIds);
}

export function requestOpenConfigFile(): Promise<void> {
    console.log("request open config");
    return senderConfigOpenConfig.send();
}

export function fetchExiftoolData(): Promise<[string | null, boolean]> {
    return senderConfigGetExiftoolData.send()
        .then((data: ExiftoolInfoDTO) => [data.location, data.defined]);
}

export function setTheme(theme: "dark" | "light"): Promise<void> {
    return senderConfigSetTheme.send(theme);
}

export function getTheme(): Promise<"dark" | "light"> {
    return senderConfigGetTheme.send();
}
