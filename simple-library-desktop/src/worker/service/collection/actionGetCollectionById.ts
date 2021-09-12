import {Collection, rowToCollection} from "./collectionCommons";
import {DataRepository} from "../dataRepository";

/**
 * Find a collection by the given id.
 */
export class ActionGetCollectionById {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}


	public perform(collectionId: number): Promise<Collection | null> {
		return this.query(collectionId).then(rowToCollection);
	}

	private query(collectionId: number): Promise<any | null> {
		return this.repository.getCollectionById(collectionId)
	}

}
