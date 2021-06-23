import groupsCreateTable from "./groups/groups_create_table.sql";
import groupsSelectAll from "./groups/groups_select_all.sql";
import groupsFindById from "./groups/groups_find_by_id.sql";
import groupsInsert from "./groups/groups_insert.sql";
import groupsDelete from "./groups/groups_delete.sql";
import groupsUpdateName from "./groups/groups_update_name.sql";
import groupsUpdateParents from "./groups/groups_update_parents.sql";
import groupsUpdateParentId from "./groups/groups_update_parent_id.sql";

import collectionItemsCreateTable from "./collection_items/collection_items_create_table.sql";
import collectionItemsInsert from "./collection_items/collection_items_insert.sql";
import collectionItemsInsertMultiple from "./collection_items/collection_items_insert_multiple.sql";
import collectionItemsDeleteCollection from "./collection_items/collection_items_delete_collection.sql";
import collectionItemsDeleteItem from "./collection_items/collection_items_delete_item.sql";
import collectionItemsDeleteItemsMultiple from "./collection_items/collection_items_delete_items_multiple.sql";
import collectionItemsCountWithCollectionId from "./collection_items/items_count_with_collection_id.sql";

import collectionsCreateTable from "./collections/collections_create_table.sql";
import collectionsSelectAll from "./collections/collections_select_all.sql";
import collectionsSelectAllItemCount from "./collections/collections_select_all_include_itemcount.sql";
import collectionsInsert from "./collections/collections_insert.sql";
import collectionsDelete from "./collections/collections_delete.sql";
import collectionsUpdateName from "./collections/collections_update_name.sql";
import collectionsUpdateSmartQuery from "./collections/collections_update_smart_query.sql";
import collectionsUpdateParents from "./collections/collections_update_parent_group.sql";
import collectionsUpdateGroupId from "./collections/collections_update_group_id.sql";
import collectionsFindById from "./collections/collections_find_by_id.sql";


import itemsCreateTable from "./items/items_create_table.sql";
import itemsInsert from "./items/items_insert.sql";
import itemsGetAll from "./items/items_get_all.sql";
import itemsGetByCollection from "./items/items_get_by_collection.sql";
import itemsGetByCustomFilter from "./items/items_get_by_custom_filter.sql";
import itemsCountWithCustomQuery from "./items/items_count_with_custom_query.sql";
import itemsCountTotal from "./items/items_count_total.sql";

import metadataCreateTable from "./metadata/metadata_create_table.sql";
import metadataGetAll from "./metadata/metadata_get_all.sql";
import metadataGetLibraryName from "./metadata/metadata_get_library_name.sql";
import metadataInsertLibraryName from "./metadata/metadata_insert_library_name.sql";
import metadataInsertTimestampCreated from "./metadata/metadata_insert_timestamp_created.sql";
import metadataInsertTimestampLastOpened from "./metadata/metadata_insert_timestamp_last_opened.sql";
import metadataUpdateTimestampLastOpened from "./metadata/metadata_update_timestamp_last_opened.sql";

//==================//
//     GROUPS       //
//==================//

export function sqlCreateTableGroups(): string {
	return groupsCreateTable;
}

export function sqlAllGroups(): string {
	return groupsSelectAll;
}

export function sqlFindGroupById(groupId: number): string {
	return groupsFindById
		.replace("$groupId", groupId);

}

export function sqlInsertGroup(name: string, parentGroup: number | null): string {
	return groupsInsert
		.replace("$groupName", "'" + name + "'")
		.replace("$parentGroupId", parentGroup);
}

export function sqlDeleteGroup(groupId: number): string {
	return groupsDelete
		.replace("$groupId", groupId);
}

export function sqlUpdateGroupName(groupId: number, name: string): string {
	return groupsUpdateName
		.replace("$groupId", groupId)
		.replace("$groupName", "'" + name + "'");
}

export function sqlUpdateGroupsParents(prevParentGroupId: number | null, parentGroupId: number | null): string {
	return groupsUpdateParents
		.replace("$prevParentGroupId", prevParentGroupId)
		.replace("$parentGroupId", parentGroupId);
}

export function sqlUpdateGroupsParentId(groupId: number, parentGroupId: number | null): string {
	return groupsUpdateParentId
		.replace("$groupId", groupId)
		.replace("$parentGroupId", parentGroupId);
}


//==================//
//   COLLECTIONS    //
//==================//

export function sqlCreateTableCollections(): string {
	return collectionsCreateTable;
}

export function sqlAllCollections(includeItemCount: boolean) {
	if (includeItemCount) {
		return collectionsSelectAllItemCount;
	} else {
		return collectionsSelectAll;
	}
}

export function sqlFindCollectionById(collectionId: number): string {
	return collectionsFindById
		.replace("$collectionId", collectionId);
}

