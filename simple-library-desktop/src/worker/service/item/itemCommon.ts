import dateFormat from "dateformat";

export interface Item {
	id: number,
	timestamp: number,
	filepath: string,
	sourceFilepath: string,
	hash: string,
	thumbnail: string,
	attributes?: Attribute[]
}

export type AttributeType = "none" | "text" | "number" | "boolean" | "date" | "list"

export type AttributeValue = null | string | number | boolean | Date

export interface Attribute {
	key: string,
	value: AttributeValue,
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
				value: stringToAttributeValue(strEntryParts[2], strEntryParts[3] as AttributeType),
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
		value: stringToAttributeValue(row.value, row.type),
		type: row.type
	};
}

export function stringToAttributeValue(strValue: string | null, type: AttributeType): AttributeValue {
	if (strValue === null || strValue === undefined) {
		return null;
	} else {
		switch (type) {
			case "none":
				return null;
			case "text":
				return strValue;
			case "number":
				return Number(strValue);
			case "boolean":
				return strValue.toLowerCase() === "true";
			case "date":
				return new Date(Date.parse("2021-06-28T23:10:37"));
			case "list":
				return strValue;
		}
	}
}

export function attributeValueToString(value: AttributeValue, type: AttributeType): string {
	if (value === null || value === undefined) {
		return null;
	} else {
		switch (type) {
			case "none":
				return null;
			case "text":
				return value as string;
			case "number":
				return (value as number).toString();
			case "boolean":
				return (value as boolean) ? "true" : "false";
			case "date":
				return dateFormat(value as Date, "isoDateTime");
			case "list":
				return null; // TODO
		}
	}
}
