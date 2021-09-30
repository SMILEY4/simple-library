import {
    CommandResultMany,
    CommandResultSingle,
    DataRepository,
    QueryResultMany,
    QueryResultSingle,
    VoidResult
} from "../service/dataRepository";
import {DbAccess} from "./dbAcces";
import {SQL} from "./sqlHandler";
import {voidThen} from "../../common/utils";

export class SQLiteDataRepository implements DataRepository {

    private readonly dbAccess: DbAccess;

    constructor(dbAccess: DbAccess) {
        this.dbAccess = dbAccess;
    }

    open(filepath: string, create: boolean): Promise<void> {
        return this.dbAccess.setDatabasePath(filepath, true);
    }

    close(): void {
        this.dbAccess.clearDatabasePath();
    }

    init(name: string, createDefaultCollection: boolean): Promise<any> {
        const queries = SQL.initializeNewLibrary(name, Date.now());
        if (createDefaultCollection) {
            queries.push(SQL.insertCollection("All Items", "smart", null, null));
        }
        return this.dbAccess.runMultipleSeq(queries);
    }

    getLibraryInfo(): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryLibraryInfo());
    }

    updateLibraryLastOpened(timestamp: number): CommandResultSingle {
        return this.dbAccess.run(SQL.updateLibraryInfoTimestampLastOpened(timestamp));
    }

    getItemById(itemId: number): QueryResultSingle {
        return this.dbAccess.querySingle(SQL.queryItemById(itemId));
    }

    getItemsByIds(itemIds: number[]): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryItemsByIds(itemIds));
    }

    getItemsAll(attributeKeys: string[]): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryItemsAll(attributeKeys));
    }

    getItemsByCollection(collectionId: number, attributeKeys: string[]): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryItemsByCollection(collectionId, attributeKeys));
    }

    getItemsByCustomQuery(query: string, attributeKeys: string[]): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryItemsByCustomQuery(query, attributeKeys));
    }

    getItemByCustomQuery(query: string, attributeKeys: string[]): QueryResultSingle {
        return this.dbAccess.querySingle(SQL.queryItemsByCustomQuery(query));
    }

    getItemCountTotal(): QueryResultSingle {
        return this.dbAccess.querySingle(SQL.queryItemCountTotal());
    }

    getItemCountByCustomQuery(query: string): QueryResultSingle {
        return this.dbAccess.querySingle(SQL.queryItemCountByQuery(query));
    }

    insertItem(filepath: string, timestamp: number, hash: string, thumbnail: string): CommandResultSingle {
        return this.dbAccess.run(SQL.insertItem(filepath, timestamp, hash, thumbnail));
    }

    deleteItems(itemIds: number[]): VoidResult {
        return this.dbAccess.runMultiple([
            SQL.deleteItems(itemIds),
            SQL.deleteItemsFromCollections(itemIds)
        ]).then(voidThen);
    }

    getItemAttribute(itemId: number, attributeKey: string): QueryResultSingle {
        return this.dbAccess.querySingle(SQL.queryItemAttribute(itemId, attributeKey));
    }

    getItemAttributesByItem(itemId: number): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryItemAttributes(itemId));
    }

    getAllExtendedItemAttributes(onlyModified: boolean): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(onlyModified));
    }

    getExtendedItemAttributesByItemIds(itemIds: number[], onlyModified: boolean): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryExtendedItemAttributesByItemIds(itemIds, onlyModified));
    }

    insertItemAttributes(itemId: number, attributes: { key: string; value: string; type: string }[]): CommandResultSingle {
        return this.dbAccess.run(SQL.insertItemAttributes(itemId, attributes));
    }

    updateItemAttributeValue(itemId: number, attributeKey: string, newValue: string): CommandResultSingle {
        return this.dbAccess.run(SQL.updateItemAttribute(itemId, attributeKey, newValue));
    }

    public clearItemAttributeModifiedFlag(itemId: number, attributeKey: string): CommandResultSingle {
        return this.dbAccess.run(SQL.updateItemAttributeClearModified(itemId, attributeKey));
    }

    public deleteItemAttribute(itemId: number, attributeKey: string): VoidResult {
        return this.dbAccess.run(SQL.deleteItemAttribute(itemId, attributeKey)).then(voidThen);
    }

    relateItemsToCollection(collectionId: number, itemIds: number[]): CommandResultSingle {
        return this.dbAccess.run(SQL.insertItemsIntoCollection(collectionId, itemIds));
    }

    relateItemsToCollectionUnique(srcCollectionId: number, tgtCollectionId: number, itemIds: number[]): CommandResultMany {
        return this.dbAccess.runMultiple([
            SQL.updateRemoveItemsFromCollection(srcCollectionId, itemIds),
            SQL.insertItemsIntoCollection(tgtCollectionId, itemIds)
        ]);
    }

    separateItemsFromCollection(collectionId: number, itemIds: number[]): CommandResultSingle {
        return this.dbAccess.run(SQL.updateRemoveItemsFromCollection(collectionId, itemIds));
    }

    getCollectionById(collectionId: number): QueryResultSingle {
        return this.dbAccess.querySingle(SQL.queryCollectionById(collectionId));
    }

    getAllCollections(): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryAllCollections());
    }

    getAllCollectionsWithItemCounts(): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryAllCollectionsWithItemCount());
    }

    insertCollection(name: string, type: string, groupId: number | null, query: string | null): CommandResultSingle {
        return this.dbAccess.run(SQL.insertCollection(name, type, groupId, query));
    }

    deleteCollection(collectionId: number): VoidResult {
        return this.dbAccess.run(SQL.deleteCollection(collectionId)).then(voidThen);
    }

    updateCollectionName(collectionId: number, newName: string): CommandResultSingle {
        return this.dbAccess.run(SQL.updateCollectionName(collectionId, newName));
    }

    updateCollectionNameAndQuery(collectionId: number, newName: string, newSmartQuery: string | null): CommandResultMany {
        return this.dbAccess.runMultiple([
            SQL.updateCollectionName(collectionId, newName),
            SQL.updateCollectionSmartQuery(collectionId, newSmartQuery)
        ]);
    }

    updateCollectionParent(collectionId: number, newParentGroupId: number | null): VoidResult {
        return this.dbAccess.run(SQL.updateCollectionParent(collectionId, newParentGroupId)).then(voidThen);
    }

    updateCollectionParents(prevParentGroupId: number | null, newParentGroupId: number | null): VoidResult {
        return this.dbAccess.run(SQL.updateCollectionParents(prevParentGroupId, newParentGroupId)).then(voidThen);
    }

    getAllGroups(): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryAllGroups());
    }

    getGroupById(groupId: number): QueryResultSingle {
        return this.dbAccess.querySingle(SQL.queryGroupById(groupId));
    }

    insertGroup(name: string, parentGroupId: number | null): CommandResultSingle {
        return this.dbAccess.run(SQL.insertGroup(name, parentGroupId));
    }

    deleteGroup(groupId: number): VoidResult {
        return this.dbAccess.run(SQL.deleteGroup(groupId)).then(voidThen);
    }

    updateGroupName(groupId: number, newName: string): CommandResultSingle {
        return this.dbAccess.run(SQL.updateGroupName(groupId, newName));
    }

    updateGroupParents(prevParentGroupId: number | null, newParentGroupId: number | null): VoidResult {
        return this.dbAccess.run(SQL.updateGroupParents(prevParentGroupId, newParentGroupId)).then(voidThen);
    }

    updateGroupParent(groupId: number, newParentGroupId: number | null): VoidResult {
        return this.dbAccess.run(SQL.updateGroupParent(groupId, newParentGroupId)).then(voidThen);
    }

}
