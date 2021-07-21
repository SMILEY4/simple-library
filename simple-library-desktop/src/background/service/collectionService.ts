import {DbAccess} from "../persistence/dbAcces";
import {SQL} from "../persistence/sqlHandler";
import {startAsyncWithValue} from "../../common/AsyncCommon";

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
	 * Get all collection, optionally with item count
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
	 * Moves all child collections of the given parent-group into the new group
	 */
	public moveAllOfParent(prevParentGroupId: number | null, newParentGroupId: number | null): Promise<void> {
		return this.dbAccess.run(SQL.updateCollectionParents(prevParentGroupId, newParentGroupId)).then();
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
			return startAsyncWithValue(0);
		}
	}

	private static rowToCollection(row: any): Collection {
		return {
			id: row.collection_id,
			name: row.collection_name,
			type: row.collection_type,
			smartQuery: row.smart_query ? row.smart_query : null,
			groupId: row.group_id,
			itemCount: row.item_count ? row.item_count : null
		};
	}

}