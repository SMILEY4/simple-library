import {DbAccess} from "../../persistence/dbAcces";
import {SQL} from "../../persistence/sqlHandler";
import {voidThen} from "../../../common/utils";

/**
 * Moves the collection with the given id into the given parent-group
 */
export class ActionMoveCollection {

	private readonly dbAccess: DbAccess;

	constructor(dbAccess: DbAccess) {
		this.dbAccess = dbAccess;
	}

	public perform(collectionId: number, targetGroupId: number | null): Promise<void> {
		return this.dbAccess.run(SQL.updateCollectionParent(collectionId, targetGroupId)).then(voidThen);
	}

}