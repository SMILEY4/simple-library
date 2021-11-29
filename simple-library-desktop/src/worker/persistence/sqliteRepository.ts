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

    getItemsAll(attributeIds: number[], pageIndex: number, pageSize: number): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryItemsAll(attributeIds, pageIndex, pageSize));
    }

    getItemsByCollection(collectionId: number, attributeIds: number[], pageIndex: number, pageSize: number): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryItemsByCollection(collectionId, attributeIds, pageIndex, pageSize));
    }

    getItemsByCustomQuery(query: string, attributeIds: number[], pageIndex: number, pageSize: number): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryItemsByCustomQuery(query, pageIndex, pageSize, attributeIds));
    }

    getItemByCustomQuery(query: string): QueryResultSingle {
        return this.dbAccess.querySingle(SQL.queryItemsByCustomQuery(query, 0, 1));
    }

    getItemCountTotal(): QueryResultSingle {
        return this.dbAccess.querySingle(SQL.queryItemCountTotal());
    }

    getItemCountByCustomQuery(query: string): QueryResultSingle {
        return this.dbAccess.querySingle(SQL.queryItemCountByQuery(query));
    }

    getItemCountByNormalCollection(collectionId: number): QueryResultSingle {
        return this.dbAccess.querySingle(SQL.queryItemCountByNormalCollection(collectionId));
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


    insertAttributeMeta(entries: { id: string, name: string, type: string, writable: boolean, g0: string | undefined, g1: string | undefined, g2: string | undefined }[]): VoidResult {
        return this.dbAccess.run(SQL.insertAttributeMeta(entries))
            .then(voidThen);
    }

    queryAttributeMeta(attributeIds: number[]): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryAttributeMeta(attributeIds));
    }

    queryAttributeMetaAllFilterName(filter: string | null): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryAttributeMetaAllFilterName(filter));
    }

    queryAttributeMetaByKeys(keys: ({ id: string, name: string, g0: string, g1: string, g2: string })[]): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryAttributeMetaByKeys(keys));
    }

    getHiddenAttributes(): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryHiddenAttributes());
    }

    insertHiddenAttributes(attributeIds: number[]): VoidResult {
        return this.dbAccess.run(SQL.insertHiddenAttributes(attributeIds))
            .then(voidThen);
    }

    deleteHiddenAttribute(attributeId: number): VoidResult {
        return this.dbAccess.run(SQL.deleteHiddenAttributes(attributeId))
            .then(voidThen);
    }

    getDefaultAttributeValues(): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryDefaultAttributeValues());
    }

    insertDefaultAttributeValues(defaultValues: ({ attId: number, value: string, allowOverwrite: boolean })[]): VoidResult {
        return this.dbAccess.run(SQL.insertDefaultAttributeValues(defaultValues))
            .then(voidThen);
    }

    deleteAllDefaultAttributeValues(): VoidResult {
        return this.dbAccess.run(SQL.deleteDefaultAttributeValues())
            .then(voidThen);
    }

    getItemListAttributes(): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryItemListAttributes());
    }

    insertItemListAttributes(attributeIds: number[]): VoidResult {
        return this.dbAccess.run(SQL.insertItemListAttributes(attributeIds))
            .then(voidThen);
    }

    deleteAllItemListAttributes(): VoidResult {
        return this.dbAccess.run(SQL.deleteAllItemListAttributes())
            .then(voidThen);
    }

    getAllExtendedItemAttributesNotHidden(onlyModified: boolean): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(onlyModified));
    }

    getExtendedItemAttributesNotHiddenByItemIds(itemIds: number[], onlyModified: boolean): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryExtendedItemAttributesByItemIds(itemIds, onlyModified));
    }

    clearItemAttributeModifiedFlag(itemId: number, attributeId: number): CommandResultSingle {
        return this.dbAccess.run(SQL.clearItemAttributeModifiedFlag(itemId, attributeId));
    }

    clearItemAttributeModifiedFlagsByItemIds(itemIds: number[]): CommandResultSingle {
        return this.dbAccess.run(SQL.clearItemAttributeModifiedFlagsByItemIds(itemIds));
    }

    clearItemAttributeModifiedFlagsAll(): CommandResultSingle {
        return this.dbAccess.run(SQL.clearItemAttributeModifiedFlagsAll());
    }

    existsItemAttribute(itemId: number, attributeId: number): QueryResultSingle {
        return this.dbAccess.querySingle(SQL.queryExistsItemAttribute(itemId, attributeId))
            .then((row: any | null) => row ? row.count > 0 : false);
    }

    getItemAttribute(itemId: number, attributeId: number): QueryResultSingle {
        return this.dbAccess.querySingle(SQL.queryItemAttribute(itemId, attributeId));
    }

    getItemAttributesByItem(itemId: number, includeHidden: boolean): QueryResultMany {
        return this.dbAccess.queryAll(SQL.queryItemAttributes(itemId, includeHidden));
    }

    insertItemAttributes(itemId: number, attributes: ({ attId: number, value: any, modified?: boolean })[]): CommandResultSingle {
        if (attributes && attributes.length > 0) {
            return this.dbAccess.run(SQL.insertItemAttributes(itemId, attributes));
        } else {
            return Promise.resolve(null);
        }
    }

    updateItemAttributeValue(itemId: number, attributeId: number, newValue: string): CommandResultSingle {
        return this.dbAccess.run(SQL.updateItemAttribute(itemId, attributeId, newValue));
    }

    deleteItemAttribute(itemId: number, attributeId: number): VoidResult {
        return this.dbAccess.run(SQL.deleteItemAttribute(itemId, attributeId)).then(voidThen);
    }

    deleteItemAttributes(itemId: number): VoidResult {
        return this.dbAccess.run(SQL.deleteItemAttributes(itemId)).then(voidThen);
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
