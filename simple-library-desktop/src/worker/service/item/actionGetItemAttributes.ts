import {ActionGetItemById} from "./actionGetItemById";
import {Attribute, Item, rowToAttribute} from "./itemCommon";
import {DataRepository} from "../dataRepository";

/**
 * Get all attributes of the given item
 */
export class ActionGetItemAttributes {

	private readonly repository: DataRepository;
	private readonly actionGetById: ActionGetItemById;


	constructor(repository: DataRepository, actionGetById: ActionGetItemById) {
		this.repository = repository;
		this.actionGetById = actionGetById;
	}

	public perform(itemId: number): Promise<Attribute[]> {
		return this.findItem(itemId)
			.then(item => this.getAttributes(item));
	}


	private findItem(itemId: number): Promise<Item> {
		return this.actionGetById.perform(itemId)
			.then((item: Item | null) => item
				? item
				: Promise.reject("Item with id " + itemId + " not found"));
	}


	private getAttributes(item: Item): Promise<Attribute[]> {
		return this.repository.getItemAttributesByItem(item.id)
			.then((rows: any[]) => rows.map(row => rowToAttribute(row)));
	}

}
