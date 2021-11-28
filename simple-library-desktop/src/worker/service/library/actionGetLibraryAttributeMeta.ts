import {DataRepository} from "../dataRepository";
import {AttributeMeta, rowsToAttributeMeta} from "./libraryCommons";

/**
 * Get metadata about all available attributes
 */
export class ActionGetLibraryAttributeMeta {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(nameFilter: string | null): Promise<AttributeMeta[]> {
		return this.repository.queryAttributeMetaAllFilterName(nameFilter)
			.then(rowsToAttributeMeta);
	}

}
