import {Group} from "./groupCommons";
import {DataRepository} from "../dataRepository";

/**
 * Create a new group with the given name and (optionally) the given parent.
 */
export class ActionCreateGroup {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}


	public perform(name: string, parentGroupId: number | null): Promise<Group> {
		return this.insert(name, parentGroupId)
			.then((id: number) => this.buildGroup(id, name, parentGroupId));
	}


	private insert(name: string, parentGroupId: number | null): Promise<number | null> {
		return this.repository.insertGroup(name, parentGroupId);
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
