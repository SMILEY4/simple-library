import {AttributeKey} from "../item/itemCommon";
import {AttributeMetaDTO} from "../../../common/events/dtoModels";

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
	custom: boolean // TODO: set for all queries
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
		writable: row.writable === 1,
		custom: row.custom === 1,
	};
}

export interface DefaultAttributeValueEntry {
	attributeMeta: AttributeMeta,
	defaultValue: string,
	allowOverwrite: boolean
}

export function rowsToDefaultAttributeValueEntry(rows: any[]): DefaultAttributeValueEntry[] {
	return rows.map(row => rowToDefaultAttributeValueEntry(row));
}


export function rowToDefaultAttributeValueEntry(row: any): DefaultAttributeValueEntry {
	return {
		attributeMeta: rowToAttributeMeta(row),
		defaultValue: row.value,
		allowOverwrite: row.allowOverwrite === 1
	};
}
