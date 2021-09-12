import {Collection, CollectionType} from "./collectionCommons";
import {DataRepository} from "../dataRepository";

/**
 * Creates a new collection.
 */
export class ActionCreateCollection {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
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
			return this.repository.getItemsByCustomQuery(query, []);
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
		return this.repository.insertCollection(collection.name, collection.type, collection.groupId, collection.smartQuery);
	}

	private appendId(collection: Collection, id: number | null): Collection {
		collection.id = id;
		return collection;
	}

}
