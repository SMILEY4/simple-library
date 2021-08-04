import {DbAccess} from "../../persistence/dbAcces";
import {SQL} from "../../persistence/sqlHandler";
import {ItemCommon} from "./itemCommon";
import {ActionGetItemById} from "./actionGetItemById";
import Item = ItemCommon.Item;
import Attribute = ItemCommon.Attribute;
import rowToAttribute = ItemCommon.rowToAttribute;

/**
 * Get all attributes of the given item
 */
export class ActionGetItemAttributes {

	private readonly dbAccess: DbAccess;
	private readonly actionGetById: ActionGetItemById;


	constructor(dbAccess: DbAccess, actionGetById: ActionGetItemById) {
		this.dbAccess = dbAccess;
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
		return this.dbAccess.queryAll(SQL.queryItemAttributes(item.id))
			.then((rows: any[]) => rows.map(row => rowToAttribute(row)));
	}

}