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
	key: AttributeKey,
	value: AttributeValue,
	type: string,
	modified: boolean,
}

export interface AttributeKey {
	id: string,
	name: string,
	g0: string,
	g1: string,
	g2: string,
}

export function attributeKey(id: string, name: string, g0: string, g1: string, g2: string): AttributeKey {
	return {
		id: id,
		name: name,
		g0: g0,
		g1: g1,
		g2: g2
	};
}

export function attributeKeyFromArray(keyParts: string[]): AttributeKey {
	if (keyParts.length !== 5) {
		return null;
	} else {
		return {
			id: keyParts[0],
			name: keyParts[1],
			g0: keyParts[2],
			g1: keyParts[3],
			g2: keyParts[4]
		};
	}
}

export function packAttributeKey(key: AttributeKey): [string, string, string, string, string,] {
	return [key.id, key.name, key.g0, key.g1, key.g2];
}


export function rowsToItems(rows: any[]): Item[] {
	return rows.map(row => rowToItem(row));
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
			attributes: concatAttributeColumnToEntries(row.csv_attributes)
		};
	} else {
		return null;
	}
}


export function concatAttributeColumnToEntries(str: string): Attribute[] {
	if (str) {
		const regexGlobal: RegExp = /"(.+?):(.+?):(.+?):(.+?):(.+?)-(.+?)"="(.+?)"-"(.+?)"/g;
		const regex: RegExp = /"(.+?):(.+?):(.+?):(.+?):(.+?)-(.+?)"="(.+?)"-"(.+?)"/;
		return str.match(regexGlobal).map((strEntry: string) => {
			const strEntryParts: string[] = strEntry.match(regex);
			const entry: Attribute = {
				key: {
					id: strEntryParts[1],
					name: strEntryParts[2],
					g0: strEntryParts[3],
					g1: strEntryParts[4],
					g2: strEntryParts[5]
				},
				type: strEntryParts[6],
				value: strEntryParts[7], // TODO
				modified: strEntryParts[8] === "1"
			};
			return entry;
		});
	} else {
		return [];
	}
}

export function rowToAttribute(row: any): Attribute {
	return {
		key: {
			id: row.id,
			name: row.name,
			g0: row.g0,
			g1: row.g1,
			g2: row.g2
		},
		value: row.value, // TODO
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