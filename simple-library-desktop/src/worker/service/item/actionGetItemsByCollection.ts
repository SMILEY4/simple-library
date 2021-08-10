import {DbAccess} from "../../persistence/dbAcces";
import {SQL} from "../../persistence/sqlHandler";
import {ActionGetCollectionById} from "../collection/actionGetCollectionById";
import {Item, rowsToItems} from "./itemCommon";
import {Collection} from "../collection/collectionCommons";

/**
 * Get all items of the given collection (with the attributes of the given keys)
 */
export class ActionGetItemsByCollection {

	private readonly dbAccess: DbAccess;
	private readonly actionGetCollectionById: ActionGetCollectionById;


	constructor(dbAccess: DbAccess, actionGetCollectionById: ActionGetCollectionById) {
		this.dbAccess = dbAccess;
		this.actionGetCollectionById = actionGetCollectionById;
	}


	public perform(collectionId: number, attributeKeys: string[]): Promise<Item[]> {
		return this.findCollection(collectionId)
			.then(collection => this.getItemData(collection, attributeKeys))
			.then(rowsToItems);
	}


	private findCollection(collectionId: number): Promise<Collection> {
		return this.actionGetCollectionById.perform(collectionId)
			.then((collection: Collection | null) => !collection
				? Promise.reject("Cant fetch items: collection with id " + collectionId + " not found")
				: collection
			);
	}


	private getItemData(collection: Collection, attributeKeys: string[]): Promise<any[]> {
		switch (collection.type) {
			case "normal":
				return this.getItemDataFromNormal(collection, attributeKeys);
			case "smart":
				return this.getItemDataFromSmart(collection, attributeKeys);
			default: {
				throw "Unexpected collection type: " + collection.type;
			}
		}
	}


	private getItemDataFromNormal(collection: Collection, attributeKeys: string[]): Promise<any[]> {
		return this.dbAccess.queryAll(SQL.queryItemsByCollection(collection.id, attributeKeys));
	}


	private getItemDataFromSmart(collection: Collection, attributeKeys: string[]): Promise<any[]> {
		const fetchWithQuery = collection.smartQuery && collection.smartQuery.length > 0;
		return fetchWithQuery
			? this.dbAccess.queryAll(SQL.queryItemsByCustomQuery(collection.smartQuery, attributeKeys))
			: this.dbAccess.queryAll(SQL.queryItemsAll(attributeKeys));
	}


}