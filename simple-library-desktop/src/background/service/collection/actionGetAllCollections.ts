import {CollectionCommons} from "./collectionCommons";
import {DbAccess} from "../../persistence/dbAcces";
import {SQL} from "../../persistence/sqlHandler";
import Collection = CollectionCommons.Collection;
import rowToCollection = CollectionCommons.rowToCollection;
import CollectionType = CollectionCommons.CollectionType;

/**
 * Get all collections, optionally with item count
 */
export class ActionGetAllCollections {

	private readonly dbAccess: DbAccess;

	constructor(dbAccess: DbAccess) {
		this.dbAccess = dbAccess;
	}

	public perform(includeItemCount: boolean): Promise<Collection[]> {
		if (includeItemCount) {
			return this.getAllWithCounts().then(collections => this.enrichWithFinalCounts(collections));
		} else {
			return this.getAll();
		}
	}

	private getAllWithCounts(): Promise<Collection[]> {
		return this.dbAccess.queryAll(SQL.queryAllCollectionsWithItemCount())
			.then((rows: any[]) => rows.map(rowToCollection));
	}

	private getAll(): Promise<Collection[]> {
		return this.dbAccess.queryAll(SQL.queryAllCollections())
			.then((rows: any[]) => rows.map(rowToCollection));
	}

	private async enrichWithFinalCounts(collections: Collection[]) {
		for (let i = 0; i < collections.length; i++) {
			collections[i].itemCount = await this.getFinalCount(collections[i]);
		}
		return collections;
	}

	private getFinalCount(collection: Collection): Promise<number> {
		if (collection.type === CollectionType.SMART) {
			return this.getSmartItemCount(collection);
		}
		if (collection.itemCount) {
			return Promise.resolve(collection.itemCount);
		}
		return Promise.resolve(0);
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

}