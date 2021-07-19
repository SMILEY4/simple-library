import {ItemService} from "../service/ItemService";
import {mainIpcWrapper} from "../../common/messaging/core/msgUtils";
import {ImportProcessData} from "../../common/commonModels";
import {
	ItemGetByIdChannel,
	ItemGetMetadataChannel,
	ItemsDeleteChannel,
	ItemSetMetadataChannel,
	ItemsGetByCollectionChannel,
	ItemsImportChannel,
	ItemsOpenExternalChannel
} from "../../common/messaging/channels/channels";

export class MainItemMsgHandler {

	private readonly itemService: ItemService;

	private readonly channelGetByCollection = new ItemsGetByCollectionChannel(mainIpcWrapper(), "r");
	private readonly channelGetById = new ItemGetByIdChannel(mainIpcWrapper(), "r");
	private readonly channelDelete = new ItemsDeleteChannel(mainIpcWrapper(), "r");
	private readonly channelImport = new ItemsImportChannel(mainIpcWrapper(), "r");
	private readonly channelGetMetadata = new ItemGetMetadataChannel(mainIpcWrapper(), "r");
	private readonly channelSetMetadata = new ItemSetMetadataChannel(mainIpcWrapper(), "r");
	private readonly channelOpenExternal = new ItemsOpenExternalChannel((mainIpcWrapper()), "r");


	constructor(itemService: ItemService) {
		this.itemService = itemService;

		this.channelGetByCollection.on((payload) => {
			return this.itemService.getAllItems(payload.collectionId, payload.itemAttributeKeys);
		});

		this.channelGetById.on((itemId: number) => {
			return this.itemService.getItemById(itemId);
		});

		this.channelDelete.on((itemIds: number[]) => {
			return this.itemService.deleteItems(itemIds);
		});

		this.channelImport.on((importData: ImportProcessData) => {
			return this.itemService.importFiles(importData);
		});

		this.channelGetMetadata.on((itemId: number) => {
			return this.itemService.getItemMetadata(itemId);
		});

		this.channelSetMetadata.on((payload) => {
			return this.itemService.setItemMetadata(payload.itemId, payload.entryKey, payload.newValue);
		});

		this.channelOpenExternal.on((itemIds: number[]) => {
			return this.itemService.openFilesExternal(itemIds);
		});

	}

}
