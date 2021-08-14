import {DbAccess} from "../persistence/dbAcces";
import {MemDbAccess} from "./memDbAccess";
import {mockFileSystemWrapper} from "./mockSetup";
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
import {Attribute, AttributeType, Item} from "../service/item/itemCommon";

describe("item-service", () => {

	describe("get items", () => {

		test("get by normal collection without attributes", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(dbAccess, new ActionGetCollectionById(dbAccess));
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
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"},
					{key: "att3", value: "3", type: "number"}
				]),
				SQL.insertItemAttributes(2, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"}
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
			const [actionCreateLibrary, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(dbAccess, new ActionGetCollectionById(dbAccess));
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
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"},
					{key: "att3", value: "3", type: "number"}
				]),
				SQL.insertItemAttributes(2, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"}
				])
			]);
			// when
			const result: Promise<Item[]> = actionGetByCollection.perform(1, ["att1", "att3"], false);
			// then
			await expect(result).resolves.toEqual([
				item(1, "/path/to/file/1", "thumbnail1", "hash1", 1000, [
					attribute("att1", "value1", "text"),
					attribute("att3", "3", "number")
				]),
				item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, [
					attribute("att1", "value1", "text")
				]),
				item(3, "/path/to/file/3", "thumbnail3", "hash3", 1002)
			]);
		});


		test("get by smart collection", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(dbAccess, new ActionGetCollectionById(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "smart", null, "item_id <= 2"),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3]),
				SQL.insertItemAttributes(1, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"},
					{key: "att3", value: "3", type: "number"}
				]),
				SQL.insertItemAttributes(2, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"}
				])
			]);
			// when
			const result: Promise<Item[]> = actionGetByCollection.perform(2, ["att1", "att3"], false);
			// then
			await expect(result).resolves.toEqual([
				item(1, "/path/to/file/1", "thumbnail1", "hash1", 1000, [
					attribute("att1", "value1", "text"),
					attribute("att3", "3", "number")
				]),
				item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, [
					attribute("att1", "value1", "text")
				])
			]);
		});


		test("get by smart collection with empty query", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(dbAccess, new ActionGetCollectionById(dbAccess));
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
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"},
					{key: "att3", value: "3", type: "number"}
				]),
				SQL.insertItemAttributes(2, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"}
				])
			]);
			// when
			const result: Promise<Item[]> = actionGetByCollection.perform(2, ["att1", "att3"], false);
			// then
			await expect(result).resolves.toEqual([
				item(1, "/path/to/file/1", "thumbnail1", "hash1", 1000, [
					attribute("att1", "value1", "text"),
					attribute("att3", "3", "number")
				]),
				item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, [
					attribute("att1", "value1", "text")
				]),
				item(3, "/path/to/file/3", "thumbnail3", "hash3", 1002, []),
				item(4, "/path/to/file/4", "thumbnail4", "hash4", 1003, [])
			]);
		});


		test("get by non-existing collection", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockItemService();
			const actionGetByCollection = new ActionGetItemsByCollection(dbAccess, new ActionGetCollectionById(dbAccess));
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
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"},
					{key: "att3", value: "3", type: "number"}
				]),
				SQL.insertItemAttributes(2, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"}
				])
			]);
			// when
			const result: Promise<Item[]> = actionGetByCollection.perform(42, ["att1", "att3"], false);
			// then
			await expect(result).rejects.toBeDefined();
		});


		test("get by id", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockItemService();
			const actionGetById = new ActionGetItemById(dbAccess);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItemAttributes(1, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"},
					{key: "att3", value: "3", type: "number"}
				]),
				SQL.insertItemAttributes(2, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"}
				])
			]);
			// when
			const result: Promise<Item | null> = actionGetById.perform(2);
			// then
			await expect(result).resolves.toEqual(item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, []));
		});


		test("get by invalid id", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockItemService();
			const actionGetById = new ActionGetItemById(dbAccess);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItemAttributes(1, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"},
					{key: "att3", value: "3", type: "number"}
				]),
				SQL.insertItemAttributes(2, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"}
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
			const [actionCreateLibrary, dbAccess] = mockItemService();
			const actionDelete = new ActionDeleteItems(dbAccess);
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
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"},
					{key: "att3", value: "3", type: "number"}
				]),
				SQL.insertItemAttributes(2, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"}
				])
			]);
			// when
			const result: Promise<void> = actionDelete.perform([2, 3]);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(dbAccess.queryAll(SQL.queryItemsAll([])).then((result => result.map(r => r.item_id)))).resolves.toEqual([1, 4]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [])).then((result => result.map(r => r.item_id)))).resolves.toEqual([1]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(2, [])).then((result => result.map(r => r.item_id)))).resolves.toEqual([4]);
			await expect(dbAccess.queryAll(SQL.queryItemAttributes(1))).resolves.toHaveLength(3);
			await expect(dbAccess.queryAll(SQL.queryItemAttributes(2))).resolves.toEqual([]);
			await expect(dbAccess.queryAll(SQL.queryItemAttributes(3))).resolves.toEqual([]);
		});


		test("delete non-existing item", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockItemService();
			const actionDelete = new ActionDeleteItems(dbAccess);
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
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"},
					{key: "att3", value: "3", type: "number"}
				]),
				SQL.insertItemAttributes(2, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"}
				])
			]);
			// when
			const result: Promise<void> = actionDelete.perform([2, 100]);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(dbAccess.queryAll(SQL.queryItemsAll([])).then((result => result.map(r => r.item_id)))).resolves.toEqual([1, 3, 4]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [])).then((result => result.map(r => r.item_id)))).resolves.toEqual([1, 3]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(2, [])).then((result => result.map(r => r.item_id)))).resolves.toEqual([3, 4]);
			await expect(dbAccess.queryAll(SQL.queryItemAttributes(1))).resolves.toHaveLength(3);
			await expect(dbAccess.queryAll(SQL.queryItemAttributes(2))).resolves.toEqual([]);
			await expect(dbAccess.queryAll(SQL.queryItemAttributes(3))).resolves.toEqual([]);
		});

	});


	describe("open with external app", () => {

		test("open items", async () => {
			// given
			const [actionCreateLibrary, dbAccess, fsWrapper] = mockItemService();
			const actionOpen = new ActionOpenItemsExternal(dbAccess, fsWrapper);
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
			const [actionCreateLibrary, dbAccess, fsWrapper] = mockItemService();
			const actionOpen = new ActionOpenItemsExternal(dbAccess, fsWrapper);
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
			const [actionCreateLibrary, dbAccess, fsWrapper] = mockItemService();
			const actionOpen = new ActionOpenItemsExternal(dbAccess, fsWrapper);
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
			const [actionCreateLibrary, dbAccess] = mockItemService();
			const actionGetAttribs = new ActionGetItemAttributes(dbAccess, new ActionGetItemById(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItemAttributes(1, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"},
					{key: "att3a", value: "3", type: "number"}
				]),
				SQL.insertItemAttributes(2, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"},
					{key: "att3b", value: "false", type: "boolean"}
				])
			]);
			// when
			const result: Promise<Attribute[]> = actionGetAttribs.perform(2);
			// then
			await expect(result).resolves.toEqual([
				attribute("att1", "value1", "text"),
				attribute("att2", "value2", "text"),
				attribute("att3b", "false", "boolean")
			]);
		});


		test("get item attributes for non existing item", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockItemService();
			const actionGetAttribs = new ActionGetItemAttributes(dbAccess, new ActionGetItemById(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItemAttributes(1, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"},
					{key: "att3a", value: "3", type: "number"}
				]),
				SQL.insertItemAttributes(2, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"},
					{key: "att3b", value: "false", type: "boolean"}
				])
			]);
			// when
			const result: Promise<Attribute[]> = actionGetAttribs.perform(100);
			// then
			await expect(result).rejects.toBeDefined();
		});

	});


	describe("update attribute", () => {

		test("update attribute", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockItemService();
			const actionUpdateAttrib = new ActionUpdateItemAttribute(dbAccess);
			const actionGetAttribs = new ActionGetItemAttributes(dbAccess, new ActionGetItemById(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItemAttributes(1, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"},
					{key: "att3a", value: "3", type: "number"}
				])
			]);
			// when
			const result: Promise<Attribute> = actionUpdateAttrib.perform(1, "att2", "new value");
			// then
			await expect(result).resolves.toEqual(attribute("att2", "new value", "text"));
			await expect(actionGetAttribs.perform(1)).resolves.toEqual([
				attribute("att1", "value1", "text"),
				attribute("att2", "new value", "text"),
				attribute("att3a", "3", "number")
			]);
		});


		test("update attributes for non existing item", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockItemService();
			const actionUpdateAttrib = new ActionUpdateItemAttribute(dbAccess);
			const actionGetAttribs = new ActionGetItemAttributes(dbAccess, new ActionGetItemById(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItemAttributes(1, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"},
					{key: "att3a", value: "3", type: "number"}
				])
			]);
			// when
			const result: Promise<Attribute> = actionUpdateAttrib.perform(100, "att2", "new value");
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetAttribs.perform(1)).resolves.toEqual([
				attribute("att1", "value1", "text"),
				attribute("att2", "value2", "text"),
				attribute("att3a", "3", "number")
			]);
		});


		test("update non existing attributes", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockItemService();
			const actionUpdateAttrib = new ActionUpdateItemAttribute(dbAccess);
			const actionGetAttribs = new ActionGetItemAttributes(dbAccess, new ActionGetItemById(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItemAttributes(1, [
					{key: "att1", value: "value1", type: "text"},
					{key: "att2", value: "value2", type: "text"},
					{key: "att3a", value: "3", type: "number"}
				])
			]);
			// when
			const result: Promise<Attribute> = actionUpdateAttrib.perform(1, "invalid", "new value");
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetAttribs.perform(1)).resolves.toEqual([
				attribute("att1", "value1", "text"),
				attribute("att2", "value2", "text"),
				attribute("att3a", "3", "number")
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

function attribute(key: string, value: string, type: AttributeType) {
	return {
		key: key,
		value: value,
		type: type
	};
}

function mockItemService(): [ActionCreateLibrary, DbAccess, FileSystemWrapper] {
	const dbAccess = new MemDbAccess();
	const fsWrapper = mockFileSystemWrapper();
	fsWrapper.existsFile = jest.fn().mockReturnValue(false) as any;
	const actionCreateLibrary = new ActionCreateLibrary(dbAccess, fsWrapper);
	return [actionCreateLibrary, dbAccess, fsWrapper];
}
