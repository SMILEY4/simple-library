import {Attribute, rowToAttribute} from "./itemCommon";
import {DataRepository} from "../dataRepository";

/**
 * Deletes the existing attribute of the given item
 */
export class ActionDeleteItemAttribute {

	private readonly repository: DataRepository;


	constructor(repository: DataRepository) {
		this.repository = repository;
	}

	public perform(itemId: number, attributeKey: string): Promise<Attribute | null> {
		return this.findAttribute(itemId, attributeKey)
			.then((attrib: Attribute) => this.deleteAttribute(itemId, attrib));
	}


	private findAttribute(itemId: number, attributeKey: string): Promise<Attribute | null> {
		return this.repository.getItemAttribute(itemId, attributeKey)
			.then((row: any | null) => row
				? rowToAttribute(row)
				: null
			);
	}


	private deleteAttribute(itemId: number, attribute: Attribute | null): Promise<Attribute | null> {
		if (attribute === null) {
			return Promise.resolve(null);
		} else {
			return Promise.resolve()
				.then(() => this.repository.deleteItemAttribute(itemId, attribute.key))
				.then(() => attribute);
		}
	}


}
