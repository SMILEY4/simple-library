import {DbAccess} from "../../persistence/dbAcces";
import {ActionGetCollectionById} from "./actionGetCollectionById";
import {CollectionCommons} from "./collectionCommons";
import {voidThen} from "../../../common/AsyncCommon";
import {SQL} from "../../persistence/sqlHandler";
import Collection = CollectionCommons.Collection;
import CollectionType = CollectionCommons.CollectionType;

/**
 * Edits the collection with the given id, i.e. sets the name and smart-query
 */
export class ActionEditCollection {

	private readonly dbAccess: DbAccess;
	private readonly actionGetById: ActionGetCollectionById;

	constructor(dbAccess: DbAccess, actionGetById: ActionGetCollectionById) {
		this.dbAccess = dbAccess;
		this.actionGetById = actionGetById;
	}

	public perform(collectionId: number, newName: string, newSmartQuery: string | null): Promise<void> {
		return this.find(collectionId)
			.then(collection => this.validateExists(collection))
			.then(collection => this.validateEdit(collection, newSmartQuery))
			.then(collection => this.editCollection(collection, newName, newSmartQuery))
			.then(voidThen);
	}


	private find(collectionId: number): Promise<Collection | null> {
		return this.actionGetById.perform(collectionId);
	}

	private validateExists(collection: Collection | null): Collection {
		if (!collection) {
			throw "Collection not found.";
		} else {
			return collection;
		}
	}

	private validateEdit(collection: Collection, newSmartQuery: string | null): Collection | Promise<Collection> {
		if (collection.type === CollectionType.SMART && newSmartQuery && newSmartQuery.trim().length > 0) {
			return this.testExecSmartQuery(newSmartQuery)
				.then(() => collection)
				.catch(() => Promise.reject("Invalid custom query: " + newSmartQuery.trim()));
		} else {
			return collection;
		}
	}

	private testExecSmartQuery(query: string): Promise<any | null> {
		return this.dbAccess.querySingle(SQL.queryItemsByCustomQuery(query));
	}

	private editCollection(collection: Collection, newName: string, newSmartQuery: string | null): Promise<any> {
		switch (collection.type) {
			case CollectionCommons.CollectionType.NORMAL:
				return this.editNormalCollection(collection, newName);
			case CollectionCommons.CollectionType.SMART:
				return this.editSmartCollection(collection, newName, newSmartQuery);
		}
	}

	private editNormalCollection(collection: Collection, newName: string): Promise<any> {
		return this.dbAccess.run(SQL.updateCollectionName(collection.id, newName));
	}

	private editSmartCollection(collection: Collection, newName: string, newSmartQuery: string): Promise<any> {
		return this.dbAccess.runMultiple([
			SQL.updateCollectionName(collection.id, newName),
			SQL.updateCollectionSmartQuery(collection.id, newSmartQuery)
		]);
	}

}