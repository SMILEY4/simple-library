import {DataRepository} from "../dataRepository";
import {MiniAttribute} from "./itemCommon";
import {voidThen} from "../../../common/utils";

/**
 * Overwrites all attributes of the given item
 */
export class ActionSetItemAttributes {

	private readonly repository: DataRepository;


	constructor(repository: DataRepository) {
		this.repository = repository;
	}


	public perform(itemId: number, attributes: MiniAttribute[]): Promise<void> {
		return this.deleteAll(itemId)
			.then(() => this.insertAll(itemId, attributes))
			.then(voidThen);
	}

	private deleteAll(itemId: number): Promise<any> {
		return this.repository.deleteItemAttributes(itemId);
	}

	private insertAll(itemId: number, attributes: MiniAttribute[]): Promise<any> {
		const entries = attributes
			.filter(att => att.value !== null && att.attId !== null)
			.map(att => ({
				attId: att.attId,
				value: att.value,
				modified: false
			}));
		return this.repository.insertItemAttributes(itemId, entries);
	}


}
