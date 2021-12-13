import {DataRepository} from "../dataRepository";
import {voidThen} from "../../../common/utils";

/**
 * Create custom attribute metadata
 */
export class ActionDeleteCustomAttributeMeta {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(attributeIds: number[]): Promise<void> {
		return this.deleteFromCustomAttributes(attributeIds)
			.then(() => this.deleteFromItemAttribute(attributeIds))
			.then(() => this.deleteFromHiddenAttributes(attributeIds))
			.then(() => this.deleteFromDefaultValues(attributeIds))
			.then(voidThen)
	}

	private deleteFromCustomAttributes(attributeIds: number[]) {
		return this.repository.deleteCustomAttributeMeta(attributeIds);
	}

	private deleteFromItemAttribute(attributeIds: number[]) {
		return this.repository.deleteAttributes(attributeIds);
	}

	private deleteFromHiddenAttributes(attributeIds: number[]) {
		return Promise.all(attributeIds.map(aid => this.repository.deleteHiddenAttribute(aid)))
	}

	private deleteFromDefaultValues(attributeIds: number[]) {
		return this.repository.deleteDefaultAttributeValues(attributeIds);
	}

}
