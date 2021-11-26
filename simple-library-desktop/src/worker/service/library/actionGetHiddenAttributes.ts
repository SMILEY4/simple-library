import {DataRepository} from "../dataRepository";
import {AttributeKey, rowsToAttributeKeys} from "../item/itemCommon";

/**
 * Get all hidden attributes
 */
export class ActionGetHiddenAttributes {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(): Promise<AttributeKey[]> {
		return this.repository.getHiddenAttributes()
			.then(rowsToAttributeKeys);
	}

}
