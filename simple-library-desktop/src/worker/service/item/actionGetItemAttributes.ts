import {ActionGetItemById} from "./actionGetItemById";
import {Attribute, estimateSimpleTypeFromAttributeValue, Item, rowToAttribute} from "./itemCommon";
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


	public perform(itemId: number, includeHidden: boolean): Promise<Attribute[]> {
		return this.findItem(itemId)
			.then(item => this.getAttributes(item, includeHidden));
	}


	private findItem(itemId: number): Promise<Item> {
		return this.actionGetById.perform(itemId)
			.then((item: Item | null) => item
				? item
				: Promise.reject("Item with id " + itemId + " not found"));
	}


	private getAttributes(item: Item, includeHidden: boolean): Promise<Attribute[]> {
		return this.repository.getItemAttributesByItem(item.id, includeHidden)
			.then((rows: any[]) => rows.map(row => rowToAttribute(row)))
			.then((attribs: Attribute[]) => attribs.map(att => ({
				...att,
				type: estimateSimpleTypeFromAttributeValue(att.value)
			})));
	}

}
