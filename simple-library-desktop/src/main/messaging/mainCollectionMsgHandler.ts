import {CollectionService} from "../service/collectionService";
import {mainIpcWrapper} from "../../common/messaging/core/msgUtils";
import {Collection, CollectionType} from "../../common/commonModels";
import {AbstractCollectionMsgHandler} from "../../common/messaging/collectionMsgHandler";

export class MainCollectionMsgHandler extends AbstractCollectionMsgHandler {

	private readonly collectionService: CollectionService;

	constructor(collectionService: CollectionService) {
		super(mainIpcWrapper());
		this.collectionService = collectionService;
	}

	protected getAll(includeItemCount: boolean): Promise<Collection[]> {
		return this.collectionService.getAllCollections(includeItemCount);
	}

	protected createCollection(
		name: string,
		type: CollectionType,
		parentGroupId: number | null,
		smartQuery: string | null
	): Promise<Collection> {
		if (type === CollectionType.SMART) {
			return this.collectionService.createSmartCollection(name, smartQuery, parentGroupId);
		} else {
			return this.collectionService.createNormalCollection(name, parentGroupId);
		}
	}

	protected deleteCollection(collectionId: number): Promise<void> {
		return this.collectionService.deleteCollection(collectionId);
	}

	protected editCollection(
		collectionId: number,
		newName: string,
		newSmartQuery: string
	): Promise<void> {
		return this.collectionService.editCollection(collectionId, newName, newSmartQuery);
	}

	protected moveCollection(
		collectionId: number,
		targetGroupId: number | null
	): Promise<void> {
		return this.collectionService.moveCollection(collectionId, targetGroupId);
	}

	protected moveItemsToCollection(
		sourceCollectionId: number,
		targetCollectionId: number,
		itemIds: number[],
		copy: boolean
	): Promise<void> {
		return this.collectionService.moveItemsToCollection(sourceCollectionId, targetCollectionId, itemIds, copy);
	}

	protected removeItemsFromCollection(
		collectionId: number,
		itemIds: number[]
	): Promise<void> {
		return this.collectionService.removeItemsFromCollection(collectionId, itemIds);
	}

}
