export module ItemCommon {

	export interface Item {
		id: number,
		timestamp: number,
		filepath: string,
		sourceFilepath: string,
		hash: string,
		thumbnail: string,
		attributes?: Attribute[]
	}

	export type AttributeType = "text" | "number" | "boolean" | "date" | "list"

	export interface Attribute {
		key: string,
		value: string,
		type: AttributeType,
	}

	export function rowToItem(row: any | null): Item | null {
		if (row) {
			return {
				id: row.item_id,
				timestamp: row.timestamp_imported,
				filepath: row.filepath,
				sourceFilepath: row.filepath,
				hash: row.hash,
				thumbnail: row.thumbnail,
				attributes: concatAttributeColumnToEntries(row.attributes)
			};
		} else {
			return null;
		}
	}

	export function rowsToItems(rows: any[]): Item[] {
		return rows.map(row => rowToItem(row));
	}


	export function concatAttributeColumnToEntries(str: string): Attribute[] {
		if (str) {
			const regexGlobal: RegExp = /"(.+?)"="(.+?)"-"(.+?)"/g;
			const regex: RegExp = /"(.+?)"="(.+?)"-"(.+?)"/;
			return str.match(regexGlobal).map((strEntry: string) => {
				const strEntryParts: string[] = strEntry.match(regex);
				const entry: Attribute = {
					key: strEntryParts[1],
					value: strEntryParts[2],
					type: strEntryParts[3] as AttributeType
				};
				return entry;
			});
		} else {
			return [];
		}
	}

	export function rowToAttribute(row: any): Attribute {
		return {
			key: row.key,
			value: row.value,
			type: row.type
		};
	}

}