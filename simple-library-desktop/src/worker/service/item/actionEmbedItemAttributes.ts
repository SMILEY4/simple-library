import {DataRepository} from "../dataRepository";
import {ActionGetExiftoolInfo} from "../config/actionGetExiftoolInfo";
import {ExifHandler} from "../exifHandler";
import {Item} from "./itemCommon";

/**
 * Embed the attributes of the given items (into the files)
 */
export class ActionEmbedItemAttributes {

	private readonly actionGetExiftoolInfo: ActionGetExiftoolInfo;
	private readonly repository: DataRepository;


	constructor(actionGetExiftoolInfo: ActionGetExiftoolInfo, repository: DataRepository) {
		this.actionGetExiftoolInfo = actionGetExiftoolInfo;
		this.repository = repository;
	}


	public perform(itemIds: number[] | null, allAttributes: boolean): Promise<any> {
		const exifHandler = new ExifHandler(this.actionGetExiftoolInfo, true);
		return (itemIds === null ? this.getAllItems() : this.getItems(itemIds))
			.then(items => this.embedItems(items, allAttributes))
			.finally(() => exifHandler.close());
	}

	private getItems(itemIds: number[]): Promise<Item[]> {
		return Promise.resolve([]); // todo
	}

	private getAllItems(): Promise<Item[]> {
		return Promise.resolve([]); // todo
	}

	private async embedItems(items: Item[], allAttributes: boolean): Promise<void> {
		for (let i = 0; i < items.length; i++) {
			await this.embedItem(items[i], allAttributes);
		}
	}

	private embedItem(item: Item, allAttributes: boolean): Promise<any> {
		return Promise.resolve(); // todo
	}


}
