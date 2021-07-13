import {ItemService} from "../service/ItemService";
import {mainIpcWrapper} from "../../common/messaging/core/msgUtils";
import {ImportProcessData, ImportResult, ImportStatus, ItemData, MetadataEntry} from "../../common/commonModels";
import {AbstractItemMsgHandler} from "../../common/messaging/itemMsgHandler";

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
