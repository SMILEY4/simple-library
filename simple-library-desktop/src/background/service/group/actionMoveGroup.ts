import {DbAccess} from "../../persistence/dbAcces";
import {ActionGetGroupById} from "./actionGetGroupById";
import {GroupCommons} from "./groupCommons";
import {SQL} from "../../persistence/sqlHandler";
import {voidThen} from "../../../common/AsyncCommon";
import Group = GroupCommons.Group;

/**
 * Move the group with the given id into the given target group.
 */
export class ActionMoveGroup {

	private readonly dbAccess: DbAccess;
	private readonly actionGetById: ActionGetGroupById;

	constructor(dbAccess: DbAccess, actionGetById: ActionGetGroupById) {
		this.dbAccess = dbAccess;
		this.actionGetById = actionGetById;
	}


	public perform(groupId: number, targetGroupId: number | null): Promise<void> {
		return this.validate(groupId, targetGroupId).then((valid: boolean) => {
			return valid
				? this.move(groupId, targetGroupId).then(voidThen)
				: Promise.reject("Group cant be moved: invalid.");
		});
	}


	private move(groupId: number, targetGroupId: number | null): Promise<void> {
		return this.dbAccess.run(SQL.updateGroupParent(groupId, targetGroupId)).then(voidThen);
	}


	private async validate(groupId: number, targetGroupId: number | null): Promise<boolean> {
		return Promise.resolve()
			.then(() => this.validateDifferentGroup(groupId, targetGroupId))
			.then(() => this.validateGroupsExist(groupId, targetGroupId))
			.then(() => this.validateDifferentSubtree(groupId, targetGroupId))
			.then(() => true)
			.catch((err) => {
				console.log("Group movement invalid: " + err);
				return false;
			});
	}


	private validateDifferentGroup(groupId: number, targetGroupId: number | null): Promise<void> {
		return groupId === targetGroupId
			? Promise.reject("group = target")
			: Promise.resolve();
	}


	private async validateGroupsExist(groupId: number, targetGroupId: number | null): Promise<void> {
		const groupExists = await this.getById(groupId) !== null;
		const targetExists = targetGroupId === null || (await this.getById(targetGroupId) !== null);
		return !groupExists || !targetExists
			? Promise.reject("group or target does not exist")
			: Promise.resolve();
	}


	private async validateDifferentSubtree(groupId: number, targetGroupId: number | null): Promise<void> {
		if (!targetGroupId) {
			return Promise.resolve();
		} else {
			const targetGroup: Group = await this.getById(targetGroupId);
			let counter: number = 0;
			let currentGroup: Group = targetGroup;
			while (currentGroup.parentGroupId !== null && currentGroup.id !== groupId && counter < 100) {
				currentGroup = await this.getById(currentGroup.parentGroupId);
				counter++;
			}
			return currentGroup.id === groupId || counter >= 100
				? Promise.reject("target in subtree of group")
				: Promise.resolve();
		}
	}


	private getById(groupId: number): Promise<Group | null> {
		return this.actionGetById.perform(groupId);
	}

}