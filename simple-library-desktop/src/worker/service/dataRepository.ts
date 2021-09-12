export type QueryResultMany = Promise<any[]>
export type QueryResultSingle = Promise<any | null>
export type CommandResultMany = Promise<(number | null)[]>
export type CommandResultSingle = Promise<number | null>
export type VoidResult = Promise<void>


export interface DataRepository {

    open(filepath: string, create: boolean): Promise<void>;

    close(): void;

    init(name: string, createDefaultCollection: boolean): Promise<any>;

    getLibraryInfo(): QueryResultMany;

    updateLibraryLastOpened(timestamp: number): CommandResultSingle;

    getItemById(itemId: number): QueryResultSingle;

    getItemsByIds(itemIds: number[]): QueryResultMany;

    getItemsAll(attributeKeys: string[]): QueryResultMany;

    getItemsByCollection(collectionId: number, attributeKeys: string[]): QueryResultMany;

    getItemsByCustomQuery(query: string, attributeKeys: string[]): QueryResultMany;

    getItemByCustomQuery(query: string, attributeKeys: string[]): QueryResultSingle;

    getItemCountTotal(): QueryResultSingle;

    getItemCountByCustomQuery(query: string): QueryResultSingle;

    insertItem(filepath: string, timestamp: number, hash: string, thumbnail: string): CommandResultSingle;

    deleteItems(itemIds: number[]): VoidResult;


    getItemAttribute(itemId: number, attributeKey: string): QueryResultSingle;

    getItemAttributesByItem(itemId: number): QueryResultMany;

    insertItemAttributes(itemId: number, attributes: ({ key: string, value: string, type: string })[]): CommandResultSingle;

    updateItemAttributeValue(itemId: number, attributeKey: string, newValue: string): CommandResultSingle


    relateItemsToCollection(collectionId: number, itemIds: number[]): CommandResultSingle;

    relateItemsToCollectionUnique(srcCollectionId: number, tgtCollectionId: number, itemIds: number[]): CommandResultMany;

    separateItemsFromCollection(collectionId: number, itemIds: number[]): CommandResultSingle;



    getCollectionById(collectionId: number): QueryResultSingle;

    getAllCollections(): QueryResultMany;

    getAllCollectionsWithItemCounts(): QueryResultMany;

    insertCollection(name: string, type: string, groupId: number | null, query: string | null): CommandResultSingle;

    deleteCollection(collectionId: number): VoidResult;

    updateCollectionName(collectionId: number, newName: string): CommandResultSingle;

    updateCollectionNameAndQuery(collectionId: number, newName: string, newSmartQuery: string | null): CommandResultMany;

    updateCollectionParent(collectionId: number, newParentGroupId: number | null): VoidResult;

    updateCollectionParents(prevParentGroupId: number | null, newParentGroupId: number | null): VoidResult;



    getAllGroups(): QueryResultMany;

    getGroupById(groupId: number): QueryResultSingle;

    insertGroup(name: string, parentGroupId: number | null): CommandResultSingle;

    deleteGroup(groupId: number): VoidResult;

    updateGroupName(groupId: number, newName: string): CommandResultSingle;

    updateGroupParents(prevParentGroupId: number | null, newParentGroupId: number | null): VoidResult

    updateGroupParent(groupId: number, newParentGroupId: number | null): VoidResult;

}
