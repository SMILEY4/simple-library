import groupsCreateTable from "./sql/groups_create_table.sql";
import groupsSelectAll from "./sql/groups_select_all.sql";

import collectionItemsCreateTable from "./sql/collection_items_create_table.sql";
import collectionItemsInsert from "./sql/collection_items_insert.sql";
import collectionItemsDeleteCollection from "./sql/collection_items_delete_collection.sql";
import collectionItemsDeleteItem from "./sql/collection_items_delete_item.sql";

import collectionsCreateTable from "./sql/collections_create_table.sql";
import collectionsSelectAll from "./sql/collections_select_all.sql";
import collectionsSelectAllItemCount from "./sql/collections_select_all_include_itemcount.sql";
import collectionsInsert from "./sql/collections_insert.sql";
import collectionsDelete from "./sql/collections_delete.sql";
import collectionsUpdateName from "./sql/collections_update_name.sql";

import itemsCreateTable from "./sql/items_create_table.sql";
import itemsInsert from "./sql/items_insert.sql";
import itemsGetAll from "./sql/items_get_all.sql";
import itemsGetByCollection from "./sql/items_get_by_collection.sql";
import itemsCount from "./sql/items_count.sql";

import metadataCreateTable from "./sql/metadata_create_table.sql";
import metadataGetAll from "./sql/metadata_get_all.sql";
import metadataGetLibraryName from "./sql/metadata_get_library_name.sql";
import metadataInsertLibraryName from "./sql/metadata_insert_library_name.sql";
import metadataInsertTimestampCreated from "./sql/metadata_insert_timestamp_created.sql";
import metadataInsertTimestampLastOpened from "./sql/metadata_insert_timestamp_last_opened.sql";
import metadataUpdateTimestampLastOpened from "./sql/metadata_update_timestamp_last_opened.sql";

//==================//
//     GROUPS       //
//==================//

export function sqlCreateTableGroups(): string {
    return groupsCreateTable;
}

export function sqlAllGroups(): string {
    return groupsSelectAll;
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

export function sqlInsertCollection(name: string) {
    return collectionsInsert
        .replace("$collectionName", "'" + name + "'");
}

export function sqlDeleteCollection(collectionId: number) {
    return collectionsDelete
        .replace("$collectionId", collectionId);
}

export function sqlDeleteCollectionItems(collectionId: number) {
    return collectionItemsDeleteCollection
        .replace("$collectionId", collectionId);
}

export function sqlUpdateCollection(collectionId: number, name: string) {
    return collectionsUpdateName
        .replace("$collectionName", "'" + name + "'")
        .replace("$collectionId", collectionId);
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

export function sqlRemoveItemFromCollection(collectionId: number, itemId: number) {
    return collectionItemsDeleteItem
        .replace("$collectionId", collectionId)
        .replace("$itemId", itemId);
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

export function sqlGetItemsInCollection(collectionId: number | undefined) {
    if (collectionId) {
        return itemsGetByCollection
            .replace("$collectionId", collectionId);
    } else {
        return itemsGetAll;
    }
}

export function sqlCountItems(): string {
    return itemsCount;
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

