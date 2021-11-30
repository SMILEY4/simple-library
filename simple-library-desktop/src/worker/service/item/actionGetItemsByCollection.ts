import {ActionGetCollectionById} from "../collection/actionGetCollectionById";
import {Attribute, estimateSimpleTypeFromAttributeValue, Item, ItemPage, rowsToItems} from "./itemCommon";
import {Collection} from "../collection/collectionCommons";
import {DataRepository} from "../dataRepository";
import {ActionGetHiddenAttributes} from "../library/actionGetHiddenAttributes";
import {ArrayUtils} from "../../../common/arrayUtils";
import {AttributeMeta, rowsToAttributeMeta} from "../library/libraryCommons";
import {ActionGetItemListAttributes} from "../library/actionGetItemListAttributes";
import {voidThen} from "../../../common/utils";

/**
 * Get all items of the given collection (with the requested attributes)
 */
export class ActionGetItemsByCollection {

	private readonly repository: DataRepository;
	private readonly actionGetCollectionById: ActionGetCollectionById;
	private readonly actionGetHiddenAttributes: ActionGetHiddenAttributes;
	private readonly actionGetItemListAttributes: ActionGetItemListAttributes;

	constructor(
		repository: DataRepository,
		actionGetCollectionById: ActionGetCollectionById,
		actionGetHiddenAttributes: ActionGetHiddenAttributes,
		actionGetItemListAttributes: ActionGetItemListAttributes
	) {
		this.repository = repository;
		this.actionGetCollectionById = actionGetCollectionById;
		this.actionGetHiddenAttributes = actionGetHiddenAttributes;
		this.actionGetItemListAttributes = actionGetItemListAttributes;
	}


	public async perform(collectionId: number, includeMissingAttributes: boolean, includeHiddenAttributes: boolean, pageIndex: number, pageSize: number): Promise<ItemPage> {
		const itemListAttributeIds = (await this.actionGetItemListAttributes.perform()).map(a => a.attId);
		const attributeIds: number[] = includeHiddenAttributes ? itemListAttributeIds : await this.filterAttributes(itemListAttributeIds);
		const collection = await this.findCollection(collectionId);
		return Promise.resolve(collection)
			.then(collection => this.getItemData(collection, attributeIds, pageIndex, pageSize))
			.then(rowsToItems)
			.then(items => includeMissingAttributes ? this.appendMissingAttributes(items, attributeIds) : items)
			.then(items => this.estimateSimpleAttributeTypes(items))
			.then(items => this.sortItemAttributes(items))
			.then(async items => {
				return {
					items: items,
					pageIndex: pageIndex,
					pageSize: pageSize,
					totalCount: (await this.getTotalItemCount(collection))
				};
			});
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


	private getItemData(collection: Collection, attributeIds: number[], pageIndex: number, pageSize: number): Promise<any[]> {
		switch (collection.type) {
			case "normal":
				return this.getItemDataFromNormal(collection, attributeIds, pageIndex, pageSize);
			case "smart":
				return this.getItemDataFromSmart(collection, attributeIds, pageIndex, pageSize);
			default: {
				throw "Unexpected collection type: " + collection.type;
			}
		}
	}


	private getItemDataFromNormal(collection: Collection, attributeIds: number[], pageIndex: number, pageSize: number): Promise<any[]> {
		return this.repository.getItemsByCollection(collection.id, attributeIds, pageIndex, pageSize);
	}


	private getItemDataFromSmart(collection: Collection, attributeIds: number[], pageIndex: number, pageSize: number): Promise<any[]> {
		const fetchWithQuery = collection.smartQuery && collection.smartQuery.length > 0;
		return fetchWithQuery
			? this.repository.getItemsByCustomQuery(collection.smartQuery, attributeIds, pageIndex, pageSize)
			: this.repository.getItemsAll(attributeIds, pageIndex, pageSize);
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
			.then(attMeta => attMeta.map(e => this.buildMissingAttribute(e, ArrayUtils.indexOf(attributeIds, e.attId))));
	}


	private buildMissingAttribute(attribMeta: AttributeMeta, orderIndex: number): Attribute {
		return {
			attId: attribMeta.attId,
			key: attribMeta.key,
			type: attribMeta.type,
			writable: attribMeta.writable,
			value: null,
			modified: false,
			orderIndex: orderIndex
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


	private sortItemAttributes(items: Item[]): Promise<Item[]> {
		items.forEach(item => {
			item.attributes.sort((a, b) => a.orderIndex - b.orderIndex);
		});
		return Promise.resolve(items);
	}


	private getTotalItemCount(collection: Collection): Promise<number> {
		switch (collection.type) {
			case "normal":
				return this.repository.getItemCountByNormalCollection(collection.id).then(row => row.count);
			case "smart":
				return collection.smartQuery && collection.smartQuery.length > 0
					? this.repository.getItemCountByCustomQuery(collection.smartQuery).then(row => row.count)
					: this.repository.getItemCountTotal().then(row => row.count);
			default: {
				throw "Unexpected collection type: " + collection.type;
			}
		}
	}

}
