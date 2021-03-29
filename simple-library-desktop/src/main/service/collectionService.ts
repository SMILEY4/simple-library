import { CollectionDataAccess } from '../persistence/collectionDataAccess';
import { ALL_ITEMS_COLLECTION_ID, Collection, CollectionType } from '../../common/commonModels';
import { ItemService } from "./ItemService";
import { failedAsync } from '../../common/AsyncCommon';

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
        return this.collectionDataAccess.getCollections(includeItemCount)
            .then(async (collections: Collection[]) => {
                const allItemsCollection: Collection = await this.buildAllItemsCollection(includeItemCount);
                return [allItemsCollection, ...collections];
            });
    }


    private async buildAllItemsCollection(includeItemCount: boolean): Promise<Collection> {
        return {
            id: ALL_ITEMS_COLLECTION_ID,
            name: "All Items",
            type: CollectionType.NORMAL,
            smartQuery: null,
            groupId: undefined,
            itemCount: includeItemCount ? await this.itemService.getTotalItemCount() : undefined,
        };
    }


    /**
     * Create a new normal collection with the given name
     * @param name the name of the collection
     * @param parentGroupId the id of the parent group or undefined
     * @return a promise that resolves with the created {@link Collection}
     */
    public createNormalCollection(name: string, parentGroupId: number | undefined): Promise<Collection> {
        return this.collectionDataAccess.createCollection(name.trim(), CollectionType.NORMAL, null, parentGroupId);
    }


    /**
     * Create a new smart collection with the given name
     * @param name the name of the collection
     * @param query the query of the smart collection
     * @param parentGroupId the id of the parent group or undefined
     * @return a promise that resolves with the created {@link Collection}
     */
    public createSmartCollection(name: string, query: string, parentGroupId: number | undefined): Promise<Collection> {
        return this.collectionDataAccess.createCollection(name.trim(), CollectionType.SMART, query.trim(), parentGroupId);
    }


    /**
     * Deletes the collection with the given id
     * @param collectionId the id of the collection
     * @return a promise that resolves when the collection was deleted
     */
    public deleteCollection(collectionId: number): Promise<void> {
        if (collectionId === ALL_ITEMS_COLLECTION_ID) {
            return failedAsync("Can not delete \"All-Items-Collection\".");
        } else {
            return this.collectionDataAccess.deleteCollection(collectionId);
        }
    }


    /**
     * Deletes the collection with the given id
     * @param collectionId the id of the collection
     * @param newCollectionName the new name of the collection
     * @return a promise that resolves when the collection was renamed
     */
    public renameCollection(collectionId: number, newCollectionName: string): Promise<void> {
        if (collectionId === ALL_ITEMS_COLLECTION_ID) {
            return failedAsync("Can not rename \"All-Items-Collection\".");
        } else {
            return this.collectionDataAccess.renameCollection(collectionId, newCollectionName);
        }
    }


    /**
     * Moves the collection with the given id into the group with the given id
     * @param collectionId the id of the collection
     * @param targetGroupId the id of the new parent group
     * @return a promise that resolves when the collection was moved
     */
    public moveCollection(collectionId: number, targetGroupId: number | undefined): Promise<void> {
        if (collectionId === ALL_ITEMS_COLLECTION_ID) {
            return failedAsync("Can not move \"All-Items-Collection\".");
        } else {
            return this.collectionDataAccess.moveCollection(collectionId, targetGroupId ? targetGroupId : null);
        }
    }


    /**
     * Move/Copy the given items to the given target collection
     * @param srcCollectionId the id of source collection
     * @param tgtCollectionId the id of the target collection
     * @param itemIds the ids of the items to move/copy
     * @param copyMode whether to copy the items, i.e. not remove the items from the source collection
     */
    public async moveItemsToCollection(srcCollectionId: number | null, tgtCollectionId: number, itemIds: number[], copyMode: boolean): Promise<void> {
        if (tgtCollectionId === ALL_ITEMS_COLLECTION_ID) {
            return failedAsync("Can not move or copy items into \"All-Items-Collection\".");
        } else {
            const srcCollection: Collection | null = await this.collectionDataAccess.findCollection(srcCollectionId);
            const tgtCollection: Collection | null = await this.collectionDataAccess.findCollection(tgtCollectionId);

            if (!tgtCollection) {
                return failedAsync("Can not move/copy items. Target collection not found.");
            }
            if (tgtCollection.type === CollectionType.SMART) {
                return failedAsync("Can not move/copy items. Target collection can not be a Smart-Collection.");
            }
            if (srcCollection !== ALL_ITEMS_COLLECTION_ID && srcCollection.type === CollectionType.SMART && copyMode === true) {
                return failedAsync("Can not copy items. Source collection can not be a Smart-Collection.");
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
    }

    /**
     * Removes the given items from the given collection
     * @param collectionId the id of the collection
     * @param itemIds the ids of the items to remove
     */
    public async removeItemsFromCollection(collectionId: number, itemIds: number[]): Promise<void> {
        if (collectionId === ALL_ITEMS_COLLECTION_ID) {
            return failedAsync("Can not remove items from \"All-Items-Collection\".");
        } else {
            const collection: Collection | null = await this.collectionDataAccess.findCollection(collectionId);
            if (collectionId === null || collection.type === CollectionType.SMART) {
                return failedAsync("Can not remove items. Collection must exist and can not be a Smart-Collection.");
            } else {
                for (let i = 0; i < itemIds.length; i++) {
                    await this.collectionDataAccess.removeItemsFromCollection(collectionId, itemIds[i]);
                }
            }
        }
    }

}
