import {DbAccess} from "../../persistence/dbAcces";
import {GroupCommons} from "./groupCommons";
import {SQL} from "../../persistence/sqlHandler";
import Group = GroupCommons.Group;

/**
 * Create a new group with the given name and (optionally) the given parent.
 */
export class ActionCreateGroup {

	private readonly dbAccess: DbAccess;

	constructor(dbAccess: DbAccess) {
		this.dbAccess = dbAccess;
	}


	public perform(name: string, parentGroupId: number | null): Promise<Group> {
		return this.insert(name, parentGroupId)
			.then((id: number) => this.buildGroup(id, name, parentGroupId));
	}


	private insert(name: string, parentGroupId: number | null): Promise<number | null> {
		return this.dbAccess.run(SQL.insertGroup(name, parentGroupId));
	}


	private buildGroup(id: number, name: string, parentGroupId: number | null): Group {
		return {
			id: id,
			name: name,
			parentGroupId: parentGroupId,
			collections: [],
			children: []
		};
	}

}