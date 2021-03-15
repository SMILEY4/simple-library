import { CollectionDataAccess } from '../../persistence/collectionDataAccess';
import { Collection } from '../../../common/commonModels';
import { ItemService } from "../item/ItemService";

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
                const allItemsCollection: Collection = {
                    id: undefined,
                    groupId: undefined,
                    itemCount: includeItemCount ? await this.itemService.getTotalItemCount() : undefined,
                    name: "All Items",
                };
                return [allItemsCollection, ...collections];
            });
    }


    /**
     * Create a new collection with the given name
     * @param name the name of the collection
     * @return a promise that resolves with the created {@link Collection}
     */
    public createCollection(name: string): Promise<Collection> {
        return this.collectionDataAccess.createCollection(name.trim());
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
     * @param newCollectionName the new name of the collection
     * @return a promise that resolves when the collection was renamed
     */
    public renameCollection(collectionId: number, newCollectionName: string): Promise<void> {
        return this.collectionDataAccess.renameCollection(collectionId, newCollectionName);
    }

    /**
     * Move/Copy the given items to the given target collection
     * @param srcCollectionId the id of source collection
     * @param tgtCollectionId the id of the target collection
     * @param itemIds the ids of the items to move/copy
     * @param copyMode whether to copy the items, i.e. not remove the items from the source collection
     */
    public async moveItemsToCollection(srcCollectionId: number, tgtCollectionId: number, itemIds: number[], copyMode: boolean): Promise<void> {
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
