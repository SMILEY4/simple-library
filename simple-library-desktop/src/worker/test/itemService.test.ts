import {DbAccess} from "../persistence/dbAcces";
import {MemDbAccess} from "./memDbAccess";
import {mockAttributeMetadataProvider, mockFileSystemWrapper} from "./mockSetup";
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
import {Attribute, attributeKeyFromArray, Item} from "../service/item/itemCommon";
import {SQLiteDataRepository} from "../persistence/sqliteRepository";
import {DataRepository} from "../service/dataRepository";
import {ActionDeleteItemAttribute} from "../service/item/actionDeleteItemAttribute";

describe("item-service", () => {

	describe("get items", () => {

		test("get by normal collection without attributes", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(repository, new ActionGetCollectionById(repository));
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
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
				]),
				SQL.insertItemAttributes(2, [
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false)
				])
			]);
			// when
			const result: Promise<Item[]> = actionGetByCollection.perform(1, [], false);
			// then
			await expect(result).resolves.toEqual([
				item(1, "/path/to/file/1", "thumbnail1", "hash1", 1000, []),
				item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, []),
				item(3, "/path/to/file/3", "thumbnail3", "hash3", 1002, [])
			]);
		});


		test("get by normal collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(repository, new ActionGetCollectionById(repository));
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
					sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", true)
				]),
				SQL.insertItemAttributes(2, [
					sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false)
				])
			]);
			// when
			const requestedAttributeKeys = [attributeKeyFromArray(keyFileModifyDate()), attributeKeyFromArray(keyMIMEType())];
			const result: Promise<Item[]> = actionGetByCollection.perform(1, requestedAttributeKeys, false);
			// then
			await expect(result).resolves.toEqual([
				item(1, "/path/to/file/1", "thumbnail1", "hash1", 1000, [
					attribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false),
					attribute(keyMIMEType(), "image/jpeg", "_text", false, true)
				]),
				item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, [
					attribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false)
				]),
				item(3, "/path/to/file/3", "thumbnail3", "hash3", 1002)
			]);
		});


		test("get by normal collection include missing", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(repository, new ActionGetCollectionById(repository));
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
					sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", true)
				]),
				SQL.insertItemAttributes(2, [
					sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false)
				])
			]);
			// when
			const requestedAttributeKeys = [attributeKeyFromArray(keyFileModifyDate()), attributeKeyFromArray(keyMIMEType())];
			const result: Promise<Item[]> = actionGetByCollection.perform(1, requestedAttributeKeys, true);
			// then
			await expect(result).resolves.toEqual([
				item(1, "/path/to/file/1", "thumbnail1", "hash1", 1000, [
					attribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false),
					attribute(keyMIMEType(), "image/jpeg", "_text", false, true)
				]),
				item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, [
					attribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false),
					attribute(keyMIMEType(), null, "_unknown", false, false)
				]),
				item(3, "/path/to/file/3", "thumbnail3", "hash3", 1002, [
					attribute(keyFileModifyDate(), null, "_unknown", true, false),
					attribute(keyMIMEType(), null, "_unknown", false, false)
				])
			]);
		});

		test("get by smart collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(repository, new ActionGetCollectionById(repository));
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
					sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", true)
				]),
				SQL.insertItemAttributes(2, [
					sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false)
				])
			]);
			// when
			const requestedAttributeKeys = [attributeKeyFromArray(keyFileModifyDate()), attributeKeyFromArray(keyMIMEType())];
			const result: Promise<Item[]> = actionGetByCollection.perform(2, requestedAttributeKeys, false);
			// then
			await expect(result).resolves.toEqual([
				item(1, "/path/to/file/1", "thumbnail1", "hash1", 1000, [
					attribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false),
					attribute(keyMIMEType(), "image/jpeg", "_text", false, true)
				]),
				item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, [
					attribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false)
				])
			]);
		});


		test("get by smart collection with empty query", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(repository, new ActionGetCollectionById(repository));
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
					sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", true)
				]),
				SQL.insertItemAttributes(2, [
					sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false)
				])
			]);
			// when
			const requestedAttributeKeys = [attributeKeyFromArray(keyFileModifyDate()), attributeKeyFromArray(keyMIMEType())];
			const result: Promise<Item[]> = actionGetByCollection.perform(2, requestedAttributeKeys, false);
			// then
			await expect(result).resolves.toEqual([
				item(1, "/path/to/file/1", "thumbnail1", "hash1", 1000, [
					attribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false),
					attribute(keyMIMEType(), "image/jpeg", "_text", false, true)
				]),
				item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, [
					attribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false)
				]),
				item(3, "/path/to/file/3", "thumbnail3", "hash3", 1002, []),
				item(4, "/path/to/file/4", "thumbnail4", "hash4", 1003, [])
			]);
		});


		test("get by non-existing collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(repository, new ActionGetCollectionById(repository));
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
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
				]),
				SQL.insertItemAttributes(2, [
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false)
				])
			]);
			// when
			const requestedAttributeKeys = [attributeKeyFromArray(keyFileAccessDate()), attributeKeyFromArray(keyMIMEType())];
			const result: Promise<Item[]> = actionGetByCollection.perform(42, requestedAttributeKeys, false);
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
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
				]),
				SQL.insertItemAttributes(2, [
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false)
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
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
				]),
				SQL.insertItemAttributes(2, [
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false)
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
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
				]),
				SQL.insertItemAttributes(2, [
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false)
				])
			]);
			// when
			const result: Promise<void> = actionDelete.perform([2, 3]);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(dbAccess.queryAll(SQL.queryItemsAll([])).then((result => result.map(r => r.item_id)))).resolves.toEqual([1, 4]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [])).then((result => result.map(r => r.item_id)))).resolves.toEqual([1]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(2, [])).then((result => result.map(r => r.item_id)))).resolves.toEqual([4]);
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
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
				]),
				SQL.insertItemAttributes(2, [
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false)
				])
			]);
			// when
			const result: Promise<void> = actionDelete.perform([2, 100]);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(dbAccess.queryAll(SQL.queryItemsAll([])).then((result => result.map(r => r.item_id)))).resolves.toEqual([1, 3, 4]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [])).then((result => result.map(r => r.item_id)))).resolves.toEqual([1, 3]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(2, [])).then((result => result.map(r => r.item_id)))).resolves.toEqual([3, 4]);
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
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", true),
					sqlAttribute(keyFileExtension(), "jpg", "?", false),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
				]),
				SQL.insertItemAttributes(2, [
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", true),
					sqlAttribute(keyFileModifyDate(), "2021:10:12 21:00:12+02:00", "?", false)
				])
			]);
			// when
			const result: Promise<Attribute[]> = actionGetAttribs.perform(2, false);
			// then
			await expect(result).resolves.toEqual([
				attribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "_text", false, false),
				attribute(keyFileExtension(), "jpg", "_text", false, true),
				attribute(keyFileModifyDate(), "2021:10:12 21:00:12+02:00", "_text", true, false),
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
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", true),
					sqlAttribute(keyFileExtension(), "jpg", "?", false),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
				]),
				SQL.insertItemAttributes(2, [
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", true),
					sqlAttribute(keyFileModifyDate(), "2021:10:12 21:00:12+02:00", "?", false)
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
					sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
				])
			]);
			// when
			const updatedAttributeKey = attributeKeyFromArray(keyFileModifyDate());
			const result: Promise<Attribute> = actionUpdateAttrib.perform(1, updatedAttributeKey, "new value");
			// then
			await expect(result).resolves.toEqual(attribute(keyFileModifyDate(), "new value", "?", true, true));
			await expect(actionGetAttribs.perform(1, false)).resolves.toEqual([
				attribute(keyFileModifyDate(), "new value", "_text", true, true),
				attribute(keyFileExtension(), "jpg", "_text", false, false),
				attribute(keyMIMEType(), "image/jpeg", "_text", false, false)
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
					sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
				])
			]);
			// when
			const updatedAttributeKey = attributeKeyFromArray(keyFileModifyDate());
			const result: Promise<Attribute> = actionUpdateAttrib.perform(100, updatedAttributeKey, "new value");
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetAttribs.perform(1, false)).resolves.toEqual([
				attribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false),
				attribute(keyFileExtension(), "jpg", "_text", false, false),
				attribute(keyMIMEType(), "image/jpeg", "_text", false, false)
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
					sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", true),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
				])
			]);
			// when
			const updatedAttributeKey = attributeKeyFromArray(keyFileType());
			const result: Promise<Attribute> = actionUpdateAttrib.perform(1, updatedAttributeKey, "new value");
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetAttribs.perform(1, false)).resolves.toEqual([
				attribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "_text", true, false),
				attribute(keyFileExtension(), "jpg", "_text", false, true),
				attribute(keyMIMEType(), "image/jpeg", "_text", false, false)
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
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", false),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", true)
				]),
				SQL.insertItemAttributes(2, [
					sqlAttribute(keyFileExtension(), "jpg", "?", false)
				])
			]);
			// when
			const deleteAttributeKey = attributeKeyFromArray(keyFileExtension());
			const result: Promise<void> = actionDeleteAttrib.perform(1, deleteAttributeKey);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetAttribs.perform(1, false)).resolves.toEqual([
				attribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "_text", false, false),
				attribute(keyMIMEType(), "image/jpeg", "_text", false, true)
			]);
			await expect(actionGetAttribs.perform(2, false)).resolves.toEqual([
				attribute(keyFileExtension(), "jpg", "_text", false, false)
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
					sqlAttribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "?", false),
					sqlAttribute(keyFileExtension(), "jpg", "?", true),
					sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
				])
			]);
			// when
			const deleteAttributeKey = attributeKeyFromArray(keyFileModifyDate());
			const result: Promise<void> = actionDeleteAttrib.perform(1, deleteAttributeKey);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetAttribs.perform(1, false)).resolves.toEqual([
				attribute(keyFileAccessDate(), "2021:10:11 21:00:12+02:00", "_text", false, false),
				attribute(keyFileExtension(), "jpg", "_text", false, true),
				attribute(keyMIMEType(), "image/jpeg", "_text", false, false)
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

function sqlAttribute(key: [string, string, string, string, string], value: any, type: string, modified: boolean) {
	return {
		id: key[0],
		name: key[1],
		g0: key[2],
		g1: key[3],
		g2: key[4],
		value: value,
		type: type,
		modified: modified
	};
}


function attribute(key: [string, string, string, string, string], value: any, type: string, writable: boolean, modified: boolean): Attribute {
	return {
		key: attributeKeyFromArray(key),
		value: value,
		type: type,
		modified: modified,
		writable: writable
	};
}

function keyFileAccessDate(): [string, string, string, string, string] {
	return ["FileAccessDate", "FileAccessDate", "File", "System", "Time"];
}

function keyFileCreateDate(): [string, string, string, string, string] {
	return ["FileCreateDate", "FileCreateDate", "File", "System", "Time"];
}

function keyFileModifyDate(): [string, string, string, string, string] {
	return ["FileModifyDate", "FileModifyDate", "File", "System", "Time"];
}

function keyFileType(): [string, string, string, string, string] {
	return ["FileType", "FileType", "File", "File", "Other"];
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
