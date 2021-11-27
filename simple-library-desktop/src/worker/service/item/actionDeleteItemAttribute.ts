import {DataRepository} from "../dataRepository";
import {voidThen} from "../../../common/utils";

/**
 * Deletes the existing attribute of the given item
 */
export class ActionDeleteItemAttribute {

	private readonly repository: DataRepository;


	constructor(repository: DataRepository) {
		this.repository = repository;
	}


	public perform(itemId: number, attributeId: number): Promise<void> {
		return this.existsAttribute(itemId, attributeId)
			.then((exists: boolean) => this.deleteAttribute(exists, itemId, attributeId))
			.then(voidThen);
	}


	private existsAttribute(itemId: number, attributeId: number): Promise<boolean> {
		return this.repository.existsItemAttribute(itemId, attributeId)
			.then((row: any | null) => row ? row : false);
	}


	private deleteAttribute(exists: boolean, itemId: number, attributeId: number): Promise<any> {
		if (!exists) {
			return Promise.resolve();
		} else {
			return this.repository.deleteItemAttribute(itemId, attributeId);
		}
	}


}
