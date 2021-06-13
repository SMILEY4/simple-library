import {
    CollectionType,
    Group,
    ImportProcessData,
    ImportResult,
    ImportStatus,
    ItemData,
    LastOpenedLibraryEntry,
} from '../../../common/commonModels';
import {
    CreateGroupMessage,
    DeleteGroupMessage,
    GetGroupsMessage,
    MoveGroupMessage,
    RenameGroupMessage,
} from '../../../common/messaging/messagesGroups';
import {
    GetItemsMessage,
    ImportItemsMessage,
    ImportStatusUpdateCommand,
} from '../../../common/messaging/messagesItems';
import {
    CreateCollectionMessage,
    DeleteCollectionMessage,
    EditCollectionMessage,
    MoveCollectionMessage,
    MoveItemsToCollectionsMessage,
    RemoveItemsFromCollectionsMessage,
} from '../../../common/messaging/messagesCollections';
import {
    CloseLibraryMessage,
    CreateLibraryMessage,
    GetLastOpenedLibrariesMessage,
    OpenLibraryMessage
} from '../../../common/messaging/messagesLibrary';

const {ipcRenderer} = window.require('electron');

export function fetchLastOpenedLibraries(): Promise<LastOpenedLibraryEntry[]> {
    return GetLastOpenedLibrariesMessage.request(ipcRenderer)
        .then((response: GetLastOpenedLibrariesMessage.ResponsePayload) => response.lastOpened);
}

export function requestOpenLibrary(filepath: string): Promise<void> {
    return OpenLibraryMessage.request(ipcRenderer, {path: filepath}).then();
}

export function requestCreateLibrary(name: string, targetDir: string): Promise<void> {
    return CreateLibraryMessage.request(ipcRenderer, {targetDir: targetDir, name: name}).then()
}

export function fetchRootGroup(): Promise<Group> {
    return GetGroupsMessage.request(ipcRenderer, {
        includeCollections: true,
        includeItemCount: true,
    }).then((response: GetGroupsMessage.ResponsePayload) => response.groups[0]);
}


export function fetchItems(collectionId: number): Promise<ItemData[]> {
    return GetItemsMessage.request(ipcRenderer, {
        collectionId: collectionId,
    }).then((response: GetItemsMessage.ResponsePayload) => response.items);
}


export function requestMoveItems(srcCollectionId: number, tgtCollectionId: number, itemIds: number[], copy: boolean): Promise<void> {
    return MoveItemsToCollectionsMessage.request(ipcRenderer, {
        sourceCollectionId: srcCollectionId,
        targetCollectionId: tgtCollectionId,
        itemIds: itemIds,
        copy: copy,
    }).then();
}


export function requestRemoveItems(collectionId: number, itemIds: number[]): Promise<void> {
    return RemoveItemsFromCollectionsMessage.request(ipcRenderer, {
        collectionId: collectionId,
        itemIds: itemIds,
    }).then();
}


export function requestImport(data: ImportProcessData,
                              callbackSuccess: (result: ImportResult) => void,
                              callbackFailed: (result: ImportResult) => void,
                              callbackWithErrors: (result: ImportResult) => void): Promise<ImportResult> {
    return ImportItemsMessage.request(ipcRenderer, {
        data: data,
    })
        .then((resp: ImportItemsMessage.ResponsePayload) => resp.result)
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


export function onImportStatusCommands(onStatus: (status: ImportStatus) => void) {
    ImportStatusUpdateCommand.on(ipcRenderer, (status: ImportStatus) => {
        onStatus(status);
    });
}


export function requestCloseLibrary(): Promise<void> {
    return CloseLibraryMessage.request(ipcRenderer).then();
}


export function requestCreateCollection(name: string, type: CollectionType, query: string | null, parentGroupId: number | null): Promise<void> {
    return CreateCollectionMessage.request(ipcRenderer, {
        name: name,
        type: type,
        smartQuery: type === CollectionType.SMART ? query : null,
        parentGroupId: parentGroupId,
    }).then();
}


export function requestEditCollection(collectionId: number, name: string, query: string | null): Promise<void> {
    return EditCollectionMessage.request(ipcRenderer, {
        collectionId: collectionId,
        newName: name,
        newSmartQuery: query,
    }).then();
}

export function requestDeleteCollection(collectionId: number): Promise<void> {
    return DeleteCollectionMessage.request(ipcRenderer, {
        collectionId: collectionId,
    }).then();
}

export function requestCreateGroup(name: string, parentGroupId: number | null): Promise<void> {
    return CreateGroupMessage.request(ipcRenderer, {
        name: name,
        parentGroupId: parentGroupId,
    }).then();
}


export function requestRenameGroup(groupId: number, name: string): Promise<void> {
    return RenameGroupMessage.request(ipcRenderer, {
        groupId: groupId,
        newName: name,
    }).then();
}

export function requestDeleteGroup(groupId: number, deleteChildren: boolean): Promise<void> {
    return DeleteGroupMessage.request(ipcRenderer, {
        groupId: groupId,
        deleteChildren: deleteChildren,
    }).then();
}

export function requestMoveGroup(groupId: number, targetGroupId: number | null): Promise<void> {
    return MoveGroupMessage.request(ipcRenderer, {
        groupId: groupId,
        targetGroupId: targetGroupId,
    }).then();
}


export function requestMoveCollection(collectionId: number, targetGroupId: number | null): Promise<void> {
    return MoveCollectionMessage.request(ipcRenderer, {
        collectionId: collectionId,
        targetGroupId: targetGroupId,
    }).then();
}