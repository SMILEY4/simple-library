import {voidThen} from "../../../common/utils";
import {FileSystemWrapper} from "../fileSystemWrapper";
import {Item, rowsToItems} from "./itemCommon";
import {DataRepository} from "../dataRepository";

/**
 * Open the given items with the system default application.
 */
export class ActionOpenItemsExternal {

	private readonly repository: DataRepository;
	private readonly fsWrapper: FileSystemWrapper;

	constructor(repository: DataRepository, fsWrapper: FileSystemWrapper) {
		this.repository = repository;
		this.fsWrapper = fsWrapper;
	}


	public perform(itemIds: number[]): Promise<void> {
		return this.getItems(itemIds)
			.then((items: Item[]) => this.extractPaths(items))
			.then((paths: string[]) => this.open(paths))
			.then(voidThen);
	}


	private getItems(itemIds: number[]): Promise<Item[]> {
		return this.repository.getItemsByIds(itemIds)
			.then(rowsToItems);
	}


	private extractPaths(items: Item[]): string[] {
		return items.map((item: Item) => item.filepath);
	}


	private open(paths: string[]): Promise<any> {
		return Promise.all(paths.map(p => this.fsWrapper.open(p)));
	}

}
