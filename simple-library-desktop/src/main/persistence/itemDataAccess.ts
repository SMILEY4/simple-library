import DataAccess from './dataAccess';
import { sqlAllItems, sqlAllItemsWithCollectionIds, sqlCountItems, sqlInsertItem } from './sql';
import { ItemData } from '../../common/commonModels';

export class ItemDataAccess {

    dataAccess: DataAccess;


    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }

    public async getTotalItemCount(): Promise<number> {
        return this.dataAccess.queryAll(sqlCountItems())
            .then((rows: any) => {
                let count: number = 0;
                if(rows && rows.length === 1) {
                    count = rows[0].count;
                }
                return count;
            });
    }

    public async insertItem(data: ItemData): Promise<ItemData> {
        return this.dataAccess.executeRun(sqlInsertItem(data.filepath, data.timestamp, data.hash, data.thumbnail))
            .then((id: number) => {
                data.id = id;
                return data;
            });
    }

    public async getAllItems(collectionId: number | undefined, includeCollections: boolean): Promise<ItemData[]> {
        const sqlQuery: string = includeCollections ? sqlAllItemsWithCollectionIds(collectionId) : sqlAllItems(collectionId);
        return this.dataAccess.queryAll(sqlQuery)
            .then((rows: any) => rows.map((row: any) => {
                return {
                    id: row.item_id,
                    timestamp: row.timestamp_imported,
                    sourceFilepath: row.filepath,
                    filepath: row.filepath,
                    hash: row.hash,
                    thumbnail: row.thumbnail,
                    collectionIds: (includeCollections ? this.toCollectionIds(row.collections) : undefined),
                };
            }));
    }

    private toCollectionIds(strCollectionIds: string): number[] {
        return strCollectionIds
            .split(";")
            .map((id: string) => parseInt(id))
            .filter((id: number) => id && !isNaN(id));
    }

}