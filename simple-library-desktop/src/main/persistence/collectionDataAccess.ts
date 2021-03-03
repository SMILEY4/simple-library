import DataAccess from './dataAccess';
import {
    sqlAddItemToCollection,
    sqlAllCollections,
    sqlDeleteCollection,
    sqlInsertCollection,
    sqlUpdateCollection,
} from './sql';
import { Collection } from '../../common/commonModels';

export class CollectionDataAccess {

    dataAccess: DataAccess;


    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }

    public getCollections(): Promise<Collection[]> {
        return this.dataAccess.queryAll(sqlAllCollections())
            .then((rows: any) => rows.map((row: any) => {
                return {
                    id: row.collection_id,
                    name: row.collection_name,
                };
            }));
    }

    public createCollection(name: string): Promise<Collection> {
        return this.dataAccess.executeRun(sqlInsertCollection(name))
            .then((id: number) => {
                return {
                    id: id,
                    name: name,
                };
            });
    }

    public deleteCollection(collectionId: number): Promise<void> {
        return this.dataAccess.executeRun(sqlDeleteCollection(collectionId)).then();
    }

    public renameCollection(collectionId: number, name: string): Promise<void> {
        return this.dataAccess.executeRun(sqlUpdateCollection(collectionId, name)).then();
    }

    public addItemToCollection(collectionId: number, itemId: number): Promise<void> {
        return this.dataAccess.executeRun(sqlAddItemToCollection(collectionId, itemId)).then();
    }

}