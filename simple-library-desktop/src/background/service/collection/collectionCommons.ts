export module CollectionCommons {

	export enum CollectionType {
		NORMAL = "normal",
		SMART = "smart"
	}

	export interface Collection {
		id: number,
		name: string,
		type: CollectionType
		smartQuery: string | null,
		itemCount: number | null,
		groupId: number | null
	}

	export function rowToCollection(row: any | null | undefined): Collection | null {
		if (row) {
			return {
				id: row.collection_id,
				name: row.collection_name,
				type: row.collection_type,
				smartQuery: (row.smart_query && row.smart_query.trim().length > 0) ? row.smart_query : null,
				groupId: row.group_id,
				itemCount: row.item_count ? row.item_count : null
			};
		} else {
			return null;
		}
	}

	export function rowsToCollections(rows: any[]): Collection[] {
		return rows.map(row => rowToCollection(row));
	}

}