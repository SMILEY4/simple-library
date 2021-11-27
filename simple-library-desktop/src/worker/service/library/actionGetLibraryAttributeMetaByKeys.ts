import {DataRepository} from "../dataRepository";
import {AttributeMeta, rowsToAttributeMeta} from "./libraryCommons";
import {AttributeKey} from "../item/itemCommon";

/**
 * Get metadata about all available attributes by the given keys
 */
export class ActionGetLibraryAttributeMetaByKeys {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(attributeKeys: AttributeKey[]): Promise<AttributeMeta[]> {
		return this.repository.queryAttributeMetaByKeys(attributeKeys)
			.then(rowsToAttributeMeta);
	}

}
