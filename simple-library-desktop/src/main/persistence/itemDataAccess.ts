import DataAccess from './dataAccess';
import { ImportData } from '../service/import/importService';
import { sqlInsertItem } from './sql';
import { ItemData } from '../service/ItemService';

export class ItemDataAccess {

    dataAccess: DataAccess;


    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }

    public insertItem(data: ImportData): Promise<any> {
        return this.dataAccess.executeRun(sqlInsertItem(data.filepath, data.timestamp, data.hash, data.thumbnail));
    }

    public getAllItems(): Promise<ItemData[]> {
        return this.dataAccess.queryAll("SELECT * FROM items;")
            .then((rows: any) => rows.map((row: any) => {
                return {
                    timestamp: row.timestamp_imported,
                    filepath: row.filepath,
                    hash: row.hash,
                    thumbnail: row.thumbnail,
                };
            }));
    }

}