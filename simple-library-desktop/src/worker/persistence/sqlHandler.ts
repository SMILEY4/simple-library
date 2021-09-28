import sqlQueryLibraryInfo from "./sqlfiles/library/query_library_info.sql";
import sqlUpdateLibraryLastOpened from "./sqlfiles/library/update_library_last_opened.sql";
import sqlInitLibrary from "./sqlfiles/library/init_library.sql";
import sqlQueryAllGroups from "./sqlfiles/groups/query_all_groups.sql";
import sqlQueryGroupById from "./sqlfiles/groups/query_group_by_id.sql";
import sqlInsertGroup from "./sqlfiles/groups/insert_group.sql";
import sqlDeleteGroup from "./sqlfiles/groups/delete_group.sql";
import sqlUpdateGroupParentsAll from "./sqlfiles/groups/update_groups_parents_all.sql";
import sqlUpdateGroupParent from "./sqlfiles/groups/update_group_parent.sql";
import sqlQueryAllCollections from "./sqlfiles/collections/query_all_collections.sql";
import sqlQueryAllCollectionsWithItemCount from "./sqlfiles/collections/query_all_collections_with_itemcount.sql";
import sqlQueryItemCountByQuery from "./sqlfiles/items/query_itemcount_by_query.sql";
import sqlQueryItemCountTotal from "./sqlfiles/items/query_itemcount_total.sql";
import sqlQueryItemsByCustomQuery from "./sqlfiles/items/query_items_by_query.sql";
import sqlQueryItemById from "./sqlfiles/items/query_item_by_id.sql";
import sqlQueryItemsByCollectionWithAttribs from "./sqlfiles/items/query_items_by_collections_with_attribs.sql";
import sqlQueryItemsAllWithAttribs from "./sqlfiles/items/query_all_items_with_attribs.sql";
import sqlQueryItemsByCustomQueryWithAttribs from "./sqlfiles/items/query_items_by_query_with_attribs.sql";
import sqlDeleteItems from "./sqlfiles/items/delete_items.sql";
import sqlQueryItemsByIds from "./sqlfiles/items/query_items_by_ids.sql";
import sqlDeleteItemsFromCollections from "./sqlfiles/collection_items/delete_items_from_collections.sql";
import sqlUpdateCollectionParents from "./sqlfiles/collections/update_collection_parents.sql";
import sqlInsertCollection from "./sqlfiles/collections/insert_collection.sql";
import sqlDeleteCollection from "./sqlfiles/collections/delete_collection.sql";
import sqlUpdateCollectionName from "./sqlfiles/collections/update_collection_name.sql";
import sqlUpdateCollectionSmartQuery from "./sqlfiles/collections/update_collection_smart_query.sql";
import sqlUpdateCollectionParent from "./sqlfiles/collections/update_collection_parent.sql";
import sqlQueryCollectionById from "./sqlfiles/collections/query_collection_by_id.sql";
import sqlUpdateGroupName from "./sqlfiles/groups/update_group_name.sql";
import sqlInsertItemsIntoCollection from "./sqlfiles/collection_items/insert_items_into_collection.sql";
import sqlRemoveItemsFromCollection from "./sqlfiles/collection_items/remove_items_from_collection.sql";
import sqlQueryItemAttributes from "./sqlfiles/items/query_item_attributes.sql";
import sqlQueryItemAttribute from "./sqlfiles/item_attributes/query_item_attribute.sql";
import sqlInsertItemAttributes from "./sqlfiles/item_attributes/insert_item_attribute.sql";
import sqlUpdateItemAttribute from "./sqlfiles/item_attributes/update_item_attribute.sql";
import sqlDeleteItemAttribute from "./sqlfiles/item_attributes/delete_item_attribute.sql";
import sqlInsertItem from "./sqlfiles/items/insert_item.sql";
import sqlUpdateItemAttributeClearModified from "./sqlfiles/item_attributes/clear_item_attribute_modified.sql";

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

	export function queryItemsByCustomQuery(query: string, attributeKeys?: string[]): string {
		if (attributeKeys) {
			return sql(sqlQueryItemsByCustomQueryWithAttribs)
				.replace(v("query"), query)
				.replace(v("attributeKeys"), strCsv(attributeKeys));
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

	export function queryItemsByCollection(collectionId: number, attributeKeys: string[]): string {
		return sql(sqlQueryItemsByCollectionWithAttribs)
			.replace(v("collectionId"), num(collectionId))
			.replace(v("attributeKeys"), strCsv(attributeKeys));
	}

	export function queryItemsAll(attributeKeys: string[]): string {
		return sql(sqlQueryItemsAllWithAttribs)
			.replace(v("attributeKeys"), strCsv(attributeKeys));
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

	export function queryItemAttributes(itemId: number): string {
		return sql(sqlQueryItemAttributes)
			.replace(v("itemId"), num(itemId));
	}

	export function queryItemAttribute(itemId: number, attributeKey: string): string {
		return sql(sqlQueryItemAttribute)
			.replace(v("itemId"), num(itemId))
			.replace(v("key"), str(attributeKey));
	}

	export function updateItemAttribute(itemId: number, attributeKey: string, value: string): string {
		return sql(sqlUpdateItemAttribute)
			.replace(v("itemId"), num(itemId))
			.replace(v("key"), str(attributeKey))
			.replace(v("value"), str(value));
	}

	export function updateItemAttributeClearModified(itemId: number, attributeKey: string): string {
		return sql(sqlUpdateItemAttributeClearModified)
			.replace(v("itemId"), num(itemId))
			.replace(v("key"), str(attributeKey));
	}

	export function deleteItemAttribute(itemId: number, attributeKey: string): string {
		return sql(sqlDeleteItemAttribute)
			.replace(v("itemId"), num(itemId))
			.replace(v("key"), str(attributeKey));
	}

	export function insertItemAttributes(itemId: number, attributes: ({ key: string, value: any, type: string, modified?: boolean })[]): string {
		const entries: string[] = attributes.map(att => `(${str(att.key)}, ${str(att.value)}, ${str(att.type)}, ${num(itemId)}, ${bool(att.modified)})`);
		return sql(sqlInsertItemAttributes)
			.replace(v("entries"), entries.join(", "));
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


