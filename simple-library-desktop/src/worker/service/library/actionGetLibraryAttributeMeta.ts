import {AttributeMeta, rowsToAttributeMetas} from "./libraryCommons";
import {DataRepository} from "../dataRepository";

/**
 * Get metadata about all available attributes
 */
export class ActionGetLibraryAttributeMeta {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(filter: string | null): Promise<AttributeMeta[]> {
		return this.repository.queryAttributeMetaAll(filter)
			.then(rowsToAttributeMetas);
	}

}
