import DataAccess from './dataAccess';
import {
    sqlCountItemsWithCollectionId,
    sqlCountItemsWithCustomFilter,
    sqlDeleteItems,
    sqlGetItemsByCustomFilter,
    sqlGetItemsCountTotal,
    sqlGetItemsInCollection,
    sqlInsertItem,
    sqlInsertItemAttribs,
    sqlRemoveItemsFromAllCollections,
} from './sql/sql';
import {ItemData} from '../../common/commonModels';

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
    public insertItem(data: ItemData): Promise<ItemData> {
        return this.dataAccess.executeRun(sqlInsertItem(data.filepath, data.timestamp, data.hash, data.thumbnail))
            .then((id: number) => {
                data.id = id;
                return data;
            }).then((item: ItemData) => {
                if (item.metadataEntries) {
                    console.log(sqlInsertItemAttribs(item.id, item.metadataEntries))
                    this.dataAccess.executeRun(sqlInsertItemAttribs(item.id, item.metadataEntries))
                        .then(() => item);
                } else {
                    return item;
                }
            });
    }

    /**
     * Get all items in the given collection (if provided)
     * @param collectionId the id of the collection or undefined to get all items
     * @return a promise that resolves with the array of {@link ItemData}
     */
    public getAllItems(collectionId: number): Promise<ItemData[]> {
        return this.dataAccess.queryAll(sqlGetItemsInCollection(collectionId))
            .then((rows: any[]) => rows.map(ItemDataAccess.rowToItem));
    }

    /**
     * Get all items matching the given smart-query
     * @param query the query as a string
     * @return a promise that resolves with the array of {@link ItemData}
     */
    public getItemsBySmartQuery(query: string): Promise<ItemData[]> {
        return this.dataAccess.queryAll(sqlGetItemsByCustomFilter(query))
            .then((rows: any[]) => rows.map(ItemDataAccess.rowToItem));
    }

    /**
     * Get all items with the given id
     * @param itemIds the ids of the items to fetch
     * @return a promise that resolves with the array of {@link ItemData}
     */
    public getItemsByIds(itemIds: number[]): Promise<ItemData[]> {
        return this.dataAccess.queryAll(sqlGetItemsByCustomFilter("item_id IN (" + itemIds.join(",") + ")"))
            .then((rows: any[]) => rows.map(ItemDataAccess.rowToItem));
    }

    /**
     * Get the total item count
     * @return a promise that resolves with the number of total items
     */
    public getTotalItemCount(): Promise<number> {
        return this.dataAccess.querySingle(sqlGetItemsCountTotal())
            .then((row: any) => row.count);
    }

    /**
     * Get the item count for a normal collection of the given id
     * @param collectionId the id of the collection
     * @return a promise that resolves with the number of items in the given collection
     */
    public getItemCountByCollectionId(collectionId: number): Promise<number> {
        return this.dataAccess.querySingle(sqlCountItemsWithCollectionId(collectionId))
            .then((row: any) => row.count);
    }

    /**
     * Get the amount of items matching the given smart-query
     * @param smartQuery the query to match
     * @return a promise that resolves with the number of matching items
     */
    public getItemCountBySmartQuery(smartQuery: string): Promise<number> {
        return this.dataAccess.querySingle(sqlCountItemsWithCustomFilter(smartQuery.trim()))
            .then((row: any) => row.count);
    }

    /**
     * Completely delete the items with the given ids
     * @param itemIds the ids of the items to delete
     */
    public async deleteItems(itemIds: number[]): Promise<void> {
        await this.dataAccess.executeRun(sqlRemoveItemsFromAllCollections(itemIds))
        await this.dataAccess.executeRun(sqlDeleteItems(itemIds))
    }

    private static rowToItem(row: any): ItemData {
        return {
            id: row.item_id,
            timestamp: row.timestamp_imported,
            filepath: row.filepath,
            sourceFilepath: row.filepath,
            hash: row.hash,
            thumbnail: row.thumbnail,
        };
    }

}