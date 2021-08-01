import {CollectionCommons} from "./collectionCommons";
import {DbAccess} from "../../persistence/dbAcces";
import {SQL} from "../../persistence/sqlHandler";
import Collection = CollectionCommons.Collection;
import rowToCollection = CollectionCommons.rowToCollection;

/**
 * Find a collection by the given id.
 */
export class ActionGetCollectionById {

	private readonly dbAccess: DbAccess;

	constructor(dbAccess: DbAccess) {
		this.dbAccess = dbAccess;
	}


	public perform(collectionId: number): Promise<Collection | null> {
		return this.query(collectionId).then(rowToCollection);
	}

	private query(collectionId: number): Promise<any | null> {
		return this.dbAccess.querySingle(SQL.queryCollectionById(collectionId));
	}

}