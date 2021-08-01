import metadataGetAll from "./sqlfiles/library/metadata_get_all.sql";
import metadataUpdateTimestampLastOpened from "./sqlfiles/library/metadata_update_timestamp_last_opened.sql";
import libraryInitialize from "./sqlfiles/library/library_initialize.sql";
import groupsSelectAll from "./sqlfiles/groups/groups_select_all.sql";
import groupsSelectById from "./sqlfiles/groups/groups_find_by_id.sql";
import groupInsert from "./sqlfiles/groups/groups_insert.sql";
import groupDelete from "./sqlfiles/groups/groups_delete.sql";
import groupUpdateParents from "./sqlfiles/groups/groups_update_parents.sql";
import groupUpdateParent from "./sqlfiles/groups/groups_update_parent_id.sql";
import collectionsSelectAll from "./sqlfiles/collections/collections_select_all.sql";
import collectionsSelectAllWithItemCount from "./sqlfiles/collections/collections_select_all_include_itemcount.sql";
import itemsCountWithCustomQuery from "./sqlfiles/items/items_count_with_custom_query.sql";
import itemsCountTotal from "./sqlfiles/items/items_count_total.sql";
import itemsByCustomQuery from "./sqlfiles/items/items_get_by_custom_filter.sql";
import itemById from "./sqlfiles/items/items_get_by_id.sql";
import itemsByCollectionWithAttributes from "./sqlfiles/items/items_with_attribs_get_by_collection.sql";
import itemsAllWithAttributes from "./sqlfiles/items/items_with_attribs_get_all.sql";
import itemsByCustomQueryWithAttribs from "./sqlfiles/items/items_with_attribs_get_by_custom_filter.sql";
import itemsDelete from "./sqlfiles/items/items_delete.sql";
import itemsByIds from "./sqlfiles/items/items_get_by_ids.sql";
import itemsDeleteFromCollections from "./sqlfiles/collection_items/collection_items_delete_items_from_all.sql";
import collectionsUpdateParents from "./sqlfiles/collections/collections_update_parent_group.sql";
import collectionInsert from "./sqlfiles/collections/collections_insert.sql";
import collectionDelete from "./sqlfiles/collections/collections_delete.sql";
import collectionUpdateName from "./sqlfiles/collections/collections_update_name.sql";
import collectionUpdateSmartQuery from "./sqlfiles/collections/collections_update_smart_query.sql";
import collectionUpdateParent from "./sqlfiles/collections/collections_update_group_id.sql";
import collectionById from "./sqlfiles/collections/collections_find_by_id.sql";
import groupsUpdateName from "./sqlfiles/groups/groups_update_name.sql";
import collectionItemsAdd from "./sqlfiles/collection_items/collection_items_insert_multiple.sql";
import collectionItemsRemove from "./sqlfiles/collection_items/collection_items_delete_items_multiple.sql";
import itemAttributes from "./sqlfiles/items/items_get_metadata.sql";
import itemAttribute from "./sqlfiles/item_attributes/item_attribs_get_single.sql";
import itemAttributesInsert from "./sqlfiles/item_attributes/item_attribs_insert.sql";
import itemUpdateAttribute from "./sqlfiles/item_attributes/item_attribs_update_value.sql";
import itemInsert from "./sqlfiles/items/items_insert.sql";

export module SQL {

	export function initializeNewLibrary(name: string, timestamp: number): string[] {
		return sql(libraryInitialize)
			.split(";")
			.filter((stmt: string) => /[a-zA-Z]/g.test(stmt))
			.map((stmt: string) => stmt
				.replace(v("name"), str(name))
				.replace(v("timestamp"), num(timestamp)));
	}

	export function queryLibraryInfo(): string {
		return sql(metadataGetAll);
	}

	export function updateLibraryInfoTimestampLastOpened(timestamp: number): string {
		return sql(metadataUpdateTimestampLastOpened)
			.replace(v("newTimestamp"), num(timestamp));
	}

	export function queryAllGroups(): string {
		return sql(groupsSelectAll);
	}

	export function queryGroupById(groupId: number): string {
		return sql(groupsSelectById)
			.replace(v("groupId"), num(groupId));
	}

	export function insertGroup(name: string, parentGroupId: number | null) {
		return sql(groupInsert)
			.replace(v("groupName"), str(name))
			.replace(v("parentGroupId"), num(parentGroupId));
	}

	export function deleteGroup(groupId: number) {
		return sql(groupDelete)
			.replace(v("groupId"), num(groupId));
	}

	export function updateGroupName(groupId: number, name: string): string {
		return sql(groupsUpdateName)
			.replace(v("groupId"), num(groupId))
			.replace(v("groupName"), str(name));
	}

	export function updateGroupParent(groupId: number, newParentGroupId: number | null): string {
		return sql(groupUpdateParent)
			.replace(v("groupId"), num(groupId))
			.replace(v("parentGroupId"), num(newParentGroupId));
	}

	export function updateGroupParents(prevParentGroupId: number | null, newParentGroupId: number | null) {
		return sql(groupUpdateParents)
			.replace(v("prevParentGroupId"), eqNum(prevParentGroupId))
			.replace(v("parentGroupId"), num(newParentGroupId))
			.replace(vNull(), isNull);
	}

