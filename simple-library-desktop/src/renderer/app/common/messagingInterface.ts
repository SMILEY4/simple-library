import { Group, ImportProcessData, ImportResult, ImportStatus, ItemData } from '../../../common/commonModels';
import { GetGroupsMessage } from '../../../common/messaging/messagesGroups';
import {
    GetItemsMessage,
    ImportItemsMessage,
    ImportStatusUpdateCommand,
} from '../../../common/messaging/messagesItems';
import {
    MoveItemsToCollectionsMessage,
    RemoveItemsFromCollectionsMessage,
} from '../../../common/messaging/messagesCollections';
import { CloseLibraryMessage } from '../../../common/messaging/messagesLibrary';

const { ipcRenderer } = window.require('electron');


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