import {voidThen} from "../../../common/utils";
import {DataRepository} from "../dataRepository";

/**
 * Moves all child collections of the given parent-group into the new group
 */
export class ActionMoveAllCollections {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(prevParentGroupId: number | null, newParentGroupId: number | null): Promise<void> {
		return this.repository.updateCollectionParents(prevParentGroupId, newParentGroupId).then(voidThen);
	}

}
