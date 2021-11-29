import {DbAccess} from "../persistence/dbAcces";
import {MemDbAccess} from "./memDbAccess";
import {
	ATT_ID_FILE_ACCESS_DATE,
	ATT_ID_FILE_EXTENSION,
	ATT_ID_FILE_MODIFY_DATE,
	ATT_ID_FILE_TYPE,
	ATT_ID_MIME_TYPE,
	attFileAccessDate,
	attFileExtension,
	attFileModifyDate,
	attMIMEType,
	mockAttributeMetadataProvider,
	mockFileSystemWrapper
} from "./testUtils";
import {jest} from "@jest/globals";
import {SQL} from "../persistence/sqlHandler";
import {FileSystemWrapper} from "../service/fileSystemWrapper";
import {ActionCreateLibrary} from "../service/library/actionCreateLibrary";
import {ActionGetItemsByCollection} from "../service/item/actionGetItemsByCollection";
import {ActionGetCollectionById} from "../service/collection/actionGetCollectionById";
import {ActionGetItemById} from "../service/item/actionGetItemById";
import {ActionDeleteItems} from "../service/item/actionDeleteItems";
import {ActionOpenItemsExternal} from "../service/item/actionOpenItemsExternal";
import {ActionGetItemAttributes} from "../service/item/actionGetItemAttributes";
import {ActionUpdateItemAttribute} from "../service/item/actionUpdateItemAttribute";
import {Attribute, attributeKeyFromArray, Item, ItemPage} from "../service/item/itemCommon";
import {SQLiteDataRepository} from "../persistence/sqliteRepository";
import {DataRepository} from "../service/dataRepository";
import {ActionDeleteItemAttribute} from "../service/item/actionDeleteItemAttribute";
import {ActionGetHiddenAttributes} from "../service/library/actionGetHiddenAttributes";
import {ActionGetItemListAttributes} from "../service/library/actionGetItemListAttributes";
import {ItemPageDTO} from "../../common/events/dtoModels";

