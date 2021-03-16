import DataAccess from './dataAccess';
import { sqlCountItems, sqlGetItemsInCollection, sqlInsertItem } from './sql/sql';
import { ItemData } from '../../common/commonModels';

export class ItemDataAccess {

    dataAccess: DataAccess;


    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }


    /**
     * @return a promise that resolves with the number of all items in the library
     */
    public getTotalItemCount(): Promise<number> {
        return this.dataAccess.queryAll(sqlCountItems())
            .then((rows: any[]) => {
                let count: number = 0;
                if (rows && rows.length === 1) {
                    count = rows[0].count;
                }
                return count;
            });
    }

    /**
     * Inserts the given item into the db
     * @param data the item to save
     * @return a promise that resolves with the saved item data (including the item-id)
     */
    public async insertItem(data: ItemData): Promise<ItemData> {
        return this.dataAccess.executeRun(sqlInsertItem(data.filepath, data.timestamp, data.hash, data.thumbnail))
            .then((id: number) => {
                data.id = id;
                return data;
            });
    }

    /**
     * Get all items in the given collection (if provided)
     * @param collectionId the id of the collection or undefined to get all items
     * @return a promise that resolves with the array of {@link ItemData}
     */
    public getAllItems(collectionId: number | undefined): Promise<ItemData[]> {
        return this.dataAccess.queryAll(sqlGetItemsInCollection(collectionId))
            .then((rows: any[]) => rows.map((row: any) => {
                return {
                    id: row.item_id,
                    timestamp: row.timestamp_imported,
                    filepath: row.filepath,
                    sourceFilepath: row.filepath,
                    hash: row.hash,
                    thumbnail: row.thumbnail,
                };
            }));
    }

}