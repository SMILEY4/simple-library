import {DbAccess} from "../../persistence/dbAcces";
import {SQL} from "../../persistence/sqlHandler";
import {voidThen} from "../../../common/AsyncCommon";

/**
 * Complete/Permanently delete the items with the given ids.
 */
export class ActionDeleteItems {

	private readonly dbAccess: DbAccess;


	constructor(dbAccess: DbAccess) {
		this.dbAccess = dbAccess;
	}

	public perform(itemIds: number[]): Promise<void> {
		return this.dbAccess.runMultiple([
			SQL.deleteItems(itemIds),
			SQL.deleteItemsFromCollections(itemIds)
		]).then(voidThen);
	}

}