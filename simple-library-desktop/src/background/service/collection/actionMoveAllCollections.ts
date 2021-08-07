import {DbAccess} from "../../persistence/dbAcces";
import {SQL} from "../../persistence/sqlHandler";
import {voidThen} from "../../../common/utils";

/**
 * Moves all child collections of the given parent-group into the new group
 */
export class ActionMoveAllCollections {

	private readonly dbAccess: DbAccess;

	constructor(dbAccess: DbAccess) {
		this.dbAccess = dbAccess;
	}

	public perform(prevParentGroupId: number | null, newParentGroupId: number | null): Promise<void> {
		return this.dbAccess.run(SQL.updateCollectionParents(prevParentGroupId, newParentGroupId)).then(voidThen);
	}

}