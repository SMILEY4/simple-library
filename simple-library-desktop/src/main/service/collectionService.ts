import {Collection, CollectionType} from '../../common/commonModels';
import {ItemService} from "./ItemService";
import {failedAsync} from '../../common/AsyncCommon';
import {CollectionsGetAllQuery} from "../persistence/queries/CollectionsGetAllQuery";
import DataAccess from "../persistence/dataAccess";
import {CollectionGetByIdQuery} from "../persistence/queries/CollectionGetByIdQuery";
import {CollectionInsertCommand} from "../persistence/commands/CollectionInsertCommand";
import {CollectionDeleteCommand} from "../persistence/commands/CollectionDeleteCommand";
import {CollectionUpdateNameCommand} from "../persistence/commands/CollectionUpdateNameCommand";
import {CollectionUpdateSmartQueryCommand} from "../persistence/commands/CollectionUpdateSmartQueryCommand";
import {CollectionUpdateParentGroupCommand} from "../persistence/commands/CollectionUpdateParentGroupCommand";
import {CollectionInsertItemsCommand} from "../persistence/commands/CollectionInsertItemsCommand";
import {CollectionMoveItemsCommand} from "../persistence/commands/CollectionMoveItemsCommand";
import {CollectionDeleteItemsCommand} from "../persistence/commands/CollectionDeleteItemsCommand";

export class CollectionService {

    itemService: ItemService;
    dataAccess: DataAccess


    constructor(itemService: ItemService, dataAccess: DataAccess) {
        this.itemService = itemService;
        this.dataAccess = dataAccess
    }


    /**
     * Get all collections including the "all items"-collection.
     * @param includeItemCount whether to include the item count of each collection (otherwise count is undefined)
     * @return a promise that resolves with the array of {@link Collection} + the "all items"-collection
     * */
    public getAllCollections(includeItemCount: boolean): Promise<Collection[]> {
        return CollectionsGetAllQuery.run(this.dataAccess, includeItemCount);
    }


    /**
     * Create a new normal collection with the given name
     * @param name the name of the collection
     * @param parentGroupId the id of the parent group or undefined
     * @return a promise that resolves with the created {@link Collection}
     */
    public createNormalCollection(name: string, parentGroupId: number | null): Promise<Collection> {
        return this.createCollection(name.trim(), CollectionType.NORMAL, null, parentGroupId);
    }


    /**
     * Create a new smart collection with the given name
     * @param name the name of the collection
     * @param query the query of the smart collection
     * @param parentGroupId the id of the parent group or undefined
     * @return a promise that resolves with the created {@link Collection}
     */
    public async createSmartCollection(name: string, query: string, parentGroupId: number | null): Promise<Collection> {
        const createdCollection: Collection = await this.createCollection(name.trim(), CollectionType.SMART, query.trim(), parentGroupId);
        return this.itemService.getAllItems(createdCollection.id, [])
            .then(() => createdCollection)
            .catch(error => {
                new CollectionDeleteCommand(createdCollection.id).run(this.dataAccess)
                throw error;
            });
    }

    private createCollection(name: string, type: CollectionType, query: string | null, parentGroupId: number | null): Promise<Collection> {
        return CollectionInsertCommand.run(this.dataAccess, {
            name: name,
            type: type,
            smartQuery: query,
            groupId: parentGroupId
        })
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
     * Deletes the collection with the given id
     * @param collectionId the id of the collection
     * @return a promise that resolves when the collection was deleted
     */
    public deleteCollection(collectionId: number): Promise<void> {
    	return CollectionDeleteCommand.run(this.dataAccess, collectionId).then();
    }


    /**
     * Deletes the collection with the given id
     * @param collectionId the id of the collection
     * @param newName the new name of the collection (null to not rename)
     * @param newSmartQuery the new query (or null to not change)
     * @return a promise that resolves when the collection was renamed
     */
    public async editCollection(collectionId: number, newName: string, newSmartQuery: string | null): Promise<void> {
        const collection: Collection | null = await CollectionGetByIdQuery.run(this.dataAccess, collectionId);
        if (!collection) {
            return failedAsync("Could not edit collection. Collection does not exist.");
        }
        if (newName) {
        	await CollectionUpdateNameCommand.run(this.dataAccess, collectionId, newName.trim());
        }
        if (collection.type === CollectionType.SMART) {
        	await CollectionUpdateSmartQueryCommand.run(this.dataAccess, collectionId, newSmartQuery.trim())
                .then(() => this.itemService.getAllItems(collectionId, []))
                .catch(error => {
                    new CollectionUpdateSmartQueryCommand(collectionId, collection.smartQuery).run(this.dataAccess);
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
        return CollectionUpdateParentGroupCommand.run(this.dataAccess, collectionId, targetGroupId ? targetGroupId : null).then();
    }


    /**
     * Move/Copy the given items to the given target collection
     * @param srcCollectionId the id of source collection
     * @param tgtCollectionId the id of the target collection
     * @param itemIds the ids of the items to move/copy
     * @param copyMode whether to copy the items, i.e. not remove the items from the source collection
     */
    public async moveItemsToCollection(srcCollectionId: number, tgtCollectionId: number, itemIds: number[], copyMode: boolean): Promise<void> {
        const srcCollection: Collection | null = await CollectionGetByIdQuery.run(this.dataAccess, srcCollectionId)
        const tgtCollection: Collection | null = await CollectionGetByIdQuery.run(this.dataAccess, tgtCollectionId)

        if (!srcCollection) {
            return failedAsync("Can not move/copy items. Source collection not found.");
        }
        if (!tgtCollection) {
            return failedAsync("Can not move/copy items. Target collection not found.");
        }
        if (tgtCollection.type === CollectionType.SMART) {
            return failedAsync("Can not move/copy items. Target collection can not be a Smart-Collection.");
        }

        if (copyMode) {
            return CollectionInsertItemsCommand.run(this.dataAccess, tgtCollectionId, itemIds).then();
        } else {
        	return CollectionMoveItemsCommand.run(this.dataAccess, srcCollectionId, tgtCollectionId, itemIds);
        }
    }

    /**
     * Removes the given items from the given collection
     * @param collectionId the id of the collection
     * @param itemIds the ids of the items to remove
     */
    public async removeItemsFromCollection(collectionId: number, itemIds: number[]): Promise<void> {
        const collection: Collection | null = await CollectionGetByIdQuery.run(this.dataAccess, collectionId);

        if (!collection) {
            return failedAsync("Can not remove items. Collection not found.");
        }
        if (collection.type === CollectionType.SMART) {
            return failedAsync("Can not remove items. Collection can not be a Smart-Collection.");
        }

        return CollectionDeleteItemsCommand.run(this.dataAccess, collectionId, itemIds).then();
    }

}