describe("item-service", () => {

	describe("get items", () => {

		test("get by normal collection without attributes", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(repository, new ActionGetCollectionById(repository), new ActionGetHiddenAttributes(repository), new ActionGetItemListAttributes(repository));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "smart", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3]),
				SQL.insertItemAttributes(1, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false),
					attMIMEType("image/jpeg", false)
				]),
				SQL.insertItemAttributes(2, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false)
				])
			]);
			// when
			const result: Promise<ItemPage> = actionGetByCollection.perform(1, false, true, 0, 999);
			// then
			await expect(result.then(p => p.items)).resolves.toEqual([
				item(1, "/path/to/file/1", "thumbnail1", "hash1", 1000, []),
				item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, []),
				item(3, "/path/to/file/3", "thumbnail3", "hash3", 1002, [])
			]);
		});


		test("get by normal collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(repository, new ActionGetCollectionById(repository), new ActionGetHiddenAttributes(repository), new ActionGetItemListAttributes(repository));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "smart", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3]),
				SQL.insertItemAttributes(1, [
					attFileModifyDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false),
					attMIMEType("image/jpeg", true)
				]),
				SQL.insertItemAttributes(2, [
					attFileModifyDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false)
				]),
				SQL.insertItemListAttributes([ATT_ID_FILE_MODIFY_DATE, ATT_ID_MIME_TYPE])
			]);
			// when
			const result: Promise<ItemPage> = actionGetByCollection.perform(1, false, true, 0, 999);
			// then
			await expect(result.then(p => p.items)).resolves.toEqual([
				item(1, "/path/to/file/1", "thumbnail1", "hash1", 1000, [
					attribute(ATT_ID_FILE_MODIFY_DATE, keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false, 0),
					attribute(ATT_ID_MIME_TYPE, keyMIMEType(), "image/jpeg", "_text", false, true, 1)
				]),
				item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, [
					attribute(ATT_ID_FILE_MODIFY_DATE, keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false, 0)
				]),
				item(3, "/path/to/file/3", "thumbnail3", "hash3", 1002)
			]);
		});


		test("get by normal collection include missing", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(repository, new ActionGetCollectionById(repository), new ActionGetHiddenAttributes(repository), new ActionGetItemListAttributes(repository));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "smart", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3]),
				SQL.insertItemAttributes(1, [
					attFileModifyDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false),
					attMIMEType("image/jpeg", true)
				]),
				SQL.insertItemAttributes(2, [
					attFileModifyDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false)
				]),
				SQL.insertItemListAttributes([ATT_ID_FILE_MODIFY_DATE, ATT_ID_MIME_TYPE])
			]);
			// when
			const result: Promise<ItemPage> = actionGetByCollection.perform(1, true, true, 0, 999);
			// then
			await expect(result.then(p => p.items)).resolves.toEqual([
				item(1, "/path/to/file/1", "thumbnail1", "hash1", 1000, [
					attribute(ATT_ID_FILE_MODIFY_DATE, keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false, 0),
					attribute(ATT_ID_MIME_TYPE, keyMIMEType(), "image/jpeg", "_text", false, true, 1)
				]),
				item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, [
					attribute(ATT_ID_FILE_MODIFY_DATE, keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false, 0),
					attribute(ATT_ID_MIME_TYPE, keyMIMEType(), null, "_unknown", false, false, 1)
				]),
				item(3, "/path/to/file/3", "thumbnail3", "hash3", 1002, [
					attribute(ATT_ID_FILE_MODIFY_DATE, keyFileModifyDate(), null, "_unknown", true, false, 0),
					attribute(ATT_ID_MIME_TYPE, keyMIMEType(), null, "_unknown", false, false, 1)
				])
			]);
		});

		test("get by smart collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(repository, new ActionGetCollectionById(repository), new ActionGetHiddenAttributes(repository), new ActionGetItemListAttributes(repository));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "smart", null, "items.item_id <= 2"),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3]),
				SQL.insertItemAttributes(1, [
					attFileModifyDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false),
					attMIMEType("image/jpeg", true)
				]),
				SQL.insertItemAttributes(2, [
					attFileModifyDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false)
				]),
				SQL.insertItemListAttributes([ATT_ID_FILE_MODIFY_DATE, ATT_ID_MIME_TYPE])
			]);
			// when
			const result: Promise<ItemPage> = actionGetByCollection.perform(2, false, true, 0, 999);
			// then
			await expect(result.then(p => p.items)).resolves.toEqual([
				item(1, "/path/to/file/1", "thumbnail1", "hash1", 1000, [
					attribute(ATT_ID_FILE_MODIFY_DATE, keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false, 0),
					attribute(ATT_ID_MIME_TYPE, keyMIMEType(), "image/jpeg", "_text", false, true, 1)
				]),
				item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, [
					attribute(ATT_ID_FILE_MODIFY_DATE, keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false, 0)
				])
			]);
		});


		test("get by smart collection with empty query", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(repository, new ActionGetCollectionById(repository), new ActionGetHiddenAttributes(repository), new ActionGetItemListAttributes(repository));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "smart", null, ""),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3]),
				SQL.insertItemAttributes(1, [
					attFileModifyDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false),
					attMIMEType("image/jpeg", true)
				]),
				SQL.insertItemAttributes(2, [
					attFileModifyDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false)
				]),
				SQL.insertItemListAttributes([ATT_ID_FILE_MODIFY_DATE, ATT_ID_MIME_TYPE])
			]);
			// when
			const result: Promise<ItemPage> = actionGetByCollection.perform(2, false, true, 0, 999);
			// then
			await expect(result.then(p => p.items)).resolves.toEqual([
				item(1, "/path/to/file/1", "thumbnail1", "hash1", 1000, [
					attribute(ATT_ID_FILE_MODIFY_DATE, keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false, 0),
					attribute(ATT_ID_MIME_TYPE, keyMIMEType(), "image/jpeg", "_text", false, true, 1)
				]),
				item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, [
					attribute(ATT_ID_FILE_MODIFY_DATE, keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false, 0)
				]),
				item(3, "/path/to/file/3", "thumbnail3", "hash3", 1002, []),
				item(4, "/path/to/file/4", "thumbnail4", "hash4", 1003, [])
			]);
		});


		test("get by non-existing collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(repository, new ActionGetCollectionById(repository), new ActionGetHiddenAttributes(repository), new ActionGetItemListAttributes(repository));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "smart", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3]),
				SQL.insertItemAttributes(1, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false),
					attMIMEType("image/jpeg", false)
				]),
				SQL.insertItemAttributes(2, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false)
				]),
				SQL.insertItemListAttributes([ATT_ID_FILE_ACCESS_DATE, ATT_ID_MIME_TYPE])
			]);
			// when
			const result: Promise<ItemPage> = actionGetByCollection.perform(42, false, true, 0, 999);
			// then
			await expect(result).rejects.toBeDefined();
		});


		test("get by id", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionGetById = new ActionGetItemById(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItemAttributes(1, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false),
					attMIMEType("image/jpeg", false)
				]),
				SQL.insertItemAttributes(2, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false)
				])
			]);
			// when
			const result: Promise<Item | null> = actionGetById.perform(2);
			// then
			await expect(result).resolves.toEqual(item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, []));
		});


		test("get by invalid id", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionGetById = new ActionGetItemById(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItemAttributes(1, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false),
					attMIMEType("image/jpeg", false)
				]),
				SQL.insertItemAttributes(2, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false)
				])
			]);
			// when
			const result: Promise<Item | null> = actionGetById.perform(42);
			// then
			await expect(result).resolves.toBeNull();
		});

	});


	describe("delete items", () => {

		test("delete item", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionDelete = new ActionDeleteItems(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3]),
				SQL.insertItemsIntoCollection(2, [3, 4]),
				SQL.insertItemAttributes(1, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false),
					attMIMEType("image/jpeg", false)
				]),
				SQL.insertItemAttributes(2, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false)
				])
			]);
			// when
			const result: Promise<void> = actionDelete.perform([2, 3]);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(dbAccess.queryAll(SQL.queryItemsAll([], 0, 999)).then((result => result.map(r => r.item_id)))).resolves.toEqual([1, 4]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [], 0, 999)).then((result => result.map(r => r.item_id)))).resolves.toEqual([1]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(2, [], 0, 999)).then((result => result.map(r => r.item_id)))).resolves.toEqual([4]);
			await expect(dbAccess.queryAll(SQL.queryItemAttributes(1, true))).resolves.toHaveLength(3);
			await expect(dbAccess.queryAll(SQL.queryItemAttributes(2, true))).resolves.toEqual([]);
			await expect(dbAccess.queryAll(SQL.queryItemAttributes(3, true))).resolves.toEqual([]);
		});


		test("delete non-existing item", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionDelete = new ActionDeleteItems(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3]),
				SQL.insertItemsIntoCollection(2, [3, 4]),
				SQL.insertItemAttributes(1, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false),
					attMIMEType("image/jpeg", false)
				]),
				SQL.insertItemAttributes(2, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false)
				])
			]);
			// when
			const result: Promise<void> = actionDelete.perform([2, 100]);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(dbAccess.queryAll(SQL.queryItemsAll([], 0, 999)).then((result => result.map(r => r.item_id)))).resolves.toEqual([1, 3, 4]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [], 0, 999)).then((result => result.map(r => r.item_id)))).resolves.toEqual([1, 3]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(2, [], 0, 999)).then((result => result.map(r => r.item_id)))).resolves.toEqual([3, 4]);
			await expect(dbAccess.queryAll(SQL.queryItemAttributes(1, true))).resolves.toHaveLength(3);
			await expect(dbAccess.queryAll(SQL.queryItemAttributes(2, true))).resolves.toEqual([]);
			await expect(dbAccess.queryAll(SQL.queryItemAttributes(3, true))).resolves.toEqual([]);
		});

	});


	describe("open with external app", () => {

		test("open items", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess, fsWrapper] = mockItemService();
			const actionOpen = new ActionOpenItemsExternal(repository, fsWrapper);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3])
			]);
			// when
			const result: Promise<void> = actionOpen.perform([1, 3]);
			// then
			await expect(result).resolves.toBeUndefined();
			expect(fsWrapper.open).toHaveBeenCalledTimes(2);
			expect(fsWrapper.open).toBeCalledWith("/path/to/file/1");
			expect(fsWrapper.open).toBeCalledWith("/path/to/file/3");
		});


		test("open non existing items", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess, fsWrapper] = mockItemService();
			const actionOpen = new ActionOpenItemsExternal(repository, fsWrapper);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3])
			]);
			// when
			const result: Promise<void> = actionOpen.perform([1, 3, 15]);
			// then
			await expect(result).resolves.toBeUndefined();
			expect(fsWrapper.open).toHaveBeenCalledTimes(2);
			expect(fsWrapper.open).toBeCalledWith("/path/to/file/1");
			expect(fsWrapper.open).toBeCalledWith("/path/to/file/3");
		});

		test("open non existing file", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess, fsWrapper] = mockItemService();
			const actionOpen = new ActionOpenItemsExternal(repository, fsWrapper);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("does/not/exist", 1002, "hash3", "thumbnail3"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3])
			]);
			fsWrapper["open"] = jest.fn().mockImplementation((path) => path === "does/not/exist" ? Promise.reject("Err") : Promise.resolve()) as any;
			// when
			const result: Promise<void> = actionOpen.perform([1, 3]);
			// then
			await expect(result).rejects.toBeDefined();
			expect(fsWrapper.open).toHaveBeenCalledTimes(2);
			expect(fsWrapper.open).toBeCalledWith("/path/to/file/1");
			expect(fsWrapper.open).toBeCalledWith("does/not/exist");
		});

	});


	describe("get attributes", () => {

		test("get item attributes", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionGetAttribs = new ActionGetItemAttributes(repository, new ActionGetItemById(repository));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItemAttributes(1, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", true),
					attFileExtension("jpg", false),
					attMIMEType("image/jpeg", false)
				]),
				SQL.insertItemAttributes(2, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", true),
					attFileModifyDate("2021:10:12 21:00:12+02:00", false)
				])
			]);
			// when
			const result: Promise<Attribute[]> = actionGetAttribs.perform(2, false);
			// then
			await expect(result).resolves.toEqual([
				attribute(ATT_ID_FILE_ACCESS_DATE, keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "_text", false, false),
				attribute(ATT_ID_FILE_EXTENSION, keyFileExtension(), "jpg", "_text", false, true),
				attribute(ATT_ID_FILE_MODIFY_DATE, keyFileModifyDate(), "2021:10:12 21:00:12+02:00", "_text", true, false)
			]);
		});


		test("get item attributes for non existing item", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionGetAttribs = new ActionGetItemAttributes(repository, new ActionGetItemById(repository));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItemAttributes(1, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", true),
					attFileExtension("jpg", false),
					attMIMEType("image/jpeg", false)
				]),
				SQL.insertItemAttributes(2, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", true),
					attFileModifyDate("2021:10:12 21:00:12+02:00", false)
				])
			]);
			// when
			const result: Promise<Attribute[]> = actionGetAttribs.perform(100, false);
			// then
			await expect(result).rejects.toBeDefined();
		});

	});


	describe("update attribute", () => {

		test("update attribute", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionUpdateAttrib = new ActionUpdateItemAttribute(repository);
			const actionGetAttribs = new ActionGetItemAttributes(repository, new ActionGetItemById(repository));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItemAttributes(1, [
					attFileModifyDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false),
					attMIMEType("image/jpeg", false)
				])
			]);
			// when
			const result: Promise<Attribute> = actionUpdateAttrib.perform(1, ATT_ID_FILE_MODIFY_DATE, "new value");
			// then
			await expect(result).resolves.toEqual({
				attId: ATT_ID_FILE_MODIFY_DATE,
				key: {
					id: "FileModifyDate",
					name: "FileModifyDate",
					g0: "File",
					g1: "System",
					g2: "Time"
				},
				value: "new value",
				type: "?",
				writable: true,
				modified: true
			});
			await expect(actionGetAttribs.perform(1, false)).resolves.toEqual([
				attribute(ATT_ID_FILE_MODIFY_DATE, keyFileModifyDate(), "new value", "_text", true, true),
				attribute(ATT_ID_FILE_EXTENSION, keyFileExtension(), "jpg", "_text", false, false),
				attribute(ATT_ID_MIME_TYPE, keyMIMEType(), "image/jpeg", "_text", false, false)
			]);
		});


		test("update attributes for non existing item", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionUpdateAttrib = new ActionUpdateItemAttribute(repository);
			const actionGetAttribs = new ActionGetItemAttributes(repository, new ActionGetItemById(repository));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItemAttributes(1, [
					attFileModifyDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false),
					attMIMEType("image/jpeg", false)
				])
			]);
			// when
			const result: Promise<Attribute> = actionUpdateAttrib.perform(100, ATT_ID_FILE_MODIFY_DATE, "new value");
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetAttribs.perform(1, false)).resolves.toEqual([
				attribute(ATT_ID_FILE_MODIFY_DATE, keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false),
				attribute(ATT_ID_FILE_EXTENSION, keyFileExtension(), "jpg", "_text", false, false),
				attribute(ATT_ID_MIME_TYPE, keyMIMEType(), "image/jpeg", "_text", false, false)
			]);
		});


		test("update non existing attributes", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionUpdateAttrib = new ActionUpdateItemAttribute(repository);
			const actionGetAttribs = new ActionGetItemAttributes(repository, new ActionGetItemById(repository));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItemAttributes(1, [
					attFileModifyDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", true),
					attMIMEType("image/jpeg", false)
				])
			]);
			// when
			const result: Promise<Attribute> = actionUpdateAttrib.perform(1, ATT_ID_FILE_TYPE, "new value");
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetAttribs.perform(1, false)).resolves.toEqual([
				attribute(ATT_ID_FILE_MODIFY_DATE, keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false),
				attribute(ATT_ID_FILE_EXTENSION, keyFileExtension(), "jpg", "_text", false, true),
				attribute(ATT_ID_MIME_TYPE, keyMIMEType(), "image/jpeg", "_text", false, false)
			]);
		});

	});


	describe("delete attribute", () => {

		test("delete attribute", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionDeleteAttrib = new ActionDeleteItemAttribute(repository);
			const actionGetAttribs = new ActionGetItemAttributes(repository, new ActionGetItemById(repository));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 2000, "hash2", "thumbnail2"),
				SQL.insertItemAttributes(1, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", false),
					attMIMEType("image/jpeg", true)
				]),
				SQL.insertItemAttributes(2, [
					attFileExtension("jpg", false)
				])
			]);
			// when
			const result: Promise<void> = actionDeleteAttrib.perform(1, ATT_ID_FILE_EXTENSION);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetAttribs.perform(1, false)).resolves.toEqual([
				attribute(ATT_ID_FILE_ACCESS_DATE, keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "_text", false, false),
				attribute(ATT_ID_MIME_TYPE, keyMIMEType(), "image/jpeg", "_text", false, true)
			]);
			await expect(actionGetAttribs.perform(2, false)).resolves.toEqual([
				attribute(ATT_ID_FILE_EXTENSION, keyFileExtension(), "jpg", "_text", false, false)
			]);
		});


		test("delete not existing attribute", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionDeleteAttrib = new ActionDeleteItemAttribute(repository);
			const actionGetAttribs = new ActionGetItemAttributes(repository, new ActionGetItemById(repository));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItemAttributes(1, [
					attFileAccessDate("2021:10:11 21:00:12+02:00", false),
					attFileExtension("jpg", true),
					attMIMEType("image/jpeg", false)
				])
			]);
			// when
			const result: Promise<void> = actionDeleteAttrib.perform(1, ATT_ID_FILE_MODIFY_DATE);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetAttribs.perform(1, false)).resolves.toEqual([
				attribute(ATT_ID_FILE_ACCESS_DATE, keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "_text", false, false),
				attribute(ATT_ID_FILE_EXTENSION, keyFileExtension(), "jpg", "_text", false, true),
				attribute(ATT_ID_MIME_TYPE, keyMIMEType(), "image/jpeg", "_text", false, false)
			]);
		});

	});

});


