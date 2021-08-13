import {ipcComWith} from "../common/events/core/ipcWrapper";
import {ActionHandler} from "./actionHandler";
import {EventReceiver} from "../common/events/core/eventReceiver";
import {BrowserWindow} from "electron";
import {EventIds, ItemsImportStatusEventSender} from "../common/events/events";
import {EventConsumer} from "../common/eventsNew/core/eventConsumer";
import {EventMainPartner, EventRendererPartner} from "../common/eventsNew/core/event";

export function initWorker(runInMain?: boolean, targetBrowserWindow?: BrowserWindow | (() => BrowserWindow)): void {
    console.log("initialize worker");

    const eventPrefix = runInMain === true ? "r" : "w";
    const ipcWrapper = runInMain === true ? ipcComWith("renderer", targetBrowserWindow) : ipcComWith("main")

    const senderImportStatus = new ItemsImportStatusEventSender(ipcWrapper, eventPrefix)
    const broadcaster = (eventId: string, payload: any) => {
        switch (eventId) {
            case EventIds.IMPORT_STATUS: {
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
            EventIds.GET_ITEMS_BY_COLLECTION,
            EventIds.GET_ITEM_BY_ID
        ]
    })
    eventReceiver.addEventId([
        EventIds.OPEN_CONFIG,
        EventIds.GET_EXIFTOOL_INFO,
        EventIds.GET_THEME,
        EventIds.SET_THEME,
        // EventIds.GET_LAST_OPENED_LIBS,
        EventIds.CREATE_LIBRARY,
        EventIds.OPEN_LIBRARY,
        EventIds.CLOSE_LIBRARY,
        EventIds.GET_LIBRARY_INFO,
        EventIds.GET_GROUP_TREE,
        EventIds.CREATE_GROUP,
        EventIds.DELETE_GROUP,
        EventIds.RENAME_GROUP,
        EventIds.MOVE_GROUP,
        EventIds.GET_ALL_COLLECTIONS,
        EventIds.CREATE_COLLECTION,
        EventIds.DELETE_COLLECTION,
        EventIds.EDIT_COLLECTION,
        EventIds.MOVE_COLLECTION,
        EventIds.MOVE_ITEMS,
        EventIds.REMOVE_ITEMS,
        EventIds.GET_ITEMS_BY_COLLECTION,
        EventIds.GET_ITEM_BY_ID,
        EventIds.DELETE_ITEMS,
        EventIds.OPEN_ITEMS,
        EventIds.GET_ITEM_ATTRIBUTES,
        EventIds.SET_ITEM_ATTRIBUTE,
        EventIds.IMPORT_ITEMS
    ]);
    eventReceiver.setListener((eventId: string, payload: any) => actionHandler.triggerAction(eventId, payload));

    const eventConsumer = new EventConsumer({
        eventIds: [EventIds.GET_LAST_OPENED_LIBS],
        comPartner: {
            partner: "renderer",
            window: targetBrowserWindow
        },
        eventIdPrefix: "r",
    });
    eventConsumer.on(EventIds.GET_LAST_OPENED_LIBS, () => actionHandler.triggerAction(EventIds.GET_LAST_OPENED_LIBS))

}
