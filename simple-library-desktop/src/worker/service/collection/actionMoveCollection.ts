import {DataRepository} from "../dataRepository";

/**
 * Moves the collection with the given id into the given parent-group
 */
export class ActionMoveCollection {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(collectionId: number, targetGroupId: number | null): Promise<void> {
		return this.repository.updateCollectionParent(collectionId, targetGroupId)
	}

}
