import {AttributeKey, packAttributeKey} from "./itemCommon";
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


	public perform(itemId: number, attributeKey: AttributeKey): Promise<void> {
		return this.existsAttribute(itemId, attributeKey)
			.then((exists: boolean) => this.deleteAttribute(exists, itemId, attributeKey))
			.then(voidThen);
	}


	private existsAttribute(itemId: number, key: AttributeKey): Promise<boolean> {
		return this.repository.existsItemAttribute(itemId, packAttributeKey(key))
			.then((row: any | null) => row ? row : false);
	}


	private deleteAttribute(exists: boolean, itemId: number, key: AttributeKey): Promise<any> {
		if (!exists) {
			return Promise.resolve();
		} else {
			return this.repository.deleteItemAttribute(itemId, packAttributeKey(key));
		}
	}


}
