import {ActionGetGroupById} from "./actionGetGroupById";
import {ActionMoveAllCollections} from "../collection/actionMoveAllCollections";
import {ActionMoveAllGroups} from "./actionMoveAllGroups";
import {Group} from "./groupCommons";
import {DataRepository} from "../dataRepository";

/**
 * Delete the group with the given id. Optionally delete all its children and collections.
 * If not delete content => children,collections will be added to the groups parent
 */
export class ActionDeleteGroup {

	private readonly repository: DataRepository;
	private readonly actionGetById: ActionGetGroupById;
	private readonly actionMoveAllCollections: ActionMoveAllCollections;
	private readonly actionMoveAllGroups: ActionMoveAllGroups;

	constructor(
		repository: DataRepository,
		actionGetGroupById: ActionGetGroupById,
		actionMoveAllCollections: ActionMoveAllCollections,
		actionMoveAllGroups: ActionMoveAllGroups
	) {
		this.repository = repository;
		this.actionGetById = actionGetGroupById;
		this.actionMoveAllCollections = actionMoveAllCollections;
		this.actionMoveAllGroups = actionMoveAllGroups;
	}


	public perform(groupId: number, deleteContent: boolean): Promise<void> {
		return deleteContent
			? this.deleteGroup(groupId)
			: this.deleteGroupWithoutContent(groupId);
	}

	private deleteGroupWithoutContent(groupId: number): Promise<any> {
		return this.actionGetById.perform(groupId)
			.then(group => this.validateGroup(group))
			.then(group => this.moveContent(group))
			.then(() => this.deleteGroup(groupId));
	}

	private deleteGroup(groupId: number): Promise<void> {
		return this.repository.deleteGroup(groupId);
	}


	private validateGroup(group: Group | null): Group {
		if (group === null) {
			throw "Can not delete group. Group does not exist.";
		}
		return group;
	}


	private moveContent(group: Group): Promise<any> {
		const groupId: number = group.id;
		const parentId: number | null = group.parentGroupId ? group.parentGroupId : null;
		return Promise.all([
			this.actionMoveAllGroups.perform(groupId, parentId),
			this.actionMoveAllCollections.perform(groupId, parentId)
		]);
	}


}