function item(id: number, path: string, thumbnail: string, hash: string, timestamp: number, attributes?: Attribute[]) {
	return {
		attributes: attributes ? attributes : [],
		id: id,
		filepath: path,
		sourceFilepath: path,
		thumbnail: thumbnail,
		hash: hash,
		timestamp: timestamp
	};
}


function attribute(attId: number, key: [string, string, string, string, string], value: any, type: string, writable: boolean, modified: boolean, orderIndex?: number): Attribute {
	if(orderIndex !== undefined) {
		return {
			attId: attId,
			key: attributeKeyFromArray(key),
			value: value,
			type: type,
			modified: modified,
			writable: writable,
			orderIndex: orderIndex
		};
	} else {
		return {
			attId: attId,
			key: attributeKeyFromArray(key),
			value: value,
			type: type,
			modified: modified,
			writable: writable
		};
	}
}

function keyFileAccessDate(): [string, string, string, string, string] {
	return ["FileAccessDate", "FileAccessDate", "File", "System", "Time"];
}

function keyFileModifyDate(): [string, string, string, string, string] {
	return ["FileModifyDate", "FileModifyDate", "File", "System", "Time"];
}

function keyFileExtension(): [string, string, string, string, string] {
	return ["FileTypeExtension", "FileTypeExtension", "File", "File", "Other"];
}

function keyMIMEType(): [string, string, string, string, string] {
	return ["MIMEType", "MIMEType", "File", "File", "Other"];
}

function mockItemService(): [ActionCreateLibrary, DataRepository, DbAccess, FileSystemWrapper] {
	const dbAccess = new MemDbAccess();
	const fsWrapper = mockFileSystemWrapper();
	fsWrapper.existsFile = jest.fn().mockReturnValue(false) as any;
	const actionCreateLibrary = new ActionCreateLibrary(new SQLiteDataRepository(dbAccess), fsWrapper, mockAttributeMetadataProvider(true));
	return [actionCreateLibrary, new SQLiteDataRepository(dbAccess), dbAccess, fsWrapper];
}
