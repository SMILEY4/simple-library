import {DataRepository} from "../dataRepository";
import {DefaultAttributeValueEntry, rowsToDefaultAttributeValueEntry} from "./libraryCommons";

/**
 * Get configured default values for attributes
 */
export class ActionGetDefaultAttributeValues {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(): Promise<DefaultAttributeValueEntry[]> {
		return this.repository.getDefaultAttributeValues()
			.then(rowsToDefaultAttributeValueEntry);
	}

}
