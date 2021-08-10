import {DbAccess} from "../../persistence/dbAcces";
import {SQL} from "../../persistence/sqlHandler";
import {Item, rowToItem} from "./itemCommon";

/**
 * Get the item with the given id
 */
export class ActionGetItemById {

	private readonly dbAccess: DbAccess;


	constructor(dbAccess: DbAccess) {
		this.dbAccess = dbAccess;
	}

	public perform(itemId: number): Promise<Item | null> {
		return this.query(itemId).then(rowToItem);
	}


	private query(itemId: number): Promise<any | null> {
		return this.dbAccess.querySingle(SQL.queryItemById(itemId));
	}


}