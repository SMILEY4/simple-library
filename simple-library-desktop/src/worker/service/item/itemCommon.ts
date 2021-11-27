export interface Item {
	id: number,
	timestamp: number,
	filepath: string,
	sourceFilepath: string,
	hash: string,
	thumbnail: string,
	attributes?: Attribute[]
}


export interface MiniAttribute {
	attId: number | null,
	value: string | null,
}

export interface Attribute {
	attId: number | null,
	key: AttributeKey,
	value: string | null,
	type: string,
	writable: boolean,
	modified: boolean,
}

export interface ExtendedAttribute extends Attribute {
	itemId: number,
	filepath: string
}

export interface AttributeKey {
	id: string,
	name: string,
	g0: string,
	g1: string,
	g2: string,
}

export function attributeKeysEquals(a: AttributeKey, b: AttributeKey): boolean {
	return a.id === b.id && a.name === b.name && a.g0 === b.g0 && a.g1 === b.g1 && a.g2 === b.g2;
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
		const regexGlobal: RegExp = /"(.+?):(.+?):(.+?):(.+?):(.+?):(.+?)-(.+?)-(.+?)"="(.+?)"-"(.+?)"/g;
		const regex: RegExp = /"(.+?):(.+?):(.+?):(.+?):(.+?):(.+?)-(.+?)-(.+?)"="(.+?)"-"(.+?)"/;
		return str.match(regexGlobal).map((strEntry: string) => {
			const strEntryParts: string[] = strEntry.match(regex);
			const entry: Attribute = {
				attId: Number.parseInt(strEntryParts[1]),
				key: {
					id: strEntryParts[2],
					name: strEntryParts[3],
					g0: strEntryParts[4],
					g1: strEntryParts[5],
					g2: strEntryParts[6]
				},
				type: strEntryParts[7],
				writable: strEntryParts[8] == "1",
				value: strEntryParts[9],
				modified: strEntryParts[10] === "1"
			};
			return entry;
		});
	} else {
		return [];
	}
}


export function rowToAttribute(row: any): Attribute {
	return {
		attId: Number.parseInt(row.attId),
		key: {
			id: row.id,
			name: row.name,
			g0: row.g0,
			g1: row.g1,
			g2: row.g2
		},
		value: row.value,
		type: row.type,
		writable: row.writable === 1,
		modified: row.modified === 1
	};
}

export function rowToExtendedAttribute(row: any): ExtendedAttribute {
	return {
		attId: Number.parseInt(row.attId),
		key: {
			id: row.id,
			name: row.name,
			g0: row.g0,
			g1: row.g1,
			g2: row.g2
		},
		value: row.value,
		type: row.type,
		writable: row.writable === 1,
		modified: row.modified === 1,
		itemId: row.item_id,
		filepath: row.filepath
	};
}

export function rowsToAttributeKeys(rows: any[]): AttributeKey[] {
	return rows.map(row => rowToAttributeKey(row));
}


export function rowToAttributeKey(row: any): AttributeKey {
	return {
		id: row.id,
		name: row.name,
		g0: row.g0,
		g1: row.g1,
		g2: row.g2
	};
}

export function estimateSimpleTypeFromAttributeValue(value: string): string {
	if (value === null || value === undefined || value.trim().length === 0) {
		return "_unknown";
	}

	if (["true", "false"].indexOf(value.toLowerCase()) !== -1) {
		return "_boolean";
	}

	if (!!("" + value).match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/)) {
		return "_date";
	}

	if (!Number.isNaN(Number(value))) {
		return "_number";
	}

	return "_text";
}

