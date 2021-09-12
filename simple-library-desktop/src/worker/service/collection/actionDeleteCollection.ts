import {DataRepository} from "../dataRepository";

/**
 * Delete the collection with the given id
 */
export class ActionDeleteCollection {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(collectionId: number): Promise<void> {
		return this.repository.deleteCollection(collectionId)
	}

}
