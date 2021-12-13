import {DataRepository} from "../dataRepository";
import {AttributeMeta, rowsToAttributeMeta} from "./libraryCommons";

/**
 * Get metadata about all custom attributes
 */
export class ActionGetCustomAttributeMeta {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(): Promise<AttributeMeta[]> {
		return this.repository.queryAttributeMetaCustom()
			.then(rowsToAttributeMeta);
	}

}
