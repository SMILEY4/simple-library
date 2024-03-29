import {ActionHandler} from "./actionHandler";
import {BrowserWindow} from "electron";
import {EventConsumer} from "../common/events/core/eventConsumer";
import {EventBroadcaster} from "../common/events/core/eventBroadcaster";
import {EventIds} from "../common/events/eventIds";
import {DataRepository} from "./service/dataRepository";
import {SQLiteDataRepository} from "./persistence/sqliteRepository";
import {DbAccess} from "./persistence/dbAcces";

export function initWorker(isDev: boolean, runInMain?: boolean, targetBrowserWindow?: BrowserWindow | (() => BrowserWindow)): void {

	const eventConsumer = new EventConsumer({
		eventIds: EventIds.ALL_IDS,
		comPartner: {
			partner: runInMain === true ? "renderer" : "main",
			window: runInMain === true ? targetBrowserWindow : undefined
		},
		eventIdPrefix: runInMain === true ? "r" : "w",
		suppressPayloadLog: [EventIds.GET_ITEMS_BY_COLLECTION, EventIds.GET_ITEM_BY_ID]
	});

	const eventBroadcaster = new EventBroadcaster({
		comPartner: {
			partner: runInMain === true ? "renderer" : "main",
			window: runInMain === true ? targetBrowserWindow : undefined
		},
		eventIdPrefix: runInMain === true ? "r" : "w",
		suppressPayloadLog: [EventIds.GET_ITEMS_BY_COLLECTION, EventIds.GET_ITEM_BY_ID]
	});

	const dataRepository: DataRepository = new SQLiteDataRepository(new DbAccess());
	const actionHandler = new ActionHandler(dataRepository, (eventId: string, payload: any) => {
		switch (eventId) {
			case EventIds.IMPORT_STATUS: {
				return eventBroadcaster.send(EventIds.IMPORT_STATUS, payload);
			}
			case EventIds.EMBED_ITEM_ATTRIBUTES_STATUS: {
				return eventBroadcaster.send(EventIds.EMBED_ITEM_ATTRIBUTES_STATUS, payload);
			}
			default: {
				return Promise.resolve();
			}
		}
	}, isDev, !runInMain);

	eventConsumer.onAll((eventId: string, event: any) => actionHandler.triggerAction(eventId, event));
}
