import {DbAccess} from "../../persistence/dbAcces";
import {SQL} from "../../persistence/sqlHandler";
import {voidThen} from "../../../common/utils";

/**
 * Delete the collection with the given id
 */
export class ActionDeleteCollection {

	private readonly dbAccess: DbAccess;

	constructor(dbAccess: DbAccess) {
		this.dbAccess = dbAccess;
	}

	public perform(collectionId: number): Promise<void> {
		return this.dbAccess.run(SQL.deleteCollection(collectionId)).then(voidThen);
	}

}