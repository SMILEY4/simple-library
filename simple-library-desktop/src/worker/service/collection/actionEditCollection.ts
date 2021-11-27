import {ActionGetCollectionById} from "./actionGetCollectionById";
import {Collection} from "./collectionCommons";
import {voidThen} from "../../../common/utils";
import {DataRepository} from "../dataRepository";

/**
 * Edits the collection with the given id, i.e. sets the name and smart-query
 */
export class ActionEditCollection {

	private readonly repository: DataRepository;
	private readonly actionGetById: ActionGetCollectionById;

	constructor(repository: DataRepository, actionGetById: ActionGetCollectionById) {
		this.repository = repository;
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
		if (collection.type === "smart" && newSmartQuery && newSmartQuery.trim().length > 0) {
			return this.testExecSmartQuery(newSmartQuery)
				.then(() => collection)
				.catch(() => Promise.reject("Invalid custom query: " + newSmartQuery.trim()));
		} else {
			return collection;
		}
	}

	private testExecSmartQuery(query: string): Promise<any | null> {
		return this.repository.getItemByCustomQuery(query)
	}

	private editCollection(collection: Collection, newName: string, newSmartQuery: string | null): Promise<any> {
		switch (collection.type) {
			case "normal":
				return this.editNormalCollection(collection, newName);
			case "smart":
				return this.editSmartCollection(collection, newName, newSmartQuery);
		}
	}

	private editNormalCollection(collection: Collection, newName: string): Promise<any> {
		return this.repository.updateCollectionName(collection.id, newName);
	}

	private editSmartCollection(collection: Collection, newName: string, newSmartQuery: string): Promise<any> {
		return this.repository.updateCollectionNameAndQuery(collection.id, newName, newSmartQuery)
	}

}
