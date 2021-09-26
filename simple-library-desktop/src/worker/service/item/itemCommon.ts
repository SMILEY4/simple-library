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

export type AttributeValue = null | string | number | boolean | Date | string[]

export interface Attribute {
	key: string,
	value: AttributeValue,
	type: AttributeType,
	modified: boolean,
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
	console.log("    ROWS: ", rows)
	return rows.map(row => rowToItem(row));
}

export function concatAttributeColumnToEntries(str: string): Attribute[] {
	if (str) {
		const regexGlobal: RegExp = /"(.+?)"="(.+?)"-"(.+?)"-"(.+?)"/g;
		const regex: RegExp = /"(.+?)"="(.+?)"-"(.+?)"-"(.+?)"/;
		return str.match(regexGlobal).map((strEntry: string) => {
			const strEntryParts: string[] = strEntry.match(regex);
			const entry: Attribute = {
				key: strEntryParts[1],
				value: stringToAttributeValue(strEntryParts[2], strEntryParts[3] as AttributeType),
				type: strEntryParts[3] as AttributeType,
				modified: strEntryParts[4] === "1"
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
		type: row.type,
		modified: row.modified === 1
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
				return new Date(Date.parse(strValue));
			case "list":
				return strValue.split(";");
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
				return dateToString(value as Date);
			case "list":
				return (value as string[]).join(";");
		}
	}
}

export function valueToAttributeType(value: any): AttributeType {
	if (value === null || value === undefined) {
		return "none";
	}
	const isISODate = !!("" + value).match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/);
	if (isISODate) {
		return "date";
	}
	switch (typeof (value)) {
		case "string":
			return "text";
		case "number":
			return "number";
		case "boolean":
			return "boolean";
	}
	return "text";
}

function dateToString(date: Date): string {
	return date.getFullYear() + "-"
		+ twoDigits(date.getMonth() + 1) + "-"
		+ twoDigits(date.getDate()) + "T"
		+ twoDigits(date.getHours()) + ":"
		+ twoDigits(date.getMinutes()) + ":"
		+ twoDigits(date.getSeconds());
}

function twoDigits(value: number): string {
	return (value < 10 ? "0" : "") + value;
}