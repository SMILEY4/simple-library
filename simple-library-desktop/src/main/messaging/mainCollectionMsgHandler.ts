import {CollectionService} from "../service/collectionService";
import {mainIpcWrapper} from "../../common/messaging/core/ipcWrapper";
import {CollectionType} from "../../common/commonModels";
import {
	CollectionCreateChannel,
	CollectionDeleteChannel,
	CollectionEditChannel,
	CollectionMoveChannel,
	CollectionMoveItemsChannel,
	CollectionRemoveItemsChannel,
	CollectionsGetAllChannel
} from "../../common/messaging/channels/channels";

export class MainCollectionMsgHandler {

	private readonly collectionService: CollectionService;

	private readonly channelGetAll = new CollectionsGetAllChannel(mainIpcWrapper(), "r");
	private readonly channelCreate = new CollectionCreateChannel(mainIpcWrapper(), "r");
	private readonly channelDelete = new CollectionDeleteChannel(mainIpcWrapper(), "r");
	private readonly channelEdit = new CollectionEditChannel(mainIpcWrapper(), "r");
	private readonly channelMove = new CollectionMoveChannel(mainIpcWrapper(), "r");
	private readonly channelMoveItems = new CollectionMoveItemsChannel(mainIpcWrapper(), "r");
	private readonly channelRemoveItems = new CollectionRemoveItemsChannel(mainIpcWrapper(), "r");


	constructor(collectionService: CollectionService) {
		this.collectionService = collectionService;

		this.channelGetAll.on((includeItemCount: boolean) => {
			return this.collectionService.getAllCollections(includeItemCount);
		});

		this.channelCreate.on((payload) => {
			if (payload.type === CollectionType.SMART) {
				return this.collectionService.createSmartCollection(payload.name, payload.smartQuery, payload.parentGroupId);
			} else {
				return this.collectionService.createNormalCollection(payload.name, payload.parentGroupId);
			}
		});

		this.channelDelete.on((collectionId: number) => {
			return this.collectionService.deleteCollection(collectionId);
		});

		this.channelEdit.on((payload) => {
			return this.collectionService.editCollection(payload.collectionId, payload.newName, payload.newSmartQuery);
		});

		this.channelMove.on((payload) => {
			return this.collectionService.moveCollection(payload.collectionId, payload.targetGroupId);
		});

		this.channelMoveItems.on((payload) => {
			return this.collectionService.moveItemsToCollection(payload.sourceCollectionId, payload.targetCollectionId, payload.itemIds, payload.copy);
		});

		this.channelRemoveItems.on((payload) => {
			return this.collectionService.removeItemsFromCollection(payload.collectionId, payload.itemIds);
		});

	}

}
