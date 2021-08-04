import {CollectionCommons} from "../collection/collectionCommons";

export module GroupCommons {

	export interface Group {
		id: number,
		name: string,
		parentGroupId: number | null,
		collections: CollectionCommons.Collection[]
		children: Group[],
	}

	export function rowToMinGroup(row: any): Group | null {
		if (row) {
			return {
				id: row.group_id,
				name: row.name,
				parentGroupId: row.parent_group_id ? row.parent_group_id : null,
				collections: [],
				children: []
			};
		} else {
			return null;
		}
	}

}