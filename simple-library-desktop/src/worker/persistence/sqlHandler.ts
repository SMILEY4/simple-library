import sqlQueryLibraryInfo from "./sqlscripts/library/query_library_info.sql";
import sqlUpdateLibraryLastOpened from "./sqlscripts/library/update_library_last_opened.sql";
import sqlInitLibrary from "./sqlscripts/library/init_library.sql";
import sqlQueryAllGroups from "./sqlscripts/groups/query_all_groups.sql";
import sqlQueryGroupById from "./sqlscripts/groups/query_group_by_id.sql";
import sqlInsertGroup from "./sqlscripts/groups/insert_group.sql";
import sqlDeleteGroup from "./sqlscripts/groups/delete_group.sql";
import sqlUpdateGroupParentsAll from "./sqlscripts/groups/update_groups_parents_all.sql";
import sqlUpdateGroupParent from "./sqlscripts/groups/update_group_parent.sql";
import sqlQueryAllCollections from "./sqlscripts/collections/query_all_collections.sql";
import sqlQueryAllCollectionsWithItemCount from "./sqlscripts/collections/query_all_collections_with_itemcount.sql";
import sqlQueryItemCountByQuery from "./sqlscripts/items/query_itemcount_by_query.sql";
import sqlQueryItemCountTotal from "./sqlscripts/items/query_itemcount_total.sql";
import sqlQueryItemsByCustomQuery from "./sqlscripts/items/query_items_by_query.sql";
import sqlQueryItemById from "./sqlscripts/items/query_item_by_id.sql";
import sqlQueryItemsByCollectionWithAttribs from "./sqlscripts/items/query_items_by_collections_with_attribs.sql";
import sqlQueryItemsAllWithAttribs from "./sqlscripts/items/query_all_items_with_attribs.sql";
import sqlQueryItemsByCustomQueryWithAttribs from "./sqlscripts/items/query_items_by_query_with_attribs.sql";
import sqlDeleteItems from "./sqlscripts/items/delete_items.sql";
import sqlQueryItemsByIds from "./sqlscripts/items/query_items_by_ids.sql";
import sqlDeleteItemsFromCollections from "./sqlscripts/collection_items/delete_items_from_collections.sql";
import sqlUpdateCollectionParents from "./sqlscripts/collections/update_collection_parents.sql";
import sqlInsertCollection from "./sqlscripts/collections/insert_collection.sql";
import sqlDeleteCollection from "./sqlscripts/collections/delete_collection.sql";
import sqlUpdateCollectionName from "./sqlscripts/collections/update_collection_name.sql";
import sqlUpdateCollectionSmartQuery from "./sqlscripts/collections/update_collection_smart_query.sql";
import sqlUpdateCollectionParent from "./sqlscripts/collections/update_collection_parent.sql";
import sqlQueryCollectionById from "./sqlscripts/collections/query_collection_by_id.sql";
import sqlUpdateGroupName from "./sqlscripts/groups/update_group_name.sql";
import sqlInsertItemsIntoCollection from "./sqlscripts/collection_items/insert_items_into_collection.sql";
import sqlRemoveItemsFromCollection from "./sqlscripts/collection_items/remove_items_from_collection.sql";
import sqlQueryItemAttributes from "./sqlscripts/items/query_item_attributes.sql";
import sqlQueryItemAttribute from "./sqlscripts/item_attributes/query_item_attribute.sql";
import sqlInsertItemAttributes from "./sqlscripts/item_attributes/insert_item_attribute.sql";
import sqlUpdateItemAttribute from "./sqlscripts/item_attributes/update_item_attribute.sql";
import sqlDeleteItemAttribute from "./sqlscripts/item_attributes/delete_item_attribute.sql";
import sqlInsertItem from "./sqlscripts/items/insert_item.sql";
import sqlInsertAttributeMeta from "./sqlscripts/item_attributes/insert_attribute_meta.sql";
import sqlQueryExistsItemAttribute from "./sqlscripts/item_attributes/query_exists_item_attribute.sql";
import sqlQueryAttributeMetadata from "./sqlscripts/item_attributes/query_item_attribute_meta.sql";
import sqlQueryItemAttributesAll from "./sqlscripts/item_attributes/query_item_attributes_all.sql";
import sqlQueryItemAttributesAllModified from "./sqlscripts/item_attributes/query_item_attributes_all_modified.sql";
import sqlQueryItemAttributesByItems from "./sqlscripts/item_attributes/query_item_attributes_by_items.sql";
import sqlQueryItemAttributesModifiedByItems
	from "./sqlscripts/item_attributes/query_item_attributes_modified_by_items.sql";
