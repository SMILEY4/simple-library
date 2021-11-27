import {Attribute, rowToAttribute} from "./itemCommon";
import {DataRepository} from "../dataRepository";

/**
 * Updates the existing attribute of the given item to the given value
 */
export class ActionUpdateItemAttribute {

	private readonly repository: DataRepository;


	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(itemId: number, attributeId: number, newValue: string): Promise<Attribute> {
		return this.findAttribute(itemId, attributeId)
			.then((attrib: Attribute) => this.update(attrib, itemId, attributeId, newValue))
			.then((attrib: Attribute) => this.buildUpdatedAttribute(attrib, newValue));
	}


	private findAttribute(itemId: number, attributeId: number): Promise<Attribute> {
		return this.repository.getItemAttribute(itemId, attributeId)
			.then((row: any | null) => {
					return row
						? rowToAttribute(row)
						: Promise.reject("No attribute with id " + attributeId + " found for item with id " + itemId);
				}
			);
	}


	private update(attribute: Attribute, itemId: number, attributeId: number, newValue: string): Promise<Attribute> {
		return this.repository.updateItemAttributeValue(itemId, attributeId, "" + newValue)
			.then(() => attribute);
	}


	private buildUpdatedAttribute(attribute: Attribute, newValue: string): Attribute {
		return {
			...attribute,
			value: newValue,
			modified: true
		};
	}

}
