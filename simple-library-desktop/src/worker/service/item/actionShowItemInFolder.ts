import {voidThen} from "../../../common/utils";
import {FileSystemWrapper} from "../fileSystemWrapper";
import {Item, rowsToItems} from "./itemCommon";
import {DataRepository} from "../dataRepository";

/**
 * Open the folder containing the given item
 */
export class ActionShowItemInFolder {

	private readonly repository: DataRepository;
	private readonly fsWrapper: FileSystemWrapper;

	constructor(repository: DataRepository, fsWrapper: FileSystemWrapper) {
		this.repository = repository;
		this.fsWrapper = fsWrapper;
	}

	public perform(itemId: number): Promise<void> {
		return this.getItem(itemId)
			.then(item => this.open(item.filepath))
			.then(voidThen);
	}

	private getItem(itemId: number): Promise<Item | null> {
		return this.repository.getItemsByIds([itemId])
			.then(rowsToItems)
			.then(items => (items && items.length > 0) ? items[0] : null);
	}

	private open(path: string): Promise<any> {
		return this.fsWrapper.showInFolder(path);
	}

}
