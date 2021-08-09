import {Collection} from "../collection/collectionCommons";

export interface Group {
	id: number,
	name: string,
	parentGroupId: number | null,
	collections: Collection[]
	children: Group[],
}

export function rowToMinGroup(row: any | null): Group | null {
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

export function rowsToMinGroups(rows: any[]): Group[] {
	return rows.map(row => rowToMinGroup(row));
}