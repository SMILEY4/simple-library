import {DataRepository} from "../dataRepository";
import {ItemData} from "./importService";
import {Attribute, attributeKeysEquals} from "../item/itemCommon";
import {AttributeMeta} from "../library/libraryCommons";
import {ActionGetLibraryAttributeMetaByKeys} from "../library/actionGetLibraryAttributeMetaByKeys";

export class ImportDbWriter {

	private readonly repository: DataRepository;
	private readonly actionGetAttributeMetaByKeys: ActionGetLibraryAttributeMetaByKeys;


	constructor(repository: DataRepository, actionGetAttributeMetaByKeys: ActionGetLibraryAttributeMetaByKeys) {
		this.repository = repository;
		this.actionGetAttributeMetaByKeys = actionGetAttributeMetaByKeys;
	}


	public handle(item: ItemData): Promise<any> {
		return this.insertItem(item)
			.then((itemId: number) => item.attributes
				? this.insertAttributes(itemId, item.attributes)
				: Promise.resolve(null)
			);
	}


	private insertItem(item: ItemData): Promise<number | null> {
		return this.repository.insertItem(item.filepath, item.timestamp, item.hash, item.thumbnail)
			.then((itemId: number | null) => itemId
				? itemId
				: Promise.reject("Could not save item: " + item.filepath));
	}


	private insertAttributes(itemId: number, attributes: Attribute[]): Promise<any> {
		return this.actionGetAttributeMetaByKeys.perform(attributes.map(a => a.key))
			.then(attributeMeta => {
				return attributes
					.map(attribute => this.enrichWithAttributeId(attribute, attributeMeta))
					.filter(a => a !== null);
			})
			.then(attribEntries => this.repository.insertItemAttributes(itemId, attribEntries));
	}


	private enrichWithAttributeId(attribute: Attribute, attributeMeta: AttributeMeta[]): { attId: number, value: string, modified: boolean } | null {
		const metaEntry = attributeMeta.find(am => attributeKeysEquals(am.key, attribute.key));
		if (metaEntry) {
			return {
				attId: metaEntry.attId,
				value: "" + attribute.value,
				modified: false
			};
		} else {
			return null;
		}
	}

}