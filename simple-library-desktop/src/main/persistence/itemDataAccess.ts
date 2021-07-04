import DataAccess from './dataAccess';
import {sqlInsertItem, sqlInsertItemAttribs,} from './sql/sql';
import {ItemData, MetadataEntry, MetadataEntryType} from '../../common/commonModels';
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
        return new ItemsGetAllQuery(collectionId, itemAttributeKeys).run(this.dataAccess)
    }

    /**
     * Get all items matching the given smart-query
     * @param query the query as a string
     * @param itemAttributeKeys the keys of attributes to extract together with the items
     * @return a promise that resolves with the array of {@link ItemData}
     */
    public getItemsBySmartQuery(query: string, itemAttributeKeys: string[]): Promise<ItemData[]> {
        return new ItemsGetAllBySmartQuery(query, itemAttributeKeys).run(this.dataAccess);
    }

    /**
     * Get all items with the given id
     * @param itemIds the ids of the items to fetch
     * @param itemAttributeKeys the keys of attributes to extract together with the items
     * @return a promise that resolves with the array of {@link ItemData}
     */
    public getItemsByIds(itemIds: number[], itemAttributeKeys: string[]): Promise<ItemData[]> {
        return new ItemsGetByIdInQuery(itemIds, itemAttributeKeys).run(this.dataAccess);
    }

    /**
     * Get the total item count
     * @return a promise that resolves with the number of total items
     */
    public getTotalItemCount(): Promise<number> {
        return new ItemsCountQuery().run(this.dataAccess);
    }

    /**
     * Get the item count for a normal collection of the given id
     * @param collectionId the id of the collection
     * @return a promise that resolves with the number of items in the given collection
     */
    public getItemCountByCollectionId(collectionId: number): Promise<number> {
        return new ItemsCountByCollectionIdQuery(collectionId).run(this.dataAccess)
    }

    /**
     * Get the amount of items matching the given smart-query
     * @param smartQuery the query to match
     * @return a promise that resolves with the number of matching items
     */
    public getItemCountBySmartQuery(smartQuery: string): Promise<number> {
        return new ItemsCountBySmartQuery(smartQuery).run(this.dataAccess)
    }

    /**
     * Completely delete the items with the given ids
     * @param itemIds the ids of the items to delete
     */
    public deleteItems(itemIds: number[]): Promise<void> {
        return new ItemsDeleteCommand(itemIds).run(this.dataAccess);
    }

    /**
     * Fetch all metadata entries for the given item
     * @param itemId the id of the item
     */
    public getItemMetadata(itemId: number): Promise<MetadataEntry[]> {
        return new AttributesGetByItemIdQuery(itemId).run(this.dataAccess);
    }

    /**
     * Fetch a single metadata entry for the given item
     * @param itemId the id of the item
     * @param entryKey the key of the metadata entry
     */
    public getItemMetadataEntry(itemId: number, entryKey: string): Promise<MetadataEntry | null> {
        return new AttributesGetByItemIdAndKeyQuery(itemId, entryKey).run(this.dataAccess)
    }

    /**
     * Set the value of a single metadata entry of the given item
     * @param itemId the id of the item
     * @param entryKey the key of the metadata entry
     * @param newValue the new value
     */
    public setItemMetadataEntry(itemId: number, entryKey: string, newValue: string): Promise<void> {
        return new AttributeUpdateValueCommand(itemId, entryKey, newValue).run(this.dataAccess).then()
    }

}
