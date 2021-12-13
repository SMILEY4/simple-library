import {DataRepository} from "../dataRepository";
import {AttributeMeta, rowsToAttributeMeta} from "./libraryCommons";
import {AttributeKey} from "../item/itemCommon";
import {voidThen} from "../../../common/utils";
import {ArrayUtils} from "../../../common/arrayUtils";

/**
 * Create custom attribute metadata
 */
export class ActionDeleteCustomAttributeMeta {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(attributeIds: number[]): Promise<void> {
		console.log("DELETE", attributeIds)
		return this.repository.deleteCustomAttributeMeta(attributeIds)
			.then(voidThen)
	}


}
