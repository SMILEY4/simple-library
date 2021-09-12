import {Collection, rowsToCollections} from "./collectionCommons";
import {DataRepository} from "../dataRepository";


/**
 * Get all collections, optionally with item count
 */
export class ActionGetAllCollections {

	private readonly repository: DataRepository;

	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(includeItemCount: boolean): Promise<Collection[]> {
		if (includeItemCount) {
			return this.getAllWithCounts().then(collections => this.enrichWithFinalCounts(collections));
		} else {
			return this.getAll();
		}
	}

	private getAllWithCounts(): Promise<Collection[]> {
		return this.repository.getAllCollectionsWithItemCounts()
			.then(rowsToCollections);
	}

	private getAll(): Promise<Collection[]> {
		return this.repository.getAllCollections()
			.then(rowsToCollections);
	}

	private async enrichWithFinalCounts(collections: Collection[]) {
		for (let i = 0; i < collections.length; i++) {
			collections[i].itemCount = await this.getFinalCount(collections[i]);
		}
		return collections;
	}

	private getFinalCount(collection: Collection): Promise<number> {
		if (collection.type === "smart") {
			return this.getSmartItemCount(collection);
		} else if (collection.itemCount) {
			return Promise.resolve(collection.itemCount);
		} else {
			return Promise.resolve(0);
		}
	}

	private getSmartItemCount(collection: Collection): Promise<number> {
		if (collection.type === "smart") {
			const smartQuery: string = collection.smartQuery;
			const queryResult = (smartQuery && smartQuery.trim().length > 0)
				? this.repository.getItemCountByCustomQuery(smartQuery.trim())
				: this.repository.getItemCountTotal();
			return queryResult.then(this.rowToCount);
		} else {
			return Promise.resolve(0);
		}
	}

	private rowToCount(row: any | null): number {
		return row ? row.count : 0;
	}

}
