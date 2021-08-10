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
import {workerIpcWrapper} from "../common/messaging/core/ipcWrapper";
import {ActionHandler} from "./actionHandler";
import {EventReceiver} from "../common/events/eventReceiver";

export function initWorker(): void {
    console.log("initialize worker");

    const channelImportStatus = new ItemsImportStatusChannel(workerIpcWrapper(), "w");
    const broadcaster = (eventId: string, payload: any) => {
        switch (eventId) {
            case ItemsImportStatusChannel.ID: {
                return channelImportStatus.sendAndForget(payload);
            }
            default: {
                return Promise.resolve();
            }
        }
    }
    const actionHandler = new ActionHandler(broadcaster);

    const eventReceiver = new EventReceiver(workerIpcWrapper(), {
        idPrefix: "w",
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
