import DataAccess from './dataAccess';
import {
    sqlAddItemToCollection,
    sqlAllCollections,
    sqlDeleteCollection,
    sqlInsertCollection,
    sqlRemoveItemFromCollection,
    sqlUpdateCollection,
} from './sql/sql';
import { Collection } from '../../common/commonModels';

export class CollectionDataAccess {

    dataAccess: DataAccess;


    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }

    /**
     * Get all collections
     * @param includeItemCount whether to also include the amount of items in each collection (false -> itemCount is undefined)
     * @return a promise that resolves with the array of {@link Collection}s
     */
    public getCollections(includeItemCount: boolean): Promise<Collection[]> {
        if (includeItemCount) {
            return this.dataAccess.queryAll(sqlAllCollections(true))
                .then((rows: any[]) => rows.map((row: any) => {
                    return {
                        id: row.collection_id,
                        name: row.collection_name,
                        itemCount: row.item_count,
                        groupId: row.parent_group_id ? row.parent_group_id : undefined,
                    };
                }));
        } else {
            return this.dataAccess.queryAll(sqlAllCollections(false))
                .then((rows: any[]) => rows.map((row: any) => {
                    return {
                        id: row.collection_id,
                        name: row.collection_name,
                        groupId: row.parent_group_id,
                        itemCount: undefined,
                    };
                }));
        }
    }

    /**
     * Creates a new collection with the given name
     * @param name the name of the collection
     * @return a promise that resolves with the created collection
     */
    public createCollection(name: string): Promise<Collection> {
        return this.dataAccess.executeRun(sqlInsertCollection(name))
            .then((id: number) => {
                return {
                    id: id,
                    name: name,
                    itemCount: undefined,
                    groupId: undefined,
                };
            });
    }

    /**
     * Deletes the given collection
     * @param collectionId the id of the collection
     * @return a promise that resolves when the collection was deleted
     */
    public deleteCollection(collectionId: number): Promise<void> {
        return this.dataAccess.executeRun(sqlDeleteCollection(collectionId))
            .then();
    }


    /**
     * Renames the given collection
     * @param collectionId the id of the collection
     * @param name the new name of the collection
     * @return a promise that resolves when the collection was renamed
     */
    public renameCollection(collectionId: number, name: string): Promise<void> {
        return this.dataAccess.executeRun(sqlUpdateCollection(collectionId, name)).then();
    }

    /**
     * Adds the given item to the given collection
     * @param collectionId the id of the collection
     * @param itemId the id of the item to copy
     * @return a promise that resolves when the item was copied
     */
    public copyItemToCollection(collectionId: number, itemId: number): Promise<void> {
        if (collectionId) {
            return this.dataAccess.executeRun(sqlAddItemToCollection(collectionId, itemId)).then();
        } else {
            return Promise.resolve();
        }
    }


    /**
     * Adds the given item to the given target collection and removes it from the given source collection
     * @param srcCollectionId the id of the source collection
     * @param tgtCollectionId the id of the target collection or undefined
     * (if undefined, the item will not be added to any collection, but still removed from the source collection)
     * @param itemId the id of the item to move
     * @return a promise that resolves when the item was moved
     */
    public moveItemsToCollection(srcCollectionId: number, tgtCollectionId: number | undefined, itemId: number): Promise<void> {
        if (tgtCollectionId) {
            return this.dataAccess.executeRun(sqlAddItemToCollection(tgtCollectionId, itemId))
                .then(() => {
                    if (srcCollectionId !== undefined) {
                        return this.dataAccess.executeRun(sqlRemoveItemFromCollection(srcCollectionId, itemId));
                    }
                })
                .then();
        } else {
            return this.dataAccess.executeRun(sqlRemoveItemFromCollection(srcCollectionId, itemId)).then();
        }
    }

}
