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

	getItemsAll(attributeIds: number[], pageIndex: number, pageSize: number): QueryResultMany;

	getItemsByCollection(collectionId: number, attributeIds: number[], pageIndex: number, pageSize: number): QueryResultMany;

	getItemsByCustomQuery(query: string, attributeIds: number[], pageIndex: number, pageSize: number): QueryResultMany;

	getItemByCustomQuery(query: string): QueryResultSingle;

	getItemCountTotal(): QueryResultSingle;

	getItemCountByCustomQuery(query: string): QueryResultSingle;

	getItemCountByNormalCollection(collectionId: number): QueryResultSingle;

	insertItem(filepath: string, timestamp: number, hash: string, thumbnail: string): CommandResultSingle;

	deleteItems(itemIds: number[]): VoidResult;


	insertAttributeMeta(entries: { id: string, name: string, g0: string | undefined, g1: string | undefined, g2: string | undefined, type: string, writable: boolean, custom: boolean | undefined }[]): VoidResult;

	deleteCustomAttributeMeta(attributeIds: number[]): VoidResult;

	queryAttributeMeta(attributeIds: number[]): QueryResultMany;

	queryAttributeMetaAllFilterName(filter: string | null): QueryResultMany;

	queryAttributeMetaByKeys(keys: ({ id: string, name: string, g0: string, g1: string, g2: string })[]): QueryResultMany;

	queryAttributeMetaCustom(): QueryResultMany;

	getHiddenAttributes(): QueryResultMany;

	insertHiddenAttributes(attributeIds: number[]): VoidResult;

	deleteHiddenAttribute(attributeId: number): VoidResult;

	getDefaultAttributeValues(): QueryResultMany;

	insertDefaultAttributeValues(defaultValues: ({ attId: number, value: string, allowOverwrite: boolean })[]): VoidResult;

	deleteAllDefaultAttributeValues(): VoidResult;

	getItemListAttributes(): QueryResultMany;

	insertItemListAttributes(attributeIds: number[]): VoidResult;

	deleteAllItemListAttributes(): VoidResult;

	getAllExtendedBaseItemAttributesNotHidden(onlyModified: boolean): QueryResultMany;

	getExtendedBaseItemAttributesNotHiddenByItemIds(itemIds: number[], onlyModified: boolean): QueryResultMany;

	clearItemAttributeModifiedFlag(itemId: number, attributeId: number): CommandResultSingle;

	clearItemAttributeModifiedFlagsByItemIds(itemIds: number[]): CommandResultSingle;

	clearItemAttributeModifiedFlagsAll(): CommandResultSingle;

	existsItemAttribute(itemId: number, attributeId: number): QueryResultSingle;

	getItemAttribute(itemId: number, attributeId: number): QueryResultSingle;

	getItemAttributesByItem(itemId: number, includeHidden: boolean): QueryResultMany;

	insertItemAttributes(itemId: number, attributes: ({ attId: number, value: any, modified?: boolean })[]): CommandResultSingle;

	updateItemAttributeValue(itemId: number, attributeId: number, newValue: string, modified?: boolean): CommandResultSingle;

	deleteItemAttribute(itemId: number, attributeId: number): VoidResult;

	deleteItemAttributes(itemId: number): VoidResult;


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

	updateGroupParents(prevParentGroupId: number | null, newParentGroupId: number | null): VoidResult;

	updateGroupParent(groupId: number, newParentGroupId: number | null): VoidResult;

}