import sqlUpdateItemAttributeModifiedFlag from "./sqlscripts/item_attributes/update_item_attribute_modified.sql";
import sqlUpdateItemAttributeModifiedFlagsByItemIds
	from "./sqlscripts/item_attributes/update_item_attributes_modified_by_items.sql";
import sqlUpdateItemAttributeModifiedFlagsAll
	from "./sqlscripts/item_attributes/update_item_attributes_modified_all.sql";

export module SQL {

	export function initializeNewLibrary(name: string, timestamp: number): string[] {
		return sql(sqlInitLibrary)
			.split(";")
			.filter((stmt: string) => /[a-zA-Z]/g.test(stmt))
			.map((stmt: string) => stmt
				.replace(v("name"), str(name))
				.replace(v("timestamp"), num(timestamp)));
	}

	export function queryLibraryInfo(): string {
		return sql(sqlQueryLibraryInfo);
	}

	export function updateLibraryInfoTimestampLastOpened(timestamp: number): string {
		return sql(sqlUpdateLibraryLastOpened)
			.replace(v("newTimestamp"), num(timestamp));
	}

	export function queryAllGroups(): string {
		return sql(sqlQueryAllGroups);
	}

	export function queryGroupById(groupId: number): string {
		return sql(sqlQueryGroupById)
			.replace(v("groupId"), num(groupId));
	}

	export function insertGroup(name: string, parentGroupId: number | null) {
		return sql(sqlInsertGroup)
			.replace(v("groupName"), str(name))
			.replace(v("parentGroupId"), num(parentGroupId));
	}

	export function deleteGroup(groupId: number) {
		return sql(sqlDeleteGroup)
			.replace(v("groupId"), num(groupId));
	}

	export function updateGroupName(groupId: number, name: string): string {
		return sql(sqlUpdateGroupName)
			.replace(v("groupId"), num(groupId))
			.replace(v("groupName"), str(name));
	}

	export function updateGroupParent(groupId: number, newParentGroupId: number | null): string {
		return sql(sqlUpdateGroupParent)
			.replace(v("groupId"), num(groupId))
			.replace(v("parentGroupId"), num(newParentGroupId));
	}

	export function updateGroupParents(prevParentGroupId: number | null, newParentGroupId: number | null) {
		return sql(sqlUpdateGroupParentsAll)
			.replace(v("prevParentGroupId"), eqNum(prevParentGroupId))
			.replace(v("parentGroupId"), num(newParentGroupId))
			.replace(vNull(), isNull);
	}

	export function queryAllCollections(): string {
		return sql(sqlQueryAllCollections);
	}

	export function insertCollection(name: string, type: string, parentGroupId: number | null, query: string | null): string {
		return sql(sqlInsertCollection)
			.replace(v("collectionName"), str(name))
			.replace(v("collectionType"), str(type))
			.replace(v("groupId"), num(parentGroupId))
			.replace(v("query"), str(query));
	}

	export function deleteCollection(collectionId: number): string {
		return sql(sqlDeleteCollection)
			.replace(v("collectionId"), num(collectionId));
	}

	export function updateCollectionName(collectionId: number, name: string): string {
		return sql(sqlUpdateCollectionName)
			.replace(v("collectionId"), num(collectionId))
			.replace(v("collectionName"), str(name));
	}

	export function updateCollectionSmartQuery(collectionId: number, smartQuery: string | null): string {
		return sql(sqlUpdateCollectionSmartQuery)
			.replace(v("collectionId"), num(collectionId))
			.replace(v("collectionSmartQuery"), str(smartQuery));
	}

	export function queryCollectionById(collectionId: number): string {
		return sql(sqlQueryCollectionById)
			.replace(v("collectionId"), num(collectionId));
	}

	export function queryAllCollectionsWithItemCount(): string {
		return sql(sqlQueryAllCollectionsWithItemCount);
	}

	export function updateCollectionParents(prevParentGroupId: number | null, newParentGroupId: number | null): string {
		return sql(sqlUpdateCollectionParents)
			.replace(v("groupId"), num(newParentGroupId))
			.replace(v("prevGroupId"), eqNum(prevParentGroupId))
			.replace(vNull(), isNull());
	}

	export function updateCollectionParent(collectionId: number, newParentGroupId: number | null): string {
		return sql(sqlUpdateCollectionParent)
			.replace(v("collectionId"), num(collectionId))
			.replace(v("groupId"), num(newParentGroupId));
	}

