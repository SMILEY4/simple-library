import {DbAccess} from "../persistence/dbAcces";
import {SQL} from "../persistence/sqlHandler";
import {voidThen} from "../../common/AsyncCommon";

export enum CollectionType {
	NORMAL = "normal",
	SMART = "smart"
}

export interface Collection {
	id: number,
	name: string,
	type: CollectionType
	smartQuery: string | null,
	itemCount: number | null,
	groupId: number | null
}

export class CollectionService {

	private readonly dbAccess: DbAccess;

	constructor(dbAccess: DbAccess) {
		this.dbAccess = dbAccess;
	}

	/**
	 * Get all collections, optionally with item count
	 */
	public getAll(includeItemCount: boolean): Promise<Collection[]> {
		if (includeItemCount) {
			// todo: check if query with count can be optimized with https://www.sqlitetutorial.net/sqlite-case/ -> all calculations in single query
			return this.dbAccess.queryAll(SQL.queryAllCollectionsWithItemCount())
				.then((rows: any[]) => rows.map(CollectionService.rowToCollection))
				.then(async (collections: Collection[]) => {
					for (let i = 0; i < collections.length; i++) {
						if (collections[i].type === CollectionType.SMART) {
							collections[i].itemCount = await this.getSmartItemCount(collections[i]);
						} else if(!collections[i].itemCount) {
							collections[i].itemCount = 0;
						}
					}
					return collections;
				});
		} else {
			return this.dbAccess.queryAll(SQL.queryAllCollections())
				.then((rows: any[]) => rows.map(CollectionService.rowToCollection));
		}
	}

	/**
	 * Find a collection by the given id.
	 */
	public getById(collectionId: number): Promise<Collection | null> {
		return this.dbAccess.querySingle(SQL.queryCollectionById(collectionId))
			.then((row: any) => row ? CollectionService.rowToCollection(row) : null);
	}

	/**
	 * Creates a new collection.
	 */
	public create(name: string, type: CollectionType, parentGroupId: number | null, smartQuery: string): Promise<Collection> {
		switch (type) {
			case CollectionType.NORMAL: {
				return this.insertCollection(name.trim(), CollectionType.NORMAL, parentGroupId, null);
			}
			case CollectionType.SMART: {
				return this.dbAccess.querySingle(SQL.queryItemsByCustomQuery(smartQuery.trim()))
					.then(() => this.insertCollection(name.trim(), CollectionType.SMART, parentGroupId, smartQuery.trim()));
			}
		}
	}

	/**
	 * Delete the collection with the given id
	 */
	public delete(collectionId: number): Promise<void> {
		return this.dbAccess.run(SQL.deleteCollection(collectionId)).then(voidThen);
	}

	/**
	 * Edits the collection with the given id, i.e. sets the name and smart-query
	 */
	public edit(collectionId: number, newName: string, newSmartQuery: string): Promise<void> {
		return this.getById(collectionId)
			.then((collection: Collection | null) => {
				if (!collection) {
					return Promise.reject("Collection with id " + collectionId + " not found.");
				} else {
					return collection;
				}
			})
			.then((collection: Collection) => {
				if (collection.type === CollectionType.SMART && newSmartQuery && newSmartQuery.trim().length > 0) {
					return this.dbAccess.querySingle(SQL.queryItemsByCustomQuery(newSmartQuery.trim()))
						.then(() => collection)
						.catch(() => Promise.reject("Invalid custom query: " + newSmartQuery.trim()));
				} else {
					return collection;
				}
			})
			.then((collection: Collection) => {
				switch (collection.type) {
					case CollectionType.SMART: {
						return this.dbAccess.runMultiple([
							SQL.updateCollectionName(collectionId, newName),
							SQL.updateCollectionSmartQuery(collectionId, newSmartQuery)
						]).then(() => null);
					}
					case CollectionType.NORMAL: {
						return this.dbAccess.run(SQL.updateCollectionName(collectionId, newName)).then(() => null);
					}
				}
			})
			.then(voidThen);
	}