export function sqlInsertCollection(name: string, type: string, smartQuery: string | null, groupId: number | null) {
	return collectionsInsert
		.replace("$collectionName", "'" + name + "'")
		.replace("$collectionType", "'" + type + "'")
		.replace("$smartQuery", smartQuery ? "'" + smartQuery + "'" : null)
		.replace("$groupId", groupId);
}

export function sqlDeleteCollection(collectionId: number) {
	return collectionsDelete
		.replace("$collectionId", collectionId);
}

export function sqlDeleteCollectionItems(collectionId: number) {
	return collectionItemsDeleteCollection
		.replace("$collectionId", collectionId);
}

export function sqlUpdateCollectionName(collectionId: number, name: string) {
	return collectionsUpdateName
		.replace("$collectionName", "'" + name + "'")
		.replace("$collectionId", collectionId);
}

export function sqlUpdateCollectionSmartQuery(collectionId: number, smartQuery: string) {
	return collectionsUpdateSmartQuery
		.replace("$collectionSmartQuery", smartQuery ? "'" + smartQuery + "'" : "null")
		.replace("$collectionId", collectionId);
}


export function sqlUpdateCollectionsParents(prevParentGroupId: number | null, newParentGroupId: number | null) {
	return collectionsUpdateParents
		.replace("$groupId", newParentGroupId)
		.replace("$prevGroupId", prevParentGroupId);
}

export function sqlUpdateCollectionsGroupId(collectionId: number, groupId: number | null) {
	return collectionsUpdateGroupId
		.replace("$collectionId", collectionId)
		.replace("$groupId", groupId);
}


//==================//
// COLLECTION_ITEMS //
//==================//

export function sqlCreateTableCollectionItems(): string {
	return collectionItemsCreateTable;
}

export function sqlAddItemToCollection(collectionId: number, itemId: number) {
	return collectionItemsInsert
		.replace("$collectionId", collectionId)
		.replace("$itemId", itemId);
}

export function sqlAddItemsToCollection(collectionId: number, itemIds: number[]) {
	const entriesString = itemIds.map(id => "(" + collectionId + "," + id + ")").join(", ")
	return collectionItemsInsertMultiple
		.replace("$entries", entriesString);
}

export function sqlRemoveItemFromCollection(collectionId: number, itemId: number) {
	return collectionItemsDeleteItem
		.replace("$collectionId", collectionId)
		.replace("$itemId", itemId);
}

export function sqlRemoveItemsFromCollection(collectionId: number, itemIds: number[]) {
	return collectionItemsDeleteItemsMultiple
		.replace("$collectionId", collectionId)
		.replace("$itemIds", itemIds.join(","));
}

export function sqlCountItemsWithCollectionId(collectionId: number): string {
	return collectionItemsCountWithCollectionId
		.replace("$collectionId", collectionId);
}


//==================//
//      ITEMS       //
//==================//

export function sqlCreateTableItems(): string {
	return itemsCreateTable;
}

export function sqlInsertItem(filepath: string, timestamp: number, hash: string, thumbnail: string) {
	return itemsInsert
		.replace("$filepath", "'" + filepath + "'")
		.replace("$timestamp", timestamp)
		.replace("$hash", "'" + hash + "'")
		.replace("$thumbnail", "'" + thumbnail + "'");
}

export function sqlGetItemsInCollection(collectionId: number) {
	if (collectionId) {
		return itemsGetByCollection
			.replace("$collectionId", collectionId);
	} else {
		return itemsGetAll;
	}
}

export function sqlGetItemsByCustomFilter(query: string) {
	return itemsGetByCustomFilter
		.replace("$query", query);
}

export function sqlCountItemsWithCustomFilter(query: string): string {
	return itemsCountWithCustomQuery
		.replace("$query", query);
}

export function sqlGetItemsCountTotal() {
	return itemsCountTotal;
}

//==================//
//     LIBRARY      //
//==================//

export function sqlCreateTableMetadata(): string {
	return metadataCreateTable;
}

export function sqlInsertMetadataLibraryName(name: string): string {
	return metadataInsertLibraryName
		.replace("$name", "'" + name + "'");
}

export function sqlInsertMetadataTimestampCreated(timestamp: number): string {
	return metadataInsertTimestampCreated
		.replace("$timestamp", timestamp);
}

export function sqlInsertMetadataTimestampLastOpened(timestamp: number): string {
	return metadataInsertTimestampLastOpened
		.replace("$timestamp", timestamp);
}

export function sqlUpdateMetadataTimestampLastOpened(newTimestamp: number): string {
	return metadataUpdateTimestampLastOpened
		.replace("$newTimestamp", newTimestamp);
}

export function sqlGetMetadataLibraryName(): string {
	return metadataGetLibraryName;
}

export function sqlAllMetadata(): string {
	return metadataGetAll;
}

