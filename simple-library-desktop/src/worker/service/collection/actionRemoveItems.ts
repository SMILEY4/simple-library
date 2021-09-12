import {ActionGetCollectionById} from "./actionGetCollectionById";
import {voidThen} from "../../../common/utils";
import {Collection} from "./collectionCommons";
import {DataRepository} from "../dataRepository";

/**
 * Removes the given items from the given collection
 */
export class ActionRemoveItems {

	private readonly repository: DataRepository;
	private readonly actionGetById: ActionGetCollectionById;

	constructor(repository: DataRepository, actionGetById: ActionGetCollectionById) {
		this.repository = repository;
		this.actionGetById = actionGetById;
	}

	public perform(collectionId: number, itemIds: number[]): Promise<void> {
		return this.findCollection(collectionId)
			.then(this.validate)
			.then((c: Collection) => this.remove(c, itemIds))
			.then(voidThen);
	}


	private findCollection(collectionId: number): Promise<Collection | null> {
		return this.actionGetById.perform(collectionId);
	}


	private validate(collection: Collection): Collection {
		if (!collection) {
			throw "Can not remove items: Collection not found!";
		} else if (collection.type === "smart") {
			throw "Can not remove items: Collection is Smart-Collection!";
		} else {
			return collection;
		}
	}


	private remove(collection: Collection, itemIds: number[]): Promise<any> {
		return this.repository.separateItemsFromCollection(collection.id, itemIds)
	}

}