	/**
	 * Moves the collection with the given id into the given parent-group
	 */
	public move(collectionId: number, targetGroupId: number | null): Promise<void> {
		return this.dbAccess.run(SQL.updateCollectionParent(collectionId, targetGroupId)).then(voidThen);
	}

	/**
	 * Moves all child collections of the given parent-group into the new group
	 */
	public moveAllOfParent(prevParentGroupId: number | null, newParentGroupId: number | null): Promise<void> {
		return this.dbAccess.run(SQL.updateCollectionParents(prevParentGroupId, newParentGroupId)).then(voidThen);
	}

	/**
	 * Moves or copies the given items from the given source collection to the given target collection
	 */
	public moveItems(sourceCollectionId: number, targetCollectionId: number, itemIds: number[], copy: boolean): Promise<void> {
		if (sourceCollectionId === targetCollectionId) {
			return Promise.resolve();
		} else {
			return Promise.resolve()
				.then(async () => ({
					src: await this.getById(sourceCollectionId),
					tgt: await this.getById(targetCollectionId)
				}))
				.then(collections => {
					if (!collections.src) {
						throw "Can not move/copy items: source collection not found!";
					}
					if (!collections.tgt) {
						throw "Can not move/copy items: target collection not found!";
					}
					if (collections.tgt.type === CollectionType.SMART) {
						throw "Can not move/copy items: target collection is a Smart-Collection!";
					}
					return collections;
				})
				.then(() => {
					if (copy) {
						return this.dbAccess.run(SQL.insertItemsIntoCollection(targetCollectionId, itemIds));
					} else {
						return this.dbAccess.runMultiple([
							SQL.updateRemoveItemsFromCollection(sourceCollectionId, itemIds),
							SQL.insertItemsIntoCollection(targetCollectionId, itemIds)
						]).then(() => null);
					}
				})
				.then(voidThen);
		}
	}

	/**
	 * Removes the given items from the given collection
	 */
	public removeItems(collectionId: number, itemIds: number[]): Promise<void> {
		return this.getById(collectionId)
			.then((collection: Collection | null) => {
				if (!collection) {
					throw "Can not remove items: Collection with id " + collectionId + " not found!";
				} else if (collection.type === CollectionType.SMART) {
					throw "Can not remove items: Collection is Smart-Collection!";
				} else {
					return this.dbAccess.run(SQL.updateRemoveItemsFromCollection(collectionId, itemIds));
				}
			})
			.then(voidThen);
	}

	private getSmartItemCount(collection: Collection): Promise<number> {
		if (collection.type === CollectionType.SMART) {
			const smartQuery: string = collection.smartQuery;
			const sqlQuery: string = (smartQuery && smartQuery.trim().length > 0)
				? SQL.queryItemCountByQuery(smartQuery.trim())
				: SQL.queryItemCountTotal();
			return this.dbAccess.querySingle(sqlQuery)
				.then((row: any | null) => row ? row.count : 0);
		} else {
			return Promise.resolve(0);
		}
	}

	private insertCollection(name: string, type: CollectionType, parentGroupId: number | null, smartQuery: string | null): Promise<Collection> {
		return this.dbAccess.run(SQL.insertCollection(name, type, parentGroupId, smartQuery))
			.then((itemId: number | null) => ({
				id: itemId,
				name: name,
				type: type,
				smartQuery: smartQuery,
				itemCount: null,
				groupId: parentGroupId
			}));
	}

	private static rowToCollection(row: any): Collection {
		return {
			id: row.collection_id,
			name: row.collection_name,
			type: row.collection_type,
			smartQuery: (row.smart_query && row.smart_query.trim().length > 0) ? row.smart_query : null,
			groupId: row.group_id,
			itemCount: row.item_count ? row.item_count : null
		};
	}

}
