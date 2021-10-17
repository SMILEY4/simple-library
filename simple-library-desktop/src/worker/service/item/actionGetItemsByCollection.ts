import {ActionGetCollectionById} from "../collection/actionGetCollectionById";
import {
	Attribute,
	AttributeKey,
	attributeKeysEquals,
	AttributeMetadata,
	estimateSimpleTypeFromAttributeValue,
	Item,
	packAttributeKey,
	rowsToAttributeMeta,
	rowsToItems
} from "./itemCommon";
import {Collection} from "../collection/collectionCommons";
import {DataRepository} from "../dataRepository";

/**
 * Get all items of the given collection (with the attributes of the given keys)
 */
export class ActionGetItemsByCollection {

	private readonly repository: DataRepository;
	private readonly actionGetCollectionById: ActionGetCollectionById;


	constructor(repository: DataRepository, actionGetCollectionById: ActionGetCollectionById) {
		this.repository = repository;
		this.actionGetCollectionById = actionGetCollectionById;
	}


	public perform(collectionId: number, attributeKeys: AttributeKey[], includeMissingAttributes: boolean): Promise<Item[]> {
		return this.findCollection(collectionId)
			.then(collection => this.getItemData(collection, attributeKeys))
			.then(rowsToItems)
			.then(items => includeMissingAttributes ? this.appendMissingAttributes(items, attributeKeys) : items)
			.then(items => this.estimateSimpleAttributeTypes(items));
	}


	private findCollection(collectionId: number): Promise<Collection> {
		return this.actionGetCollectionById.perform(collectionId)
			.then((collection: Collection | null) => !collection
				? Promise.reject("Cant fetch items: collection with id " + collectionId + " not found")
				: collection
			);
	}


	private getItemData(collection: Collection, attributeKeys: AttributeKey[]): Promise<any[]> {
		switch (collection.type) {
			case "normal":
				return this.getItemDataFromNormal(collection, attributeKeys);
			case "smart":
				return this.getItemDataFromSmart(collection, attributeKeys);
			default: {
				throw "Unexpected collection type: " + collection.type;
			}
		}
	}


	private getItemDataFromNormal(collection: Collection, attributeKeys: AttributeKey[]): Promise<any[]> {
		return this.repository.getItemsByCollection(collection.id, attributeKeys.map(k => packAttributeKey(k)));
	}


	private getItemDataFromSmart(collection: Collection, attributeKeys: AttributeKey[]): Promise<any[]> {
		const fetchWithQuery = collection.smartQuery && collection.smartQuery.length > 0;
		const keys: ([string, string, string, string, string])[] = attributeKeys.map(k => packAttributeKey(k));
		return fetchWithQuery
			? this.repository.getItemsByCustomQuery(collection.smartQuery, keys)
			: this.repository.getItemsAll(keys);
	}


	private appendMissingAttributes(items: Item[], attributeKeys: AttributeKey[]): Promise<Item[]> {
		return Promise.resolve(items)
			.then(async items => {
				for (let item of items) {
					const missingAttribs = await this.getMissingAttributesForItem(item, attributeKeys);
					item.attributes.push(...missingAttribs);
				}
				return items;
			});
	}


	private getMissingAttributesForItem(item: Item, attributeKeys: AttributeKey[]): Promise<Attribute[]> {

		const existingKeys: AttributeKey[] = item.attributes.map(att => att.key);

		const missingKeysPacked: ([string, string, string, string, string,])[] = attributeKeys
			.filter(key => !existingKeys.find(k => attributeKeysEquals(k, key)))
			.map(key => packAttributeKey(key));

		return this.repository.queryAttributeMeta(missingKeysPacked)
			.then(rowsToAttributeMeta)
			.then(attMeta => attMeta.map(e => this.buildMissingAttribute(e)));
	}


	private buildMissingAttribute(attribMeta: AttributeMetadata): Attribute {
		return {
			key: attribMeta.key,
			type: attribMeta.type,
			writable: attribMeta.writable,
			value: null,
			modified: false
		};
	}

	private estimateSimpleAttributeTypes(items: Item[]): Promise<Item[]> {
		items.forEach(item => {
			item.attributes.forEach(att => {
				att.type = estimateSimpleTypeFromAttributeValue(att.value);
			});
		});
		return Promise.resolve(items);
	}

}
