import {DbAccess} from "../../persistence/dbAcces";
import {SQL} from "../../persistence/sqlHandler";
import {voidThen} from "../../../common/utils";
import {DataRepository} from "../dataRepository";

/**
 * Complete/Permanently delete the items with the given ids.
 */
export class ActionDeleteItems {

	private readonly repository: DataRepository;


	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(itemIds: number[]): Promise<void> {
		return this.repository.deleteItems(itemIds)
	}

}
