import {DataRepository} from "../dataRepository";
import {AttributeMeta, rowsToAttributeMeta} from "./libraryCommons";

/**
 * Get all attributes to display for the items in the item list
 */
export class ActionGetItemListAttributes {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(): Promise<AttributeMeta[]> {
		return this.repository.getItemListAttributes()
			.then(rowsToAttributeMeta);
	}

}
