import DataAccess from './dataAccess';
import {
    sqlAddItemToCollection,
    sqlAllCollections,
    sqlDeleteCollection,
    sqlInsertCollection,
    sqlRemoveItemFromCollection,
    sqlUpdateCollectionName,
    sqlUpdateCollectionsGroupId,
    sqlUpdateCollectionsParents,
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
                        groupId: row.group_id ? row.group_id : undefined,
                    };
                }));
        } else {
            return this.dataAccess.queryAll(sqlAllCollections(false))
                .then((rows: any[]) => rows.map((row: any) => {
                    return {
                        id: row.collection_id,
                        name: row.collection_name,
                        groupId: row.group_id,
                        itemCount: undefined,
                    };
                }));
        }
    }

    /**
     * Creates a new collection with the given name
     * @param name the name of the collection
     * @param parentGroupId the id of the parent group or undefined
     * @return a promise that resolves with the created collection
     */
    public createCollection(name: string, parentGroupId: number | undefined): Promise<Collection> {
        return this.dataAccess.executeRun(sqlInsertCollection(name, parentGroupId ? parentGroupId : null))
            .then((id: number) => {
                return {
                    id: id,
                    name: name,
                    itemCount: undefined,
                    groupId: parentGroupId,
                };
            });
    }

    /**
     * Deletes the given collection
     * @param collectionId the id of the collection
     * @return a promise that resolves when the collection was deleted
     */
    public deleteCollection(collectionId: number): Promise<void> {
        return this.dataAccess.executeRun(sqlDeleteCollection(collectionId)).then();
    }


    /**
     * Renames the given collection
     * @param collectionId the id of the collection
     * @param name the new name of the collection
     * @return a promise that resolves when the collection was renamed
     */
    public renameCollection(collectionId: number, name: string): Promise<void> {
        return this.dataAccess.executeRun(sqlUpdateCollectionName(collectionId, name)).then();
    }

    /**
     * Moves the all child collections of the given parent group to the new group
     * @param prevParentGroupId the id of the previous parent group
     * @param newParentGroupId the id of the new parent group
     * @return a promise that resolves when the collections were moved
     */
    public moveCollections(prevParentGroupId: number | null, newParentGroupId: number | null): Promise<void> {
        return this.dataAccess.executeRun(sqlUpdateCollectionsParents(prevParentGroupId, newParentGroupId)).then();
    }

    /**
     * Moves the collection with the given id into the group with the given id
     * @param collectionId the id of the collection
     * @param targetGroupId the id of the new parent group
     * @return a promise that resolves when the collection was moved
     */
    public moveCollection(collectionId: number, targetGroupId: number | null): Promise<void> {
        return this.dataAccess.executeRun(sqlUpdateCollectionsGroupId(collectionId, targetGroupId)).then();
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
        }
    }


    /**
     * Removes the given item from the given collection
     * @param collectionId the id of the collection
     * @param itemId the id of the item to remove
     */
    public removeItemsFromCollection(collectionId: number, itemId: number): Promise<void> {
        return this.dataAccess.executeRun(sqlRemoveItemFromCollection(collectionId, itemId)).then();
    }

}
