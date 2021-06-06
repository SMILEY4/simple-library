import {CollectionDataAccess} from '../persistence/collectionDataAccess';
import {Collection, CollectionType} from '../../common/commonModels';
import {ItemService} from "./ItemService";
import {failedAsync} from '../../common/AsyncCommon';

export class CollectionService {

	collectionDataAccess: CollectionDataAccess;
	itemService: ItemService;


	constructor(itemService: ItemService, collectionDataAccess: CollectionDataAccess) {
		this.collectionDataAccess = collectionDataAccess;
		this.itemService = itemService;
	}


	/**
	 * Get all collections including the "all items"-collection.
	 * @param includeItemCount whether to include the item count of each collection (otherwise count is undefined)
	 * @return a promise that resolves with the array of {@link Collection} + the "all items"-collection
	 * */
	public getAllCollections(includeItemCount: boolean): Promise<Collection[]> {
		return this.collectionDataAccess.getCollections(includeItemCount);
	}


	/**
	 * Create a new normal collection with the given name
	 * @param name the name of the collection
	 * @param parentGroupId the id of the parent group or undefined
	 * @return a promise that resolves with the created {@link Collection}
	 */
	public createNormalCollection(name: string, parentGroupId: number | null): Promise<Collection> {
		return this.collectionDataAccess.createCollection(name.trim(), CollectionType.NORMAL, null, parentGroupId);
	}


	/**
	 * Create a new smart collection with the given name
	 * @param name the name of the collection
	 * @param query the query of the smart collection
	 * @param parentGroupId the id of the parent group or undefined
	 * @return a promise that resolves with the created {@link Collection}
	 */
	public createSmartCollection(name: string, query: string, parentGroupId: number | null): Promise<Collection> {
		return this.collectionDataAccess.createCollection(name.trim(), CollectionType.SMART, query.trim(), parentGroupId);
	}


	/**
	 * Deletes the collection with the given id
	 * @param collectionId the id of the collection
	 * @return a promise that resolves when the collection was deleted
	 */
	public deleteCollection(collectionId: number): Promise<void> {
		return this.collectionDataAccess.deleteCollection(collectionId);
	}


	/**
	 * Deletes the collection with the given id
	 * @param collectionId the id of the collection
	 * @param newName the new name of the collection (null to not rename)
	 * @param newSmartQuery the new query (or null to not change)
	 * @return a promise that resolves when the collection was renamed
	 */
	public async editCollection(collectionId: number, newName: string, newSmartQuery: string | null): Promise<void> {
		const collection: Collection | null = await this.collectionDataAccess.findCollection(collectionId);
		if (!collection) {
			return failedAsync("Could not edit collection. Collection does not exist.");
		}
		if (newName) {
			await this.collectionDataAccess.renameCollection(collectionId, newName);
		}
		if (collection.type === CollectionType.SMART) {
			await this.collectionDataAccess.editCollectionSmartQuery(collectionId, newSmartQuery)
				.then(() => this.itemService.getAllItems(collectionId))
				.catch(error => {
					this.collectionDataAccess.editCollectionSmartQuery(collectionId, collection.smartQuery);
					throw error;
				});
		}
	}


	/**
	 * Moves the collection with the given id into the group with the given id
	 * @param collectionId the id of the collection
	 * @param targetGroupId the id of the new parent group
	 * @return a promise that resolves when the collection was moved
	 */
	public moveCollection(collectionId: number, targetGroupId: number | null): Promise<void> {
		return this.collectionDataAccess.moveCollection(collectionId, targetGroupId ? targetGroupId : null);
	}


	/**
	 * Move/Copy the given items to the given target collection
	 * @param srcCollectionId the id of source collection
	 * @param tgtCollectionId the id of the target collection
	 * @param itemIds the ids of the items to move/copy
	 * @param copyMode whether to copy the items, i.e. not remove the items from the source collection
	 */
	public async moveItemsToCollection(srcCollectionId: number, tgtCollectionId: number, itemIds: number[], copyMode: boolean): Promise<void> {
		const srcCollection: Collection | null = await this.collectionDataAccess.findCollection(srcCollectionId);
		const tgtCollection: Collection | null = await this.collectionDataAccess.findCollection(tgtCollectionId);

		if (!srcCollection) {
			return failedAsync("Can not move/copy items. Source collection not found.");
		}
		if (!tgtCollection) {
			return failedAsync("Can not move/copy items. Target collection not found.");
		}
		if (tgtCollection.type === CollectionType.SMART) {
			return failedAsync("Can not move/copy items. Target collection can not be a Smart-Collection.");
		}

		for (let i = 0; i < itemIds.length; i++) {
			const itemId: number = itemIds[i];
			if (copyMode) {
				await this.collectionDataAccess.copyItemToCollection(tgtCollectionId, itemId);
			} else {
				await this.collectionDataAccess.moveItemsToCollection(srcCollectionId, tgtCollectionId, itemId);
			}
		}
	}

	/**
	 * Removes the given items from the given collection
	 * @param collectionId the id of the collection
	 * @param itemIds the ids of the items to remove
	 */
	public async removeItemsFromCollection(collectionId: number, itemIds: number[]): Promise<void> {
		const collection: Collection | null = await this.collectionDataAccess.findCollection(collectionId);

		if (!collection) {
			return failedAsync("Can not remove items. Collection not found.");
		}
		if (collection.type === CollectionType.SMART) {
			return failedAsync("Can not remove items. Collection can not be a Smart-Collection.");
		}

		for (let i = 0; i < itemIds.length; i++) {
			await this.collectionDataAccess.removeItemFromCollection(collectionId, itemIds[i]);
		}
	}

}
