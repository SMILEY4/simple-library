import {CollectionService} from "../service/collectionService";
import {mainIpcWrapper} from "../../common/messaging/core/msgUtils";
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

	private readonly channelGetAll = new CollectionsGetAllChannel(mainIpcWrapper());
	private readonly channelCreate = new CollectionCreateChannel(mainIpcWrapper());
	private readonly channelDelete = new CollectionDeleteChannel(mainIpcWrapper());
	private readonly channelEdit = new CollectionEditChannel(mainIpcWrapper());
	private readonly channelMove = new CollectionMoveChannel(mainIpcWrapper());
	private readonly channelMoveItems = new CollectionMoveItemsChannel(mainIpcWrapper());
	private readonly channelRemoveItems = new CollectionRemoveItemsChannel(mainIpcWrapper());


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


	public init(): MainCollectionMsgHandler {
		this.channelGetAll.init();
		this.channelCreate.init();
		this.channelDelete.init();
		this.channelEdit.init();
		this.channelMove.init();
		this.channelMoveItems.init();
		this.channelRemoveItems.init();
		return this;
	}

}
