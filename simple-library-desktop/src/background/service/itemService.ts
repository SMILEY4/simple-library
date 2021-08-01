import {DbAccess} from "../persistence/dbAcces";
import {SQL} from "../persistence/sqlHandler";
import {Collection, CollectionService, CollectionType} from "./collectionService";
import {voidThen} from "../../common/AsyncCommon";
import {FileSystemWrapper} from "./fileSystemWrapper";

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

export class ItemService {

	private readonly dbAccess: DbAccess;
	private readonly collectionService: CollectionService;
	private readonly fsWrapper: FileSystemWrapper;


	constructor(dbAccess: DbAccess, collectionService: CollectionService, fsWrapper: FileSystemWrapper) {
		this.dbAccess = dbAccess;
		this.collectionService = collectionService;
		this.fsWrapper = fsWrapper;
	}

	/**
	 * Get all items of the given collection (with the attributes of the given keys)
	 */
	public getByCollection(collectionId: number, attributeKeys: string[]): Promise<Item[]> {
		return this.collectionService.getById(collectionId)
			.then((collection: Collection | null) => {
				if (!collection) {
					throw "Cant fetch items: collection with id " + collectionId + " not found";
				} else {
					return collection;
				}
			})
			.then((collection: Collection) => {
				switch (collection.type) {
					case CollectionType.NORMAL: {
						return this.dbAccess.queryAll(SQL.queryItemsByCollection(collectionId, attributeKeys));
					}
					case CollectionType.SMART: {
						if (collection.smartQuery && collection.smartQuery.length > 0) {
							return this.dbAccess.queryAll(SQL.queryItemsByCustomQuery(collection.smartQuery, attributeKeys));
						} else {
							return this.dbAccess.queryAll(SQL.queryItemsAll(attributeKeys));
						}
					}
					default: {
						throw "Unexpected collection type: " + collection.type;
					}
				}
			})
			.then((rows: any[]) => {
				return rows.map(ItemService.rowToItem);
			});
	}

	/**
	 * Get the item with the given id
	 */
	public getById(itemId: number): Promise<Item | null> {
		return this.dbAccess.querySingle(SQL.queryItemById(itemId))
			.then((row: any | null) => row ? ItemService.rowToItem(row) : null);
	}

	/**
	 * Complete/Permanently delete the items with the given ids.
	 */
	public delete(itemIds: number[]): Promise<void> {
		return this.dbAccess.runMultiple([
			SQL.deleteItems(itemIds),
			SQL.deleteItemsFromCollections(itemIds)
		]).then(voidThen);
	}

	/**
	 * Open the given items with the system default application.
	 */
	public openExternal(itemIds: number[]): Promise<void> {
		return this.dbAccess.queryAll(SQL.queryItemsByIds(itemIds))
			.then((rows: any) => rows.map(ItemService.rowToItem))
			.then((items: Item[]) => items.map((item: Item) => item.filepath))
			.then((paths: string[]) => Promise.all(paths.map(p => this.fsWrapper.open(p))))
			.then(voidThen);
	}

	/**
	 * Get all attributes of the given item
	 */
	public getAttributes(itemId: number): Promise<Attribute[]> {
		return this.getById(itemId)
			.then((item: Item | null) => item ? item : Promise.reject("Item with id " + itemId + " not found"))
			.then(() => this.dbAccess.queryAll(SQL.queryItemAttributes(itemId)))
			.then((rows: any[]) => rows.map(row => ItemService.rowToAttribute(row)));
	}

	/**
	 * Updates the existing attribute of the given item to the given value
	 */
	public updateAttribute(itemId: number, attributeKey: string, newValue: string): Promise<Attribute> {
		return this.dbAccess.querySingle(SQL.queryItemAttribute(itemId, attributeKey))
			.then((row: any | null) => {
				if (!row) {
					throw "No attribute with key " + attributeKey + " found for item with id " + itemId;
				} else {
					return ItemService.rowToAttribute(row);
				}
			})
			.then((attrib: Attribute) => this.dbAccess.run(SQL.updateItemAttribute(itemId, attributeKey, newValue))
				.then(() => ({
					key: attrib.key,
					value: newValue,
					type: attrib.type
				}))
			);
	}

	private static rowToItem(row: any): Item {
		return {
			id: row.item_id,
			timestamp: row.timestamp_imported,
			filepath: row.filepath,
			sourceFilepath: row.filepath,
			hash: row.hash,
			thumbnail: row.thumbnail,
			attributes: ItemService.concatAttributeColumnToEntries(row.attributes)
		};
	}

	private static concatAttributeColumnToEntries(str: string): Attribute[] {
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

	private static rowToAttribute(row: any): Attribute {
		return {
			key: row.key,
			value: row.value,
			type: row.type
		};
	}

}
