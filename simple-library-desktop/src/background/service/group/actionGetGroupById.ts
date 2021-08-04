import {DbAccess} from "../../persistence/dbAcces";
import {GroupCommons} from "./groupCommons";
import {SQL} from "../../persistence/sqlHandler";
import Group = GroupCommons.Group;
import rowToMinGroup = GroupCommons.rowToMinGroup;

/**
 * Get a group by the given group-id (without its collections and child-groups)
 */
export class ActionGetGroupById {

	private readonly dbAccess: DbAccess;

	constructor(dbAccess: DbAccess) {
		this.dbAccess = dbAccess;
	}


	public perform(groupId: number): Promise<Group | null> {
		return this.query(groupId).then(rowToMinGroup);
	}


	private query(groupId: number): Promise<any | null> {
		return this.dbAccess.querySingle(SQL.queryGroupById(groupId));
	}

}