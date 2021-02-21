import DataAccess from './dataAccess';
import { ImportData } from '../service/import/importService';
import { sqlInsertItem } from './sql';

export class ItemDataAccess {

    dataAccess: DataAccess;


    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }

    public insertItem(data: ImportData): Promise<any> {
        return this.dataAccess.executeRun(sqlInsertItem(data.filepath, data.timestamp, data.hash, data.thumbnail));
    }

}