	export function queryItemCountByQuery(query: string): string {
		return sql(sqlQueryItemCountByQuery)
			.replace(v("query"), query);
	}

	export function queryItemCountTotal(): string {
		return sql(sqlQueryItemCountTotal);
	}

	export function queryItemsByCustomQuery(query: string, attributeKeys?: ([string, string, string, string, string])[]): string {
		if (attributeKeys && attributeKeys.length > 0) {
			return sql(sqlQueryItemsByCustomQueryWithAttribs)
				.replace(v("query"), query)
				.replace(v("attributeKeys"), attribKeyList(attributeKeys));
		} else {
			return sql(sqlQueryItemsByCustomQuery)
				.replace(v("query"), query);
		}
	}

	export function queryItemById(itemId: number): string {
		return sql(sqlQueryItemById)
			.replace(v("itemId"), num(itemId));
	}

	export function queryItemsByIds(itemIds: number[]): string {
		return sql(sqlQueryItemsByIds)
			.replace(v("itemIds"), numCsv(itemIds));
	}

	export function queryItemsByCollection(collectionId: number, attributeKeys: ([string, string, string, string, string])[]): string {
		return sql(sqlQueryItemsByCollectionWithAttribs)
			.replace(v("collectionId"), num(collectionId))
			.replace(v("attributeKeys"), attribKeyList(attributeKeys));
	}

	export function queryItemsAll(attributeKeys: ([string, string, string, string, string])[]): string {
		return sql(sqlQueryItemsAllWithAttribs)
			.replace(v("attributeKeys"), attribKeyList(attributeKeys));
	}


	export function insertItemsIntoCollection(collectionId: number, itemIds: number[]): string {
		const strEntries = itemIds.map(id => "(" + collectionId + "," + id + ")").join(", ");
		return sql(sqlInsertItemsIntoCollection)
			.replace(v("entries"), strEntries);
	}

	export function updateRemoveItemsFromCollection(collectionId: number, itemIds: number[]): string {
		return sql(sqlRemoveItemsFromCollection)
			.replace(v("collectionId"), num(collectionId))
			.replace(v("itemIds"), itemIds.join(","));
	}

	export function deleteItems(itemIds: number[]): string {
		return sql(sqlDeleteItems)
			.replace(v("itemIds"), numCsv(itemIds));
	}

	export function insertItem(filepath: string, timestamp: number, hash: string, thumbnail: string): string {
		return sql(sqlInsertItem)
			.replace(v("filepath"), str(filepath))
			.replace(v("timestamp"), num(timestamp))
			.replace(v("hash"), str(hash))
			.replace(v("thumbnail"), str(thumbnail));
	}

	export function deleteItemsFromCollections(itemIds: number[]): string {
		return sql(sqlDeleteItemsFromCollections)
			.replace(v("itemIds"), numCsv(itemIds));
	}

	export function insertAttributeMeta(entries: { id: string, name: string, type: string, writable: boolean, g0: string | undefined, g1: string | undefined, g2: string | undefined }[]): string {
		const entriesStr: string[] = entries.map(e => `(${str(e.id)}, ${str(e.name)}, ${str(e.type)}, ${bool(e.writable)}, ${str(e.g0)}, ${str(e.g1)}, ${str(e.g2)})`);
		return sql(sqlInsertAttributeMeta)
			.replace(v("entries"), entriesStr.join(", "));
	}

	export function queryAttributeMeta(keys: ([string, string, string, string, string])[]): string {
		return sql(sqlQueryAttributeMetadata)
			.replace(v("keys"), attribKeyList(keys));
	}

	export function queryItemAttributes(itemId: number): string {
		return sql(sqlQueryItemAttributes)
			.replace(v("itemId"), num(itemId));
	}

	export function queryExistsItemAttribute(itemId: number, attributeKey: ([string, string, string, string, string])): string {
		return sql(sqlQueryExistsItemAttribute)
			.replace(v("itemId"), num(itemId))
			.replace(v("id"), str(attributeKey[0]))
			.replace(v("name"), str(attributeKey[1]))
			.replace(v("g0"), str(attributeKey[2]))
			.replace(v("g1"), str(attributeKey[3]))
			.replace(v("g2"), str(attributeKey[4]));
	}

	export function queryItemAttribute(itemId: number, attributeKey: ([string, string, string, string, string])): string {
		return sql(sqlQueryItemAttribute)
			.replace(v("itemId"), num(itemId))
			.replace(v("id"), str(attributeKey[0]))
			.replace(v("name"), str(attributeKey[1]))
			.replace(v("g0"), str(attributeKey[2]))
			.replace(v("g1"), str(attributeKey[3]))
			.replace(v("g2"), str(attributeKey[4]));
	}

	export function updateItemAttribute(itemId: number, attributeKey: ([string, string, string, string, string]), value: string): string {
		return sql(sqlUpdateItemAttribute)
			.replace(v("itemId"), num(itemId))
			.replace(v("id"), str(attributeKey[0]))
			.replace(v("name"), str(attributeKey[1]))
			.replace(v("g0"), str(attributeKey[2]))
			.replace(v("g1"), str(attributeKey[3]))
			.replace(v("g2"), str(attributeKey[4]))
			.replace(v("value"), str(value));
	}

	export function deleteItemAttribute(itemId: number, attributeKey: ([string, string, string, string, string])): string {
		return sql(sqlDeleteItemAttribute)
			.replace(v("itemId"), num(itemId))
			.replace(v("id"), str(attributeKey[0]))
			.replace(v("name"), str(attributeKey[1]))
			.replace(v("g0"), str(attributeKey[2]))
			.replace(v("g1"), str(attributeKey[3]))
			.replace(v("g2"), str(attributeKey[4]));
	}

	export function insertItemAttributes(itemId: number, attributes: ({ id: string, name: string, g0: string, g1: string, g2: string, value: any, modified?: boolean })[]): string {
		const entries: string[] = attributes.map(att => `(${str(att.id)}, ${str(att.name)}, ${str(att.g0)}, ${str(att.g1)}, ${str(att.g2)}, ${num(itemId)}, ${str(att.value)}, ${bool(att.modified)})`);
		return sql(sqlInsertItemAttributes)
			.replace(v("entries"), entries.join(", "));
	}


	export function queryExtendedItemAttributesAll(onlyModified: boolean): string {
		if (onlyModified) {
			return sql(sqlQueryItemAttributesAllModified);
		} else {
			return sql(sqlQueryItemAttributesAll);
		}
	}

	export function queryExtendedItemAttributesByItemIds(itemIds: number[], onlyModified: boolean): string {
		if (onlyModified) {
			return sql(sqlQueryItemAttributesModifiedByItems)
				.replace(v("itemIds"), numCsv(itemIds));
		} else {
			return sql(sqlQueryItemAttributesByItems)
				.replace(v("itemIds"), numCsv(itemIds));
		}
	}

	export function clearItemAttributeModifiedFlag(itemId: number, attributeKey: ([string, string, string, string, string])): string {
		return sql(sqlUpdateItemAttributeModifiedFlag)
			.replace(v("modified"), bool(false))
			.replace(v("itemId"), num(itemId))
			.replace(v("id"), str(attributeKey[0]))
			.replace(v("name"), str(attributeKey[1]))
			.replace(v("g0"), str(attributeKey[2]))
			.replace(v("g1"), str(attributeKey[3]))
			.replace(v("g2"), str(attributeKey[4]));
	}

	export function clearItemAttributeModifiedFlagsByItemIds(itemIds: number[]): string {
		return sql(sqlUpdateItemAttributeModifiedFlagsByItemIds)
			.replace(v("modified"), bool(false))
			.replace(v("itemIds"), numCsv(itemIds));
	}

	export function clearItemAttributeModifiedFlagsAll(): string {
		return sql(sqlUpdateItemAttributeModifiedFlagsAll)
			.replace(v("modified"), bool(false));
	}

}

function sql(value: any): string {
	return value.toString();
}

function v(name: string): RegExp {
	return new RegExp("\\$" + name, "g");
}

function vNull() {
	return new RegExp("= \\$null", "g");
}

function isNull(): string {
	return "IS NULL";
}

function str(value: any): string {
	return value === null || value === undefined
		? "null"
		: "'" + ("" + value).replace(/'/g, "''") + "'";
}

function num(value: number | null): string {
	return !!value ? "" + value : "null";
}

function eqNum(value: number | null): string {
	return !!value ? "" + value : "$null";
}

function strCsv(values: any[]): string {
	return !!values ? values.map((value: any) => str(value)).join(", ") : "null";
}

function numCsv(values: number[]): string {
	return !!values ? values.map((value: number) => num(value)).join(", ") : "null";
}

function bool(value?: boolean): string {
	return value === true ? "1" : "0";
}

function attribKeyList(attributeKeys: ([string, string, string, string, string])[]): string {
	return (attributeKeys && attributeKeys.length > 0)
		? attributeKeys.map(key => "('" + key[0] + "','" + key[1] + "','" + key[2] + "','" + key[3] + "','" + key[4] + "')").join(",")
		: "('','','','','')";
}

