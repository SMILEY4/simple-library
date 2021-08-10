import {Collection, CollectionType} from "./collectionCommons";
import {DbAccess} from "../../persistence/dbAcces";
import {SQL} from "../../persistence/sqlHandler";

/**
 * Creates a new collection.
 */
export class ActionCreateCollection {

	private readonly dbAccess: DbAccess;

	constructor(dbAccess: DbAccess) {
		this.dbAccess = dbAccess;
	}

	public perform(type: CollectionType, name: string, parentGroupId: number | null, smartQuery: string | null): Promise<Collection> {
		switch (type) {
			case "normal":
				return this.createNormal(name, parentGroupId);
			case "smart":
				return this.createSmart(name, parentGroupId, smartQuery);
		}
	}

	private createNormal(name: string, parentGroupId: number | null): Promise<Collection> {
		const collection: Collection = this.buildCollection("normal", name, parentGroupId, null);
		return this.insert(collection)
			.then((id: number | null) => this.appendId(collection, id));
	}

	private createSmart(name: string, parentGroupId: number | null, smartQuery: string | null): Promise<Collection> {
		const collection: Collection = this.buildCollection("smart", name, parentGroupId, smartQuery);
		return this.validateQuery(smartQuery)
			.then(() => this.insert(collection))
			.then((id: number | null) => this.appendId(collection, id));
	}

	private validateQuery(query: string | null): Promise<any> {
		if (!query || query.trim().length === 0) {
			return Promise.resolve();
		} else {
			return this.dbAccess.querySingle(SQL.queryItemsByCustomQuery(query, []));
		}
	}

	private buildCollection(type: CollectionType, name: string, parentGroupId: number | null, smartQuery: string | null): Collection {
		return {
			type: type,
			name: name.trim(),
			groupId: parentGroupId,
			smartQuery: smartQuery ? smartQuery.trim() : null,
			itemCount: null,
			id: undefined
		};
	}

	private insert(collection: Collection): Promise<number | null> {
		return this.dbAccess.run(SQL.insertCollection(collection.name, collection.type, collection.groupId, collection.smartQuery));
	}

	private appendId(collection: Collection, id: number | null): Collection {
		collection.id = id;
		return collection;
	}


}