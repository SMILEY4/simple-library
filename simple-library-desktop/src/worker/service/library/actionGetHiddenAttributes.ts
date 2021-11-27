import {DataRepository} from "../dataRepository";
import {AttributeMeta, rowsToAttributeMeta} from "./libraryCommons";

/**
 * Get all hidden attributes
 */
export class ActionGetHiddenAttributes {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(): Promise<AttributeMeta[]> {
		return this.repository.getHiddenAttributes()
			.then(rowsToAttributeMeta);
	}

}
