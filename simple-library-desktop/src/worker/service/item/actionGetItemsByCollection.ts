import {ActionGetCollectionById} from "../collection/actionGetCollectionById";
import {Attribute, estimateSimpleTypeFromAttributeValue, Item, rowsToItems} from "./itemCommon";
import {Collection} from "../collection/collectionCommons";
import {DataRepository} from "../dataRepository";
import {ActionGetHiddenAttributes} from "../library/actionGetHiddenAttributes";
import {ArrayUtils} from "../../../common/arrayUtils";
import {AttributeMeta, rowsToAttributeMeta} from "../library/libraryCommons";

/**
 * Get all items of the given collection (with the requested attributes)
 */
export class ActionGetItemsByCollection {

	private readonly repository: DataRepository;
	private readonly actionGetCollectionById: ActionGetCollectionById;
	private readonly actionGetHiddenAttributes: ActionGetHiddenAttributes;

	constructor(
		repository: DataRepository,
		actionGetCollectionById: ActionGetCollectionById,
		actionGetHiddenAttributes: ActionGetHiddenAttributes
	) {
		this.repository = repository;
		this.actionGetCollectionById = actionGetCollectionById;
		this.actionGetHiddenAttributes = actionGetHiddenAttributes;
	}


	public async perform(collectionId: number, reqAttributeIds: number[], includeMissingAttributes: boolean, includeHiddenAttributes: boolean): Promise<Item[]> {
		const attributeIds: number[] = includeHiddenAttributes ? reqAttributeIds : await this.filterAttributes(reqAttributeIds);
		return this.findCollection(collectionId)
			.then(collection => this.getItemData(collection, attributeIds))
			.then(rowsToItems)
			.then(items => includeMissingAttributes ? this.appendMissingAttributes(items, attributeIds) : items)
			.then(items => this.estimateSimpleAttributeTypes(items));
	}


	private filterAttributes(reqAttributeIds: number[]): Promise<number[]> {
		return this.actionGetHiddenAttributes.perform()
			.then(hidden => ArrayUtils.complement(reqAttributeIds, hidden.map(h => h.attId)));
	}


	private findCollection(collectionId: number): Promise<Collection> {
		return this.actionGetCollectionById.perform(collectionId)
			.then((collection: Collection | null) => !collection
				? Promise.reject("Cant fetch items: collection with id " + collectionId + " not found")
				: collection
			);
	}


	private getItemData(collection: Collection, attributeIds: number[]): Promise<any[]> {
		switch (collection.type) {
			case "normal":
				return this.getItemDataFromNormal(collection, attributeIds);
			case "smart":
				return this.getItemDataFromSmart(collection, attributeIds);
			default: {
				throw "Unexpected collection type: " + collection.type;
			}
		}
	}


	private getItemDataFromNormal(collection: Collection, attributeIds: number[]): Promise<any[]> {
		return this.repository.getItemsByCollection(collection.id, attributeIds);
	}


	private getItemDataFromSmart(collection: Collection, attributeIds: number[]): Promise<any[]> {
		const fetchWithQuery = collection.smartQuery && collection.smartQuery.length > 0;
		return fetchWithQuery
			? this.repository.getItemsByCustomQuery(collection.smartQuery, attributeIds)
			: this.repository.getItemsAll(attributeIds);
	}


	private appendMissingAttributes(items: Item[], attributeIds: number[]): Promise<Item[]> {
		return Promise.resolve(items)
			.then(async items => {
				for (let item of items) {
					const missingAttribs = await this.getMissingAttributesForItem(item, attributeIds);
					item.attributes.push(...missingAttribs);
				}
				return items;
			});
	}


	private getMissingAttributesForItem(item: Item, attributeIds: number[]): Promise<Attribute[]> {

		const existingIds = item.attributes.map(att => att.attId);
		const missingIds = ArrayUtils.complement(attributeIds, existingIds);

		return this.repository.queryAttributeMeta(missingIds)
			.then(rowsToAttributeMeta)
			.then(attMeta => attMeta.map(e => this.buildMissingAttribute(e)));
	}


	private buildMissingAttribute(attribMeta: AttributeMeta): Attribute {
		return {
			attId: attribMeta.attId,
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
