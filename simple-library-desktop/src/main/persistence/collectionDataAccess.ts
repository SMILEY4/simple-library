import DataAccess from './dataAccess';
import {
    sqlAddItemsToCollection,
    sqlAllCollections,
    sqlDeleteCollection,
    sqlFindCollectionById,
    sqlInsertCollection,
    sqlRemoveItemsFromCollection,
    sqlUpdateCollectionName,
    sqlUpdateCollectionsGroupId,
    sqlUpdateCollectionSmartQuery,
    sqlUpdateCollectionsParents,
} from './sql/sql';
import {Collection, CollectionType} from '../../common/commonModels';
import {ItemDataAccess} from './itemDataAccess';
import {startAsyncWithValue} from "../../common/AsyncCommon";

export class CollectionDataAccess {

    dataAccess: DataAccess;
    itemDataAccess: ItemDataAccess;

    constructor(dataAccess: DataAccess, itemDataAccess: ItemDataAccess) {
        this.dataAccess = dataAccess;
        this.itemDataAccess = itemDataAccess;
    }

    /**
     * Get all collections
     * @param includeItemCount whether to also include the amount of items in each collection (false -> itemCount is undefined)
     * @return a promise that resolves with the array of {@link Collection}s
     */
    public getCollections(includeItemCount: boolean): Promise<Collection[]> {
        if (includeItemCount) {
            return this.dataAccess.queryAll(sqlAllCollections(true))
                .then((rows: any[]) => rows.map((row: any) => CollectionDataAccess.rowToCollection(row, true)))
                .then(async (collections: Collection[]) => {
                    for (let i = 0; i < collections.length; i++) {
                        if (collections[i].type === CollectionType.SMART) {
                            collections[i].itemCount = await this.getSmartItemCount(collections[i])
                        }
                    }
                    return collections;
                });
        } else {
            return this.dataAccess.queryAll(sqlAllCollections(false))
                .then((rows: any[]) => rows.map((row: any) => CollectionDataAccess.rowToCollection(row, false)));
        }
    }


    /**
     * Find the collection with the given id
     * @param collectionId the id to search for
     * @return a promise that resolves with the found collection or null if none found
     */
    public findCollection(collectionId: number): Promise<Collection | null> {
        return this.dataAccess.querySingle(sqlFindCollectionById(collectionId))
            .then((row: any | undefined) => CollectionDataAccess.rowToCollection(row, false));
    }

    /**
     * Creates a new collection with the given name
     * @param name the name of the collection
     * @param type the type of the collection
     * @param query the query for a smart-collection or null
     * @param parentGroupId the id of the parent group or undefined
     * @return a promise that resolves with the created collection
     */
    public createCollection(name: string, type: CollectionType, query: string | null, parentGroupId: number | null): Promise<Collection> {
        return this.dataAccess.executeRun(sqlInsertCollection(name, type, query, parentGroupId ? parentGroupId : null))
            .then((id: number) => {
                return {
                    id: id,
                    name: name,
                    type: type,
                    smartQuery: query,
                    itemCount: null,
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
     * Edits the smart-query of the given collection
     * @param collectionId the id of the collection
     * @param query the new smart-query of the collection
     * @return a promise that resolves when the collection was modified
     */
    public editCollectionSmartQuery(collectionId: number, query: string | null): Promise<void> {
        return this.dataAccess.executeRun(sqlUpdateCollectionSmartQuery(collectionId, query)).then();
    }

    /**
     * Moves all child collections of the given parent group to the new group
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
     * Adds the given items to the given collection
     * @param collectionId the id of the collection
     * @param itemIds the ids of the items to copy
     * @return a promise that resolves when the items were copied
     */
    public async copyItemToCollection(collectionId: number, itemIds: number[]): Promise<void> {
        if (collectionId) {
            return this.dataAccess.executeRun(sqlAddItemsToCollection(collectionId, itemIds)).then();
        } else {
            return Promise.resolve();
        }
    }


    /**
     * Adds the given items to the given target collection and removes them from the given source collection
     * @param srcCollectionId the id of the source collection
     * @param tgtCollectionId the id of the target collection
     * @param itemIds the ids of the items to move
     * @return a promise that resolves when the items were moved
     */
    public async moveItemsToCollection(srcCollectionId: number, tgtCollectionId: number, itemIds: number[]): Promise<void> {
        await this.dataAccess.executeRun(sqlAddItemsToCollection(tgtCollectionId, itemIds))
        await this.dataAccess.executeRun(sqlRemoveItemsFromCollection(srcCollectionId, itemIds))
    }


    /**
     * Removes the given items from the given collection
     * @param collectionId the id of the collection
     * @param itemIds the ids of the items to remove
     */
    public async removeItemsFromCollection(collectionId: number, itemIds: number[]): Promise<void> {
        return this.dataAccess.executeRun(sqlRemoveItemsFromCollection(collectionId, itemIds)).then()
    }


    private getSmartItemCount(collection: Collection): Promise<number> {
        if (collection.type === CollectionType.SMART) {
            const smartQuery: string = collection.smartQuery;
            if (smartQuery && smartQuery.trim().length > 0) {
                return this.itemDataAccess.getItemCountBySmartQuery(smartQuery.trim());
            } else {
                return this.itemDataAccess.getTotalItemCount();
            }
        } else {
            return startAsyncWithValue(0)
        }
    }


    private static rowToCollection(row: any, includeItemCount: boolean): Collection | null {
        if (row) {
            return {
                id: row.collection_id,
                name: row.collection_name,
                type: row.collection_type,
                smartQuery: row.smart_query ? row.smart_query : null,
                groupId: row.group_id,
                itemCount: includeItemCount ? row.item_count : null,
            };
        } else {
            return null;
        }
    }

}