	export function queryAllCollections(): string {
		return sql(collectionsSelectAll);
	}

	export function insertCollection(name: string, type: string, parentGroupId: number | null, query: string | null): string {
		return sql(collectionInsert)
			.replace(v("collectionName"), str(name))
			.replace(v("collectionType"), str(type))
			.replace(v("groupId"), num(parentGroupId))
			.replace(v("query"), str(query));
	}

	export function deleteCollection(collectionId: number): string {
		return sql(collectionDelete)
			.replace(v("collectionId"), num(collectionId));
	}

	export function updateCollectionName(collectionId: number, name: string): string {
		return sql(collectionUpdateName)
			.replace(v("collectionId"), num(collectionId))
			.replace(v("collectionName"), str(name));
	}

	export function updateCollectionSmartQuery(collectionId: number, smartQuery: string | null): string {
		return sql(collectionUpdateSmartQuery)
			.replace(v("collectionId"), num(collectionId))
			.replace(v("collectionSmartQuery"), str(smartQuery));
	}

	export function queryCollectionById(collectionId: number): string {
		return sql(collectionById)
			.replace(v("collectionId"), num(collectionId));
	}

	export function queryAllCollectionsWithItemCount(): string {
		return sql(collectionsSelectAllWithItemCount);
	}

	export function updateCollectionParents(prevParentGroupId: number | null, newParentGroupId: number | null): string {
		return sql(collectionsUpdateParents)
			.replace(v("groupId"), num(newParentGroupId))
			.replace(v("prevGroupId"), eqNum(prevParentGroupId))
			.replace(vNull(), isNull());
	}

	export function updateCollectionParent(collectionId: number, newParentGroupId: number | null): string {
		return sql(collectionUpdateParent)
			.replace(v("collectionId"), num(collectionId))
			.replace(v("groupId"), num(newParentGroupId));
	}

	export function queryItemCountByQuery(query: string): string {
		return sql(itemsCountWithCustomQuery)
			.replace(v("query"), query);
	}

	export function queryItemCountTotal(): string {
		return sql(itemsCountTotal);
	}

	export function queryItemsByCustomQuery(query: string, attributeKeys?: string[]): string {
		if (attributeKeys) {
			return sql(itemsByCustomQueryWithAttribs)
				.replace(v("query"), query)
				.replace(v("attributeKeys"), strCsv(attributeKeys));
		} else {
			return sql(itemsByCustomQuery)
				.replace(v("query"), query);
		}
	}

	export function queryItemById(itemId: number): string {
		return sql(itemById)
			.replace(v("itemId"), num(itemId));
	}

	export function queryItemsByIds(itemIds: number[]): string {
		return sql(itemsByIds)
			.replace(v("itemIds"), numCsv(itemIds));
	}

	export function queryItemsByCollection(collectionId: number, attributeKeys: string[]): string {
		return sql(itemsByCollectionWithAttributes)
			.replace(v("collectionId"), num(collectionId))
			.replace(v("attributeKeys"), strCsv(attributeKeys));
	}

	export function queryItemsAll(attributeKeys: string[]): string {
		return sql(itemsAllWithAttributes)
			.replace(v("attributeKeys"), strCsv(attributeKeys));
	}


	export function insertItemsIntoCollection(collectionId: number, itemIds: number[]): string {
		const strEntries = itemIds.map(id => "(" + collectionId + "," + id + ")").join(", ");
		return sql(collectionItemsAdd)
			.replace(v("entries"), strEntries);
	}

	export function updateRemoveItemsFromCollection(collectionId: number, itemIds: number[]): string {
		return sql(collectionItemsRemove)
			.replace(v("collectionId"), num(collectionId))
			.replace(v("itemIds"), itemIds.join(","));
	}

	export function deleteItems(itemIds: number[]): string {
		return sql(itemsDelete)
			.replace(v("itemIds"), numCsv(itemIds));
	}

	export function insertItem(filepath: string, timestamp: number, hash: string, thumbnail: string): string {
		return sql(itemInsert)
			.replace(v("filepath"), str(filepath))
			.replace(v("timestamp"), num(timestamp))
			.replace(v("hash"), str(hash))
			.replace(v("thumbnail"), str(thumbnail));
	}

	export function deleteItemsFromCollections(itemIds: number[]): string {
		return sql(itemsDeleteFromCollections)
			.replace(v("itemIds"), numCsv(itemIds));
	}

	export function queryItemAttributes(itemId: number): string {
		return sql(itemAttributes)
			.replace(v("itemId"), num(itemId));
	}

	export function queryItemAttribute(itemId: number, attributeKey: string): string {
		return sql(itemAttribute)
			.replace(v("itemId"), num(itemId))
			.replace(v("key"), str(attributeKey));
	}

	export function updateItemAttribute(itemId: number, attributeKey: string, value: string): string {
		return sql(itemUpdateAttribute)
			.replace(v("itemId"), num(itemId))
			.replace(v("key"), str(attributeKey))
			.replace(v("value"), str(value));
	}

	export function insertItemAttributes(itemId: number, attributes: ({ key: string, value: string, type: string })[]): string {
		const entries: string[] = attributes.map(att => `("${att.key}", "${att.value}", "${att.type}", ${itemId})`)
		return sql(itemAttributesInsert)
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
	return !!value ? "'" + value + "'" : "null";
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


