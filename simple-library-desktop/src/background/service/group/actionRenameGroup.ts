import {DbAccess} from "../../persistence/dbAcces";
import {GroupCommons} from "./groupCommons";
import {ActionGetGroupById} from "./actionGetGroupById";
import {SQL} from "../../persistence/sqlHandler";
import {voidThen} from "../../../common/AsyncCommon";
import Group = GroupCommons.Group;

/**
 * Rename the group with the given id.
 */
export class ActionRenameGroup {

	private readonly dbAccess: DbAccess;
	private actionGetById: ActionGetGroupById;

	constructor(dbAccess: DbAccess, actionGetById: ActionGetGroupById) {
		this.dbAccess = dbAccess;
		this.actionGetById = actionGetById;
	}


	public perform(groupId: number, name: string): Promise<void> {
		return this.findOrThrow(groupId)
			.then((group: Group) => this.rename(group, name))
			.then(voidThen);
	}


	private findOrThrow(groupId: number): Promise<Group> {
		return this.actionGetById.perform(groupId)
			.then((group: Group | null) => {
				return group
					? group
					: Promise.reject("No group with id " + groupId + " found.");
			});
	}


	private rename(group: Group, name: string): Promise<void> {
		return name === group.name
			? Promise.resolve()
			: this.dbAccess.run(SQL.updateGroupName(group.id, name)).then(voidThen);
	}

}