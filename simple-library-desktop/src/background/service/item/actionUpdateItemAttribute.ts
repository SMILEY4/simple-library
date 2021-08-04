import {DbAccess} from "../../persistence/dbAcces";
import {SQL} from "../../persistence/sqlHandler";
import {ItemCommon} from "./itemCommon";
import Attribute = ItemCommon.Attribute;
import rowToAttribute = ItemCommon.rowToAttribute;

/**
 * Updates the existing attribute of the given item to the given value
 */
export class ActionUpdateItemAttribute {

	private readonly dbAccess: DbAccess;


	constructor(dbAccess: DbAccess) {
		this.dbAccess = dbAccess;
	}

	public perform(itemId: number, attributeKey: string, newValue: string): Promise<Attribute> {
		return this.findAttribute(itemId, attributeKey)
			.then((attrib: Attribute) => this.update(attrib, itemId, attributeKey, newValue))
			.then((attrib: Attribute) => this.buildUpdatedAttribute(attrib, newValue));
	}


	private findAttribute(itemId: number, attributeKey: string): Promise<Attribute> {
		return this.dbAccess.querySingle(SQL.queryItemAttribute(itemId, attributeKey))
			.then((row: any | null) => row
				? rowToAttribute(row)
				: Promise.reject("No attribute with key " + attributeKey + " found for item with id " + itemId)
			);
	}


	private update(attribute: Attribute, itemId: number, attributeKey: string, newValue: string): Promise<Attribute> {
		return this.dbAccess.run(SQL.updateItemAttribute(itemId, attributeKey, newValue))
			.then(() => attribute);
	}


	private buildUpdatedAttribute(attribute: Attribute, newValue: string): Attribute {
		return {
			key: attribute.key,
			value: newValue,
			type: attribute.type
		};
	}

}