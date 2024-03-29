import {ActionGetCollectionById} from "./actionGetCollectionById";
import {voidThen} from "../../../common/utils";
import {Collection} from "./collectionCommons";
import {DataRepository} from "../dataRepository";

interface MoveCollections {
	src: Collection | null,
	tgt: Collection | null
}

/**
 * Moves or copies the given items from the given source collection to the given target collection
 */
export class ActionMoveItems {

	private readonly repository: DataRepository;
	private readonly actionGetById: ActionGetCollectionById;


	constructor(repository: DataRepository, actionGetById: ActionGetCollectionById) {
		this.repository = repository;
		this.actionGetById = actionGetById;
	}


	public perform(sourceCollectionId: number, targetCollectionId: number, itemIds: number[], copy: boolean): Promise<void> {
		if (sourceCollectionId === targetCollectionId) {
			return Promise.resolve();
		} else {
			return this.findCollections(sourceCollectionId, targetCollectionId)
				.then(this.validate)
				.then((mc: MoveCollections) => this.copyOrMove(mc, itemIds, copy))
				.then(voidThen);
		}
	}


	private findCollections(sourceCollectionId: number, targetCollectionId: number): Promise<MoveCollections> {
		return Promise.all([
			this.actionGetById.perform(sourceCollectionId),
			this.actionGetById.perform(targetCollectionId)
		])
			.then((result: Collection[]) => ({
				src: result[0],
				tgt: result[1]
			}));
	}


	private validate(collections: MoveCollections): MoveCollections {
		if (!collections.src) {
			throw "Can not move/copy items: source collection not found!";
		}
		if (!collections.tgt) {
			throw "Can not move/copy items: target collection not found!";
		}
		if (collections.tgt.type === "smart") {
			throw "Can not move/copy items: target collection is a Smart-Collection!";
		}
		return collections;
	}


	private copyOrMove(collections: MoveCollections, itemIds: number[], copy: boolean): Promise<any> {
		return copy
			? this.copy(collections, itemIds)
			: this.move(collections, itemIds);
	}


	private copy(collections: MoveCollections, itemIds: number[]): Promise<any> {
		return this.repository.relateItemsToCollection(collections.tgt.id, itemIds)
	}


	private move(collections: MoveCollections, itemIds: number[]): Promise<any> {
		return this.repository.relateItemsToCollectionUnique(collections.src.id, collections.tgt.id, itemIds)
	}

}
