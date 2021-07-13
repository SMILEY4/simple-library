import {AbstractMsgHandler} from "./core/abstractMsgHandler";
import {IpcWrapper, rendererIpcWrapper} from "./core/msgUtils";
import {ImportProcessData, ImportResult, ImportStatus, ItemData, MetadataEntry} from "../commonModels";

export module ItemMsgConstants {
	export const PREFIX: string = "item";
	export const GET: string = "get";
	export const GET_BY_ID: string = "get-by-id";
	export const DELETE: string = "delete";
	export const IMPORT: string = "import";
	export const IMPORT_STATUS: string = "import-status";
	export const GET_METADATA: string = "get-metadata";
	export const SET_METADATA: string = "set-metadata";
	export const OPEN_EXTERNAL: string = "open-external";
}


export abstract class AbstractItemMsgHandler extends AbstractMsgHandler {

	protected constructor(ipcWrapper: IpcWrapper) {
		super(ItemMsgConstants.PREFIX, ipcWrapper);
		this.register(ItemMsgConstants.GET, (payload: any) => this.get(payload.collectionId, payload.itemAttributeKeys));
		this.register(ItemMsgConstants.GET_BY_ID, (payload: any) => this.getById(payload.itemId));
		this.register(ItemMsgConstants.DELETE, (payload: any) => this.deleteItems(payload.itemIds));
		this.register(ItemMsgConstants.IMPORT, (payload: any) => this.importItems(payload.data));
		this.register(ItemMsgConstants.IMPORT_STATUS, (payload: any) => this.importStatus(payload.status));
		this.register(ItemMsgConstants.GET_METADATA, (payload: any) => this.getMetadata(payload.itemId));
		this.register(ItemMsgConstants.SET_METADATA, (payload: any) => this.setMetadata(payload.itemId, payload.entryKey, payload.newValue));
		this.register(ItemMsgConstants.OPEN_EXTERNAL, (payload: any) => this.openExternal(payload.itemIds));
	}

	protected abstract get(
		collectionId: number,
		itemAttributeKeys: string[]
	): Promise<ItemData[]>;

	protected abstract getById(
		itemId: number
	): Promise<ItemData | null>;

	protected abstract deleteItems(
		itemIds: number[]
	): Promise<void>;

	protected abstract importItems(
		data: ImportProcessData
	): Promise<ImportResult>;

	protected abstract importStatus(
		status: ImportStatus
	): void;

	protected abstract getMetadata(
		itemId: number
	): Promise<MetadataEntry[]>;

	protected abstract setMetadata(
		itemId: number,
		entryKey: string,
		newValue: string
	): Promise<MetadataEntry>;

	protected abstract openExternal(
		itemIds: number[]
	): Promise<void>;

}
