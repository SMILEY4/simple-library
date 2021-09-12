import {DbAccess} from "../../persistence/dbAcces";
import {ActionGetGroupById} from "./actionGetGroupById";
import {SQL} from "../../persistence/sqlHandler";
import {voidThen} from "../../../common/utils";
import {Group} from "./groupCommons";
import {DataRepository} from "../dataRepository";

/**
 * Rename the group with the given id.
 */
export class ActionRenameGroup {

	private readonly repository: DataRepository;
	private readonly actionGetById: ActionGetGroupById;

	constructor(repository: DataRepository, actionGetById: ActionGetGroupById) {
		this.repository = repository;
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
			: this.repository.updateGroupName(group.id, name).then(voidThen);
	}

}
