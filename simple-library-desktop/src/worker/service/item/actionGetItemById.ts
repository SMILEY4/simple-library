import {Item, rowToItem} from "./itemCommon";
import {DataRepository} from "../dataRepository";

/**
 * Get the item with the given id (without any attributes)
 */
export class ActionGetItemById {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}


	public perform(itemId: number): Promise<Item | null> {
		return this.query(itemId).then(rowToItem);
	}


	private query(itemId: number): Promise<any | null> {
		return this.repository.getItemById(itemId);
	}

}
