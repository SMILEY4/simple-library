import DataAccess from './dataAccess';
import {
    sqlAddItemToCollection,
    sqlAllCollections,
    sqlAllGroups,
    sqlDeleteCollection,
    sqlDeleteCollectionItems,
    sqlInsertCollection,
    sqlRemoveItemFromCollection,
    sqlUpdateCollection,
} from './sql';
import {Collection, GroupDTO} from '../../common/commonModels';

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
                        groupId: row.parent_group_id ? row.parent_group_id : undefined
                    };
                }));
        } else {
            return this.dataAccess.queryAll(sqlAllCollections(false))
                .then((rows: any) => rows.map((row: any) => {
                    return {
                        id: row.collection_id,
                        name: row.collection_name,
                        groupId: row.parent_group_id
                    };
                }));
        }
    }

    public getGroups(): Promise<GroupDTO[]> {
        return this.dataAccess.queryAll(sqlAllGroups())
            .then((rows: any) => rows.map((row: any) => {
                return {
                    id: row.group_id,
                    name: row.name,
                    parentId: row.parent_group_id,
                };
            }));
    }

    public createCollection(name: string): Promise<Collection> {
        return this.dataAccess.executeRun(sqlInsertCollection(name))
            .then((id: number) => {
                return {
                    id: id,
                    name: name,
                    itemCount: undefined,
                    groupId: undefined
                };
            });
    }

    public deleteCollection(collectionId: number): Promise<void> {
        return this.dataAccess.executeRun(sqlDeleteCollection(collectionId))
            .then(() => this.dataAccess.executeRun(sqlDeleteCollectionItems(collectionId)))
            .then();
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
        if (tgtCollectionId) {
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
