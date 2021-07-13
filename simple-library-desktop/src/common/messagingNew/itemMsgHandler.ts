import {AbstractMsgHandler} from "./core/abstractMsgHandler";
import {IpcWrapper, mainIpcWrapper, rendererIpcWrapper} from "./core/msgUtils";
import {ItemService} from "../../main/service/ItemService";
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


abstract class AbstractItemMsgHandler extends AbstractMsgHandler {

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


export class MainItemMsgHandler extends AbstractItemMsgHandler {

	private readonly itemService: ItemService;

	constructor(itemService: ItemService) {
		super(mainIpcWrapper());
		this.itemService = itemService;
	}

	protected get(
		collectionId: number,
		itemAttributeKeys: string[]
	): Promise<ItemData[]> {
		return this.itemService.getAllItems(collectionId, itemAttributeKeys);
	}

	protected getById(
		itemId: number
	): Promise<ItemData | null> {
		return this.itemService.getItemById(itemId);
	}

	protected deleteItems(
		itemIds: number[]
	): Promise<void> {
		return this.itemService.deleteItems(itemIds);
	}

	protected importItems(
		data: ImportProcessData
	): Promise<ImportResult> {
		return this.itemService.importFiles(data);
	}

	protected importStatus(status: ImportStatus): void {
		throw "handle import status not implemented on main-process";
	}

	protected getMetadata(
		itemId: number
	): Promise<MetadataEntry[]> {
		return this.itemService.getItemMetadata(itemId);
	}

	protected setMetadata(
		itemId: number,
		entryKey: string,
		newValue: string
	): Promise<MetadataEntry> {
		return this.itemService.setItemMetadata(itemId, entryKey, newValue);
	}

	protected openExternal(
		itemIds: number[]
	): Promise<void> {
		return this.itemService.openFilesExternal(itemIds);
	}

}


export class RenderItemMsgHandler extends AbstractItemMsgHandler {

	importStatusListeners: ((status: ImportStatus) => void)[] = [];

	constructor() {
		super(rendererIpcWrapper());
	}

	public addImportStatusListener(listener: (status: ImportStatus) => void): void {
		this.importStatusListeners.push(listener);
	}

	public removeImportStatusListener(listener: (status: ImportStatus) => void): void {
		this.importStatusListeners = this.importStatusListeners.filter(l => l !== listener);
	}

	protected get(collectionId: number, itemAttributeKeys: string[]): Promise<ItemData[]> {
		throw "not implemented on render-process";
	}

	protected getById(itemId: number): Promise<ItemData | null> {
		throw "not implemented on render-process";
	}

	protected deleteItems(itemIds: number[]): Promise<void> {
		throw "not implemented on render-process";
	}

	protected importItems(data: ImportProcessData): Promise<ImportResult> {
		throw "not implemented on render-process";
	}

	protected importStatus(status: ImportStatus): void {
		this.importStatusListeners.forEach(listener => listener(status));
	}

	protected getMetadata(itemId: number): Promise<MetadataEntry[]> {
		throw "not implemented on render-process";
	}

	protected setMetadata(
		itemId: number,
		entryKey: string,
		newValue: string
	): Promise<MetadataEntry> {
		throw "not implemented on render-process";
	}

	protected openExternal(itemIds: number[]): Promise<void> {
		throw "not implemented on render-process";
	}

}

