import {AttributeKey} from "../item/itemCommon";

export interface LibraryFileHandle {
	path: string,
	name: string,
}

export interface LibraryInformation {
	name: string,
	timestampCreated: number,
	timestampLastOpened: number,
}

export interface AttributeMeta {
	attId: number | null,
	key: AttributeKey,
	type: string,
	writable: boolean,
}

export function rowsToAttributeMeta(rows: any[]): AttributeMeta[] {
	return rows.map(row => rowToAttributeMeta(row));
}


export function rowToAttributeMeta(row: any): AttributeMeta {
	return {
		attId: Number.parseInt(row.att_id),
		key: {
			id: row.id,
			name: row.name,
			g0: row.g0,
			g1: row.g1,
			g2: row.g2
		},
		type: row.type,
		writable: row.writable === 1
	};
}

// export interface AttributeMeta {
// 	attId: number | null,
// 	name: string,
// 	id: string,
// 	g0: string,
// 	g1: string,
// 	g2: string
// }
//
// export function rowsToAttributeMetas(rows: any[]): AttributeMeta[] {
// 	return rows.map(row => rowToAttributeMeta(row));
// }
//
//
// export function rowToAttributeMeta(row: any | null): AttributeMeta | null {
// 	if (row) {
// 		return {
// 			attId: row.attId,
// 			name: row.name,
// 			id: row.id,
// 			g0: row.g0,
// 			g1: row.g1,
// 			g2: row.g2
// 		};
// 	} else {
// 		return null;
// 	}
// }