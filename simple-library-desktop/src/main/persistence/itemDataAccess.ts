import DataAccess from './dataAccess';
import {ItemData, MetadataEntry} from '../../common/commonModels';
import {ItemsGetAllQuery} from "./queries/ItemsGetAllQuery";
import {ItemsGetAllBySmartQuery} from "./queries/ItemsGetAllBySmartQuery";
import {ItemsGetByIdInQuery} from "./queries/ItemsGetByIdInQuery";
import {ItemsCountQuery} from "./queries/ItemsCountQuery";
import {ItemsCountByCollectionIdQuery} from "./queries/ItemsCountByCollectionIdQuery";
import {ItemsCountBySmartQuery} from "./queries/ItemsCountBySmartQuery";
import {ItemsDeleteCommand} from "./commands/ItemsDeleteCommand";
import {AttributesGetByItemIdQuery} from "./queries/AttributesGetByItemIdQuery";
import {AttributesGetByItemIdAndKeyQuery} from "./queries/AttributesGetByItemIdAndKeyQuery";
import {AttributeUpdateValueCommand} from "./commands/AttributeUpdateValueCommand";
import {ItemInsertWithAttributesCommand} from "./commands/ItemInsertWithAttributesCommand";

export class ItemDataAccess {

    dataAccess: DataAccess;


    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }

    /**
     * Inserts the given item into the db
     * @param data the item to save
     * @return a promise that resolves with the saved item data (including the item-id)
     */
    public insertItem(data: ItemData): Promise<void> {
        return new ItemInsertWithAttributesCommand({
            filepath: data.filepath,
            timestamp: data.timestamp,
            hash: data.hash,
            thumbnail: data.thumbnail,
            attributes: data.metadataEntries
        }).run(this.dataAccess);
    }

    /**
     * Get all items in the given collection (if provided)
     * @param collectionId the id of the collection or undefined to get all items
     * @param itemAttributeKeys the keys of attributes to extract together with the items
     * @return a promise that resolves with the array of {@link ItemData}
     */
    public getAllItems(collectionId: number, itemAttributeKeys: string[]): Promise<ItemData[]> {
        return ItemsGetAllQuery.run(this.dataAccess, collectionId, itemAttributeKeys)
    }

    /**
     * Get all items matching the given smart-query
     * @param query the query as a string
     * @param itemAttributeKeys the keys of attributes to extract together with the items
     * @return a promise that resolves with the array of {@link ItemData}
     */
    public getItemsBySmartQuery(query: string, itemAttributeKeys: string[]): Promise<ItemData[]> {
        return ItemsGetAllBySmartQuery.run(this.dataAccess, query, itemAttributeKeys);
    }

    /**
     * Get all items with the given id
     * @param itemIds the ids of the items to fetch
     * @param itemAttributeKeys the keys of attributes to extract together with the items
     * @return a promise that resolves with the array of {@link ItemData}
     */
    public getItemsByIds(itemIds: number[], itemAttributeKeys: string[]): Promise<ItemData[]> {
        return ItemsGetByIdInQuery.run(this.dataAccess, itemIds, itemAttributeKeys);
    }

    /**
     * Get the total item count
     * @return a promise that resolves with the number of total items
     */
    public getTotalItemCount(): Promise<number> {
        return ItemsCountQuery.run(this.dataAccess);
    }

    /**
     * Get the item count for a normal collection of the given id
     * @param collectionId the id of the collection
     * @return a promise that resolves with the number of items in the given collection
     */
    public getItemCountByCollectionId(collectionId: number): Promise<number> {
        return ItemsCountByCollectionIdQuery.run(this.dataAccess, collectionId)
    }

    /**
     * Get the amount of items matching the given smart-query
     * @param smartQuery the query to match
     * @return a promise that resolves with the number of matching items
     */
    public getItemCountBySmartQuery(smartQuery: string): Promise<number> {
        return ItemsCountBySmartQuery.run(this.dataAccess, smartQuery);
    }

    /**
     * Completely delete the items with the given ids
     * @param itemIds the ids of the items to delete
     */
    public deleteItems(itemIds: number[]): Promise<void> {
        return ItemsDeleteCommand.run(this.dataAccess, itemIds);
    }

    /**
     * Fetch all metadata entries for the given item
     * @param itemId the id of the item
     */
    public getItemMetadata(itemId: number): Promise<MetadataEntry[]> {
        return AttributesGetByItemIdQuery.run(this.dataAccess, itemId);
    }

    /**
     * Fetch a single metadata entry for the given item
     * @param itemId the id of the item
     * @param entryKey the key of the metadata entry
     */
    public getItemMetadataEntry(itemId: number, entryKey: string): Promise<MetadataEntry | null> {
        return AttributesGetByItemIdAndKeyQuery.run(this.dataAccess, itemId, entryKey);
    }

    /**
     * Set the value of a single metadata entry of the given item
     * @param itemId the id of the item
     * @param entryKey the key of the metadata entry
     * @param newValue the new value
     */
    public setItemMetadataEntry(itemId: number, entryKey: string, newValue: string): Promise<void> {
        return AttributeUpdateValueCommand.run(this.dataAccess, itemId, entryKey, newValue).then();
    }

}
