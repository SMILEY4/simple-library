import {DataRepository} from "../dataRepository";
import {voidThen} from "../../../common/utils";
import {ArrayUtils} from "../../../common/arrayUtils";

/**
 * Set all attributes to display for the items in the item list
 */
export class ActionSetItemListAttributes {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(attributeIds: number[]): Promise<void> {
		return this.deleteAll()
			.then(() => this.insert(attributeIds))
			.then(voidThen);
	}

	private deleteAll(): Promise<any> {
		return this.repository.deleteAllItemListAttributes();
	}

	private insert(attributeIds: number[]): Promise<any> {
		if (attributeIds && attributeIds.length > 0) {
			return this.repository.insertItemListAttributes(ArrayUtils.unique(attributeIds));
		} else {
			return Promise.resolve();
		}
	}

}
