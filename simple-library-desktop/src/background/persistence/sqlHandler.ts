import metadataGetAll from "./sqlfiles/library/metadata_get_all.sql";
import metadataUpdateTimestampLastOpened from "./sqlfiles/library/metadata_update_timestamp_last_opened.sql";
import libraryInitialize from "./sqlfiles/library/library_initialize.sql";
import groupsSelectAll from "./sqlfiles/groups/groups_select_all.sql";
import groupsSelectById from "./sqlfiles/groups/groups_find_by_id.sql";
import groupInsert from "./sqlfiles/groups/groups_insert.sql";
import groupDelete from "./sqlfiles/groups/groups_delete.sql";
import groupUpdateParents from "./sqlfiles/groups/groups_update_parents.sql"
import groupUpdateParent from "./sqlfiles/groups/groups_update_parent_id.sql"
import collectionsSelectAll from "./sqlfiles/collections/collections_select_all.sql";
import collectionsSelectAllWithItemCount from "./sqlfiles/collections/collections_select_all_include_itemcount.sql";
import itemsCountWithCustomQuery from "./sqlfiles/items/items_count_with_custom_query.sql";
import itemsCountTotal from "./sqlfiles/items/items_count_total.sql";
import itemsByCustomQuery from "./sqlfiles/items/items_get_by_custom_filter.sql"
import collectionsUpdateParents from "./sqlfiles/collections/collections_update_parent_group.sql";
import collectionInsert from "./sqlfiles/collections/collections_insert.sql"
import collectionDelete from "./sqlfiles/collections/collections_delete.sql"
import collectionUpdateName from "./sqlfiles/collections/collections_update_name.sql";
import collectionUpdateSmartQuery from "./sqlfiles/collections/collections_update_smart_query.sql";
import collectionUpdateParent from "./sqlfiles/collections/collections_update_group_id.sql"
import collectionById from "./sqlfiles/collections/collections_find_by_id.sql"
import groupsUpdateName from "./sqlfiles/groups/groups_update_name.sql";
import collectionItemsAdd from "./sqlfiles/collection_items/collection_items_insert_multiple.sql"
import collectionItemsRemove from "./sqlfiles/collection_items/collection_items_delete_items_multiple.sql"

export module SQL {

    export function initializeNewLibrary(name: string, timestamp: number): string[] {
        return libraryInitialize
            .split(";")
            .filter((stmt: string) => /[a-zA-Z]/g.test(stmt))
            .map((stmt: string) => stmt
                .replace("$name", str(name))
                .replace("$timestamp", num(timestamp)));
    }

    export function queryLibraryInfo(): string {
        return metadataGetAll;
    }

    export function updateLibraryInfoTimestampLastOpened(timestamp: number): string {
        return metadataUpdateTimestampLastOpened
            .replace("$newTimestamp", num(timestamp));
    }

    export function queryAllGroups(): string {
        return groupsSelectAll;
    }

    export function queryGroupById(groupId: number): string {
        return groupsSelectById
            .replace("$groupId", num(groupId));
    }

    export function insertGroup(name: string, parentGroupId: number | null) {
        return groupInsert
            .replace("$groupName", str(name))
            .replace("$parentGroupId", num(parentGroupId));
    }

    export function deleteGroup(groupId: number) {
        return groupDelete
            .replace("$groupId", num(groupId));
    }

    export function updateGroupName(groupId: number, name: string): string {
        return groupsUpdateName
            .replace("$groupId", num(groupId))
            .replace("$groupName", str(name));
    }

    export function updateGroupParent(groupId: number, newParentGroupId: number | null): string {
        return groupUpdateParent
            .replace("$groupId", num(groupId))
            .replace("$parentGroupId", num(newParentGroupId));
    }

    export function updateGroupParents(prevParentGroupId: number | null, newParentGroupId: number | null) {
        return groupUpdateParents
            .replace("$prevParentGroupId", num(prevParentGroupId))
            .replace("$parentGroupId", num(newParentGroupId));
    }

    export function queryAllCollections(): string {
        return collectionsSelectAll;
    }

    export function insertCollection(name: string, type: string, parentGroupId: number | null, query: string): string {
        return collectionInsert
            .replace("$collectionName", str(name))
            .replace("$collectionType", str(type))
            .replace("$groupId", num(parentGroupId))
            .replace("$query", str(query))
    }

    export function deleteCollection(collectionId: number): string {
        return collectionDelete
            .replace("$collectionId", num(collectionId))
    }

    export function updateCollectionName(collectionId: number, name: string): string {
        return collectionUpdateName
            .replace("$collectionId", num(collectionId))
            .replace("$collectionName", str(name));
    }

    export function updateCollectionSmartQuery(collectionId: number, smartQuery: string | null): string {
        return collectionUpdateSmartQuery
            .replace("$collectionId", num(collectionId))
            .replace("$collectionName", str(name));
    }

    export function queryCollectionById(collectionId: number): string {
        return collectionById
            .replace("$collectionId", num(collectionId));
    }

    export function queryAllCollectionsWithItemCount(): string {
        return collectionsSelectAllWithItemCount;
    }

    export function updateCollectionParents(prevParentGroupId: number | null, newParentGroupId: number | null): string {
        return collectionsUpdateParents
            .replace("$groupId", num(newParentGroupId))
            .replace("$prevGroupId", num(prevParentGroupId));
    }

    export function updateCollectionParent(collectionId: number, newParentGroupId: number | null): string {
        return collectionUpdateParent
            .replace("$collectionId", num(collectionId))
            .replace("$groupId", num(newParentGroupId));
    }

    export function queryItemCountByQuery(query: string): string {
        return itemsCountWithCustomQuery
            .replace("$query", query);
    }

    export function queryItemCountTotal(): string {
        return itemsCountTotal;
    }

    export function queryItemByCustomQuery(query: string): string {
        return itemsByCustomQuery
            .replace("$query", query);
    }


    export function updateAddItemsToCollection(collectionId: number, itemIds: number[]): string {
        const strEntries = itemIds.map(id => "(" + collectionId + "," + id + ")").join(", ")
        return collectionItemsAdd
            .replace("$entries", strEntries);
    }

    export function updateRemoveItemsFromCollection(collectionId: number, itemIds: number[]): string {
        return collectionItemsRemove
            .replace("$collectionId", num(collectionId))
            .replace("$itemIds", itemIds.join(","))
    }


}

function str(value: any): string {
    return !!value ? "'" + value + "'" : "null";
}

function num(value: number): string {
    return !!value ? "" + value : "null";
}

