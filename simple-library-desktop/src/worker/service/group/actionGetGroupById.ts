import {Group, rowToMinGroup} from "./groupCommons";
import {DataRepository} from "../dataRepository";


/**
 * Get a group by the given group-id (without its collections and child-groups)
 */
export class ActionGetGroupById {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(groupId: number): Promise<Group | null> {
		return this.query(groupId).then(rowToMinGroup);
	}


	private query(groupId: number): Promise<any | null> {
		return this.repository.getGroupById(groupId)
	}

}
