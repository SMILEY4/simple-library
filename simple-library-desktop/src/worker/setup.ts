import {
    CollectionCreateChannel,
    CollectionDeleteChannel,
    CollectionEditChannel,
    CollectionMoveChannel,
    CollectionMoveItemsChannel,
    CollectionRemoveItemsChannel,
    CollectionsGetAllChannel,
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
    LibraryGetMetadataChannel,
    LibraryOpenChannel
} from "../common/messaging/channels/channels";
import {ipcComWith} from "../common/messaging/core/ipcWrapper";
import {ActionHandler} from "./actionHandler";
import {EventReceiver} from "../common/events/core/eventReceiver";
import {ImportStatusEventSender} from "../common/events/eventSenders";
import {BrowserWindow} from "electron";

export function initWorker(runInMain?: boolean, targetBrowserWindow?: BrowserWindow | (() => BrowserWindow)): void {
    console.log("initialize worker");

    const eventPrefix = runInMain === true ? "r" : "w";
    const ipcWrapper = runInMain === true ? ipcComWith("renderer", targetBrowserWindow) : ipcComWith("main")

    const senderImportStatus = new ImportStatusEventSender(ipcWrapper, eventPrefix)
    const broadcaster = (eventId: string, payload: any) => {
        switch (eventId) {
            case ItemsImportStatusChannel.ID: {
                return senderImportStatus.sendAndForget(payload);
            }
            default: {
                return Promise.resolve();
            }
        }
    }
    const actionHandler = new ActionHandler(broadcaster);

    const eventReceiver = new EventReceiver(ipcWrapper, {
        idPrefix: eventPrefix,
        suppressPayloadLog: [
            ItemsGetByCollectionChannel.ID,
            ItemGetByIdChannel.ID
        ]
    })
    eventReceiver.addEventId([
        ConfigOpenChannel.ID,
        ConfigGetExiftoolChannel.ID,
        ConfigGetThemeChannel.ID,
        ConfigSetThemeChannel.ID,
        LibrariesGetLastOpenedChannel.ID,
        LibraryCreateChannel.ID,
        LibraryOpenChannel.ID,
        LibraryCloseChannel.ID,
        LibraryGetMetadataChannel.ID,
        GroupsGetTreeChannel.ID,
        GroupCreateChannel.ID,
        GroupDeleteChannel.ID,
        GroupRenameChannel.ID,
        GroupMoveChannel.ID,
        CollectionsGetAllChannel.ID,
        CollectionCreateChannel.ID,
        CollectionDeleteChannel.ID,
        CollectionEditChannel.ID,
        CollectionMoveChannel.ID,
        CollectionMoveItemsChannel.ID,
        CollectionRemoveItemsChannel.ID,
        ItemsGetByCollectionChannel.ID,
        ItemGetByIdChannel.ID,
        ItemsDeleteChannel.ID,
        ItemsOpenExternalChannel.ID,
        ItemGetMetadataChannel.ID,
        ItemSetMetadataChannel.ID,
        ItemsImportChannel.ID
    ]);
    eventReceiver.setListener((eventId: string, payload: any) => actionHandler.triggerAction(eventId, payload));

}
