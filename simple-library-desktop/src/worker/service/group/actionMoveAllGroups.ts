import {DataRepository} from "../dataRepository";

/**
 * Moves all child groups of the given parent group into the new group.
 */
export class ActionMoveAllGroups {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(prevParentGroupId: number | null, newParentGroupId: number | null): Promise<void> {
		return this.repository.updateGroupParents(prevParentGroupId, newParentGroupId);
	}

}
