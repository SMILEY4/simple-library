import DataAccess from './dataAccess';
import {
    sqlAddItemToCollection,
    sqlAllCollections,
    sqlDeleteCollection,
    sqlInsertCollection,
    sqlRemoveItemFromCollection,
    sqlUpdateCollection,
} from './sql';
import { Collection } from '../../common/commonModels';

export class CollectionDataAccess {

    dataAccess: DataAccess;


    constructor(dataAccess: DataAccess) {
        this.dataAccess = dataAccess;
    }

    public getCollections(includeItemCount: boolean): Promise<Collection[]> {
        if (includeItemCount) {
            return this.dataAccess.queryAll(sqlAllCollections(true))
                .then((rows: any) => rows.map((row: any) => {
                    return {
                        id: row.collection_id,
                        name: row.collection_name,
                        itemCount: row.item_count,
                    };
                }));
        } else {
            return this.dataAccess.queryAll(sqlAllCollections(false))
                .then((rows: any) => rows.map((row: any) => {
                    return {
                        id: row.collection_id,
                        name: row.collection_name,
                    };
                }));
        }
    }

    public createCollection(name: string): Promise<Collection> {
        return this.dataAccess.executeRun(sqlInsertCollection(name))
            .then((id: number) => {
                return {
                    id: id,
                    name: name,
                    itemCount: undefined,
                };
            });
    }

    public deleteCollection(collectionId: number): Promise<void> {
        return this.dataAccess.executeRun(sqlDeleteCollection(collectionId)).then();
    }

    public renameCollection(collectionId: number, name: string): Promise<void> {
        return this.dataAccess.executeRun(sqlUpdateCollection(collectionId, name)).then();
    }

    public copyItemToCollection(collectionId: number, itemId: number): Promise<void> {
        if (collectionId) {
            return this.dataAccess.executeRun(sqlAddItemToCollection(collectionId, itemId)).then();
        } else {
            return Promise.resolve();
        }
    }

    public moveItemsToCollection(srcCollectionId: number, tgtCollectionId: number, itemId: number): Promise<void> {
        if(tgtCollectionId) {
            return this.dataAccess.executeRun(sqlAddItemToCollection(tgtCollectionId, itemId))
                .then(() => {
                    if (srcCollectionId !== undefined) {
                        return this.dataAccess.executeRun(sqlRemoveItemFromCollection(srcCollectionId, itemId));
                    }
                })
                .then();
        } else {
            return this.dataAccess.executeRun(sqlRemoveItemFromCollection(srcCollectionId, itemId)).then();
        }
    }

}