import {ImportProcessData, ImportResult, ImportStatus, ItemData, MetadataEntry} from "../../../common/commonModels";
import {rendererIpcWrapper} from "../../../common/messaging/core/msgUtils";
import {AbstractItemMsgHandler} from "../../../common/messaging/itemMsgHandler";

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