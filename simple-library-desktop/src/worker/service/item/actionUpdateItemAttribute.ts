import {Attribute, AttributeKey, packAttributeKey, rowToAttribute} from "./itemCommon";
import {DataRepository} from "../dataRepository";

/**
 * Updates the existing attribute of the given item to the given value
 */
export class ActionUpdateItemAttribute {

	private readonly repository: DataRepository;


	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(itemId: number, attributeKey: AttributeKey, newValue: string): Promise<Attribute> {
		return this.findAttribute(itemId, attributeKey)
			.then((attrib: Attribute) => this.update(attrib, itemId, attributeKey, newValue))
			.then((attrib: Attribute) => this.buildUpdatedAttribute(attrib, newValue));
	}


	private findAttribute(itemId: number, attributeKey: AttributeKey): Promise<Attribute> {
		return this.repository.getItemAttribute(itemId, packAttributeKey(attributeKey))
			.then((row: any | null) => {
					return row
						? rowToAttribute(row)
						: Promise.reject("No attribute with key " + attributeKey + " found for item with id " + itemId);
				}
			);
	}


	private update(attribute: Attribute, itemId: number, attributeKey: AttributeKey, newValue: string): Promise<Attribute> {
		return this.repository.updateItemAttributeValue(itemId, packAttributeKey(attributeKey), "" + newValue)
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
