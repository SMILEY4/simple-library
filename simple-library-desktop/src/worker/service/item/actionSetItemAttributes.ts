import {DataRepository} from "../dataRepository";
import {Attribute} from "./itemCommon";
import {voidThen} from "../../../common/utils";

/**
 * Overwrites all attributes of the given item
 */
export class ActionSetItemAttributes {

	private readonly repository: DataRepository;


	constructor(repository: DataRepository) {
		this.repository = repository;
	}


	public perform(itemId: number, attributes: Attribute[]): Promise<void> {
		return this.deleteAll(itemId)
			.then(() => this.insertAll(itemId, attributes))
			.then(voidThen);
	}

	private deleteAll(itemId: number): Promise<any> {
		return this.repository.deleteItemAttributes(itemId);
	}

	private insertAll(itemId: number, attributes: Attribute[]): Promise<any> {
		const entries = attributes
			.filter(att => att.value !== null)
			.map(att => ({
				id: att.key.id,
				name: att.key.name,
				g0: att.key.g0,
				g1: att.key.g1,
				g2: att.key.g2,
				value: att.value,
				modified: false
			}));
		return this.repository.insertItemAttributes(itemId, entries);
	}

}
