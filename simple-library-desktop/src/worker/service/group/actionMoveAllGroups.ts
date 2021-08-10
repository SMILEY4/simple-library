import {DbAccess} from "../../persistence/dbAcces";
import {SQL} from "../../persistence/sqlHandler";
import {voidThen} from "../../../common/utils";

/**
 * Moves all child groups of the given parent group into the new group.
 */
export class ActionMoveAllGroups {

	private readonly dbAccess: DbAccess;

	constructor(dbAccess: DbAccess) {
		this.dbAccess = dbAccess;
	}

	public perform(prevParentGroupId: number | null, newParentGroupId: number | null): Promise<void> {
		return this.dbAccess.run(SQL.updateGroupParents(prevParentGroupId, newParentGroupId)).then(voidThen);
	}

}