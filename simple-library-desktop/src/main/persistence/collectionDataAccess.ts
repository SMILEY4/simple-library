import DataAccess from './dataAccess';
import {Collection, CollectionType} from '../../common/commonModels';
import {ItemDataAccess} from './itemDataAccess';
import {CollectionsGetAllQuery} from "./queries/CollectionsGetAllQuery";
import {CollectionGetByIdQuery} from "./queries/CollectionGetByIdQuery";
import {CollectionInsertCommand} from "./commands/CollectionInsertCommand";
import {CollectionDeleteCommand} from "./commands/CollectionDeleteCommand";
import {CollectionUpdateNameCommand} from "./commands/CollectionUpdateNameCommand";
import {CollectionUpdateSmartQueryCommand} from "./commands/CollectionUpdateSmartQueryCommand";
import {CollectionsUpdateParentGroupsCommand} from "./commands/CollectionsUpdateParentGroupsCommand";
import {CollectionUpdateParentGroupCommand} from "./commands/CollectionUpdateParentGroupCommand";
import {CollectionInsertItemsCommand} from "./commands/CollectionInsertItemsCommand";
import {CollectionMoveItemsCommand} from "./commands/CollectionMoveItemsCommand";
import {CollectionDeleteItemsCommand} from "./commands/CollectionDeleteItemsCommand";

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
        return new CollectionsGetAllQuery(includeItemCount).run(this.dataAccess)
    }


    /**
     * Find the collection with the given id
     * @param collectionId the id to search for
     * @return a promise that resolves with the found collection or null if none found
     */
    public findCollection(collectionId: number): Promise<Collection | null> {
        return new CollectionGetByIdQuery(collectionId).run(this.dataAccess)
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
        return new CollectionInsertCommand({
            name: name,
            type: type,
            smartQuery: query,
            groupId: parentGroupId
        })
            .run(this.dataAccess)
            .then((id: number) => ({
                id: id,
                name: name,
                type: type,
                smartQuery: query,
                itemCount: null,
                groupId: parentGroupId,
            }));
    }

    /**
     * Deletes the given collection
     * @param collectionId the id of the collection
     * @return a promise that resolves when the collection was deleted
     */
    public deleteCollection(collectionId: number): Promise<void> {
        return new CollectionDeleteCommand(collectionId).run(this.dataAccess).then();
    }


    /**
     * Renames the given collection
     * @param collectionId the id of the collection
     * @param name the new name of the collection
     * @return a promise that resolves when the collection was renamed
     */
    public renameCollection(collectionId: number, name: string): Promise<void> {
        return new CollectionUpdateNameCommand(collectionId, name).run(this.dataAccess).then();
    }

    /**
     * Edits the smart-query of the given collection
     * @param collectionId the id of the collection
     * @param query the new smart-query of the collection
     * @return a promise that resolves when the collection was modified
     */
    public editCollectionSmartQuery(collectionId: number, query: string | null): Promise<void> {
        return new CollectionUpdateSmartQueryCommand(collectionId, query).run(this.dataAccess).then();
    }

    /**
     * Moves all child collections of the given parent group to the new group
     * @param prevParentGroupId the id of the previous parent group
     * @param newParentGroupId the id of the new parent group
     * @return a promise that resolves when the collections were moved
     */
    public moveCollections(prevParentGroupId: number | null, newParentGroupId: number | null): Promise<void> {
        return new CollectionsUpdateParentGroupsCommand(prevParentGroupId, newParentGroupId).run(this.dataAccess).then();
    }

    /**
     * Moves the collection with the given id into the group with the given id
     * @param collectionId the id of the collection
     * @param targetGroupId the id of the new parent group
     * @return a promise that resolves when the collection was moved
     */
    public moveCollection(collectionId: number, targetGroupId: number | null): Promise<void> {
        return new CollectionUpdateParentGroupCommand(collectionId, targetGroupId).run(this.dataAccess).then();
    }

    /**
     * Adds the given items to the given collection
     * @param collectionId the id of the collection
     * @param itemIds the ids of the items to copy
     * @return a promise that resolves when the items were copied
     */
    public copyItemToCollection(collectionId: number, itemIds: number[]): Promise<void> {
        return new CollectionInsertItemsCommand(collectionId, itemIds).run(this.dataAccess).then();
    }


    /**
     * Adds the given items to the given target collection and removes them from the given source collection
     * @param srcCollectionId the id of the source collection
     * @param tgtCollectionId the id of the target collection
     * @param itemIds the ids of the items to move
     * @return a promise that resolves when the items were moved
     */
    public moveItemsToCollection(srcCollectionId: number, tgtCollectionId: number, itemIds: number[]): Promise<void> {
        return new CollectionMoveItemsCommand(srcCollectionId, tgtCollectionId, itemIds).run(this.dataAccess)
    }


    /**
     * Removes the given items from the given collection
     * @param collectionId the id of the collection
     * @param itemIds the ids of the items to remove
     */
    public removeItemsFromCollection(collectionId: number, itemIds: number[]): Promise<void> {
        return new CollectionDeleteItemsCommand(collectionId, itemIds).run(this.dataAccess).then()
    }

}
