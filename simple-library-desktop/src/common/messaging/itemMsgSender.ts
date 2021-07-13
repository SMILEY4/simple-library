import {BrowserWindow} from "electron";
import {AbstractMsgSender} from "./core/abstractMsgSender";
import {IpcWrapper, mainIpcWrapper, rendererIpcWrapper} from "./core/msgUtils";
import {ImportProcessData, ImportResult, ImportStatus, ItemData, MetadataEntry} from "../commonModels";
import {ItemMsgConstants} from "./itemMsgHandler";

abstract class AbstractItemMsgSender extends AbstractMsgSender {

	protected constructor(ipcWrapper: IpcWrapper) {
		super(ItemMsgConstants.PREFIX, ipcWrapper);
	}

	public get(
		collectionId: number,
		itemAttributeKeys: string[]
	): Promise<ItemData[]> {
		return this.send(ItemMsgConstants.GET, {
			collectionId: collectionId,
			itemAttributeKeys: itemAttributeKeys
		});
	}

	public getById(
		itemId: number
	): Promise<ItemData | null> {
		return this.send(ItemMsgConstants.GET_BY_ID, {
			itemId: itemId
		});
	}

	public deleteItems(
		itemIds: number[]
	): Promise<void> {
		return this.send(ItemMsgConstants.DELETE, {
			itemIds: itemIds
		});
	}

	public importItems(
		data: ImportProcessData
	): Promise<ImportResult> {
		return this.send(ItemMsgConstants.IMPORT, {
			data: data
		});
	}

	public importStatus(
		status: ImportStatus
	): void {
		this.send(ItemMsgConstants.IMPORT_STATUS, {status: status}, true).then();
	}

	public getMetadata(
		itemId: number
	): Promise<MetadataEntry[]> {
		return this.send(ItemMsgConstants.GET_METADATA, {
			itemId: itemId
		});
	}

	public setMetadata(
		itemId: number,
		entryKey: string,
		newValue: string
	): Promise<MetadataEntry> {
		return this.send(ItemMsgConstants.SET_METADATA, {
			itemId: itemId,
			entryKey: entryKey,
			newValue: newValue
		});
	}

	public openExternal(
		itemIds: number[]
	): Promise<void> {
		return this.send(ItemMsgConstants.OPEN_EXTERNAL, {
			itemIds: itemIds
		});
	}

}


export class MainItemMsgSender extends AbstractItemMsgSender {

	constructor(browserWindow: BrowserWindow) {
		super(mainIpcWrapper(browserWindow));
	}

}


export class RenderItemMsgSender extends AbstractItemMsgSender {

	constructor() {
		super(rendererIpcWrapper());
	}

}
