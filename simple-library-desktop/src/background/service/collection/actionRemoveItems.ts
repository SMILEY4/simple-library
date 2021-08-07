import {DbAccess} from "../../persistence/dbAcces";
import {ActionGetCollectionById} from "./actionGetCollectionById";
import {voidThen} from "../../../common/utils";
import {SQL} from "../../persistence/sqlHandler";
import {Collection, CollectionType} from "./collectionCommons";

/**
 * Removes the given items from the given collection
 */
export class ActionRemoveItems {

	private readonly dbAccess: DbAccess;
	private readonly actionGetById: ActionGetCollectionById;

	constructor(dbAccess: DbAccess, actionGetById: ActionGetCollectionById) {
		this.dbAccess = dbAccess;
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
		return this.dbAccess.run(SQL.updateRemoveItemsFromCollection(collection.id, itemIds));
	}

}