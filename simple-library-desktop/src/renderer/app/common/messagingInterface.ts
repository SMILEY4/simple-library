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
import {RenderApplicationMsgSender} from "../../../common/messagingNew/applicationMsgSender";
import {RenderCollectionMsgSender} from "../../../common/messagingNew/collectionMsgSender";
import {RenderGroupMsgSender} from "../../../common/messagingNew/groupMsgSender";
import {RenderItemMsgSender} from "../../../common/messagingNew/itemMsgSender";
import {RenderLibraryMsgSender} from "../../../common/messagingNew/libraryMsgSender";
import {GetExiftoolDataPayload} from "../../../common/messagingNew/applicationMsgHandler";
import {RenderItemMsgHandler} from "../../../common/messagingNew/itemMsgHandler";

const appSender: RenderApplicationMsgSender = new RenderApplicationMsgSender().init();
const collectionSender: RenderCollectionMsgSender = new RenderCollectionMsgSender().init();
const groupSender: RenderGroupMsgSender = new RenderGroupMsgSender().init();
const itemSender: RenderItemMsgSender = new RenderItemMsgSender().init();
const librarySender: RenderLibraryMsgSender = new RenderLibraryMsgSender().init();
const itemMsgHandler: RenderItemMsgHandler = new RenderItemMsgHandler().init();

export function addImportStatusListener(listener: (status: ImportStatus) => void): void {
    itemMsgHandler.addImportStatusListener(listener);
}

export function removeImportStatusListener(listener: (status: ImportStatus) => void): void {
    itemMsgHandler.removeImportStatusListener(listener);
}

export function fetchLastOpenedLibraries(): Promise<LastOpenedLibraryEntry[]> {
    return librarySender.getLastOpened();
}

export function requestOpenLibrary(filepath: string): Promise<void> {
    return librarySender.open(filepath);
}

export function requestCreateLibrary(name: string, targetDir: string): Promise<void> {
    return librarySender.create(targetDir, name);
}

export function fetchRootGroup(): Promise<Group> {
    return groupSender.getAll(true, true)
        .then((groups: Group[]) => groups[0]);
}

export function fetchItems(collectionId: number, itemAttributeKeys: string[]): Promise<ItemData[]> {
    return itemSender.get(collectionId, itemAttributeKeys);
}

export function fetchItemById(itemId: number): Promise<ItemData | null> {
    return itemSender.getById(itemId);
}

export function requestMoveItems(srcCollectionId: number, tgtCollectionId: number, itemIds: number[], copy: boolean): Promise<void> {
    return collectionSender.moveItemsToCollection(srcCollectionId, tgtCollectionId, itemIds, copy);
}


export function requestRemoveItems(collectionId: number, itemIds: number[]): Promise<void> {
    return collectionSender.removeItemsFromCollection(collectionId, itemIds);
}


export function requestDeleteItems(itemIds: number[]): Promise<void> {
    return itemSender.deleteItems(itemIds);
}


export function fetchItemMetadata(itemId: number): Promise<MetadataEntry[]> {
    return itemSender.getMetadata(itemId);
}

export function setItemMetadata(itemId: number, entryKey: string, value: string): Promise<MetadataEntry> {
    return itemSender.setMetadata(itemId, entryKey, value);
}

export function requestImport(data: ImportProcessData,
                              callbackSuccess: (result: ImportResult) => void,
                              callbackFailed: (result: ImportResult) => void,
                              callbackWithErrors: (result: ImportResult) => void): Promise<ImportResult> {
    return itemSender.importItems(data)
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
    return librarySender.close();
}

export function requestCreateCollection(name: string, type: CollectionType, query: string | null, parentGroupId: number | null): Promise<void> {
    return collectionSender.createCollection(name, type, parentGroupId, type === CollectionType.SMART ? query : null).then();
}

export function requestEditCollection(collectionId: number, name: string, query: string | null): Promise<void> {
    return collectionSender.editCollection(collectionId, name, query);
}

export function requestDeleteCollection(collectionId: number): Promise<void> {
    return collectionSender.deleteCollection(collectionId);
}

export function requestCreateGroup(name: string, parentGroupId: number | null): Promise<void> {
    return groupSender.createGroup(name, parentGroupId).then();
}

export function requestRenameGroup(groupId: number, name: string): Promise<void> {
    return groupSender.renameGroup(groupId, name);
}

export function requestDeleteGroup(groupId: number, deleteChildren: boolean): Promise<void> {
    return groupSender.deleteGroup(groupId, deleteChildren);
}

export function requestMoveGroup(groupId: number, targetGroupId: number | null): Promise<void> {
    return groupSender.moveGroup(groupId, targetGroupId);
}

export function requestMoveCollection(collectionId: number, targetGroupId: number | null): Promise<void> {
    return collectionSender.moveCollection(collectionId, targetGroupId);
}

export function requestOpenItemsExternal(itemIds: number[]): Promise<void> {
    return itemSender.openExternal(itemIds);
}

export function requestOpenConfigFile(): Promise<void> {
    return appSender.openConfig();
}

export function fetchExiftoolData(): Promise<[string | null, boolean]> {
    return appSender.getExiftoolData()
        .then((data: GetExiftoolDataPayload) => [data.location, data.defined]);
}
