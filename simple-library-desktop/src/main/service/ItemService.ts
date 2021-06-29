import {ItemDataAccess} from '../persistence/itemDataAccess';
import {
	Collection,
	CollectionType,
	ImportProcessData,
	ImportResult,
	ItemData,
	MetadataEntry
} from '../../common/commonModels';
import {ImportService} from './importprocess/importService';
import {CollectionDataAccess} from '../persistence/collectionDataAccess';
import {failedAsync, startAsyncWithValue} from '../../common/AsyncCommon';

const shell = require('electron').shell;

export class ItemService {

	importService: ImportService;
	itemDataAccess: ItemDataAccess;
	collectionDataAccess: CollectionDataAccess;


	constructor(importService: ImportService,
				itemDataAccess: ItemDataAccess,
				collectionDataAccess: CollectionDataAccess) {
		this.importService = importService;
		this.itemDataAccess = itemDataAccess;
		this.collectionDataAccess = collectionDataAccess;
	}

	/**
	 * Imports file(s) as specified in the given import process data
	 * @param data the data specifying what and how to import
	 * @return a promise that resolves with the result of the import process
	 */
	public importFiles(data: ImportProcessData): Promise<ImportResult> {
		return this.importService.importFiles(data);
	}


	/**
	 * Get all items in the given collection
	 * @param collectionId the id of the collection.
	 * @param itemAttributeKeys the keys of attributes to extract together with the items
	 * @return a promise that resolves with the items
	 */
	public async getAllItems(collectionId: number, itemAttributeKeys: string[]): Promise<ItemData[]> {
		const collection: Collection | null = await this.collectionDataAccess.findCollection(collectionId);

		if (!collection) {
			return failedAsync("Could not fetch items. Collection does not exist.");

		} else if (collection.type === CollectionType.SMART) {
			if (collection.smartQuery && collection.smartQuery.trim().length > 0) {
				return this.itemDataAccess.getItemsBySmartQuery(collection.smartQuery, itemAttributeKeys);
			} else {
				return this.itemDataAccess.getAllItems(undefined, itemAttributeKeys);
			}

		} else {
			return this.itemDataAccess.getAllItems(collectionId, itemAttributeKeys);
		}
	}

	/**
	 * Completely delete the items with the given ids
	 * @param itemIds the ids of the items to delete
	 */
	public deleteItems(itemIds: number[]): Promise<void> {
		return this.itemDataAccess.deleteItems(itemIds);
	}

	/**
	 * Fetch all metadata entries for the given item
	 * @param itemId the array of metadata entries (or an empty array)
	 */
	public getItemMetadata(itemId: number): Promise<MetadataEntry[]> {
		return this.itemDataAccess.getItemMetadata(itemId);
	}

	/**
	 * Open the given items with the system default application
	 * @param itemIds the ids of the items to open
	 */
	public openFilesExternal(itemIds: number[]): Promise<void> {
		return startAsyncWithValue(itemIds)
			.then((itemIds: number[]) => this.itemDataAccess.getItemsByIds(itemIds, []))
			.then((items: ItemData[]) => items.map((item: ItemData) => item.filepath))
			.then((paths: string[]) => Promise.all(paths.map(shell.openPath)).then())
	}

}
