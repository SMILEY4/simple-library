import DataAccess from './dataAccess';
import { sqlAllItems, sqlInsertItem } from './sql';
import { ItemData } from '../../common/commonModels';

export class ItemDataAccess {

    dataAccess: DataAccess;


    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }

    public insertItem(data: ItemData): Promise<any> {
        return this.dataAccess.executeRun(sqlInsertItem(data.filepath, data.timestamp, data.hash, data.thumbnail));
    }

    public getAllItems(): Promise<ItemData[]> {
        return this.dataAccess.queryAll(sqlAllItems())
            .then((rows: any) => rows.map((row: any) => {
                return {
                    id: row.id,
                    timestamp: row.timestamp_imported,
                    filepath: row.filepath,
                    hash: row.hash,
                    thumbnail: row.thumbnail,
                };
            }));
    }

}