import {DbAccess} from "../persistence/dbAcces";
import {MemDbAccess} from "./memDbAccess";
import {mockFileSystemWrapper} from "./mockSetup";
import {jest} from "@jest/globals";
import {Attribute, AttributeType, Item, ItemService} from "../service/itemService";
import {SQL} from "../persistence/sqlHandler";
import {FileSystemWrapper} from "../service/fileSystemWrapper";
import {ActionGetCollectionById} from "../service/collection/actionGetCollectionById";
import {ActionCreateLibrary} from "../service/library/actionCreateLibrary";

describe("item-service", () => {

	describe("get items", () => {

		test("get by normal collection without attributes", async () => {
			// given
			const [itemService, actionCreateLibrary, dbAccess] = mockItemService();
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
			const result: Promise<Item[]> = itemService.getByCollection(1, []);
			// then
			await expect(result).resolves.toEqual([
				item(1, "/path/to/file/1", "thumbnail1", "hash1", 1000, []),
				item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, []),
				item(3, "/path/to/file/3", "thumbnail3", "hash3", 1002, [])
			]);
		});


		test("get by normal collection", async () => {
			// given
			const [itemService, actionCreateLibrary, dbAccess] = mockItemService();
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
			const result: Promise<Item[]> = itemService.getByCollection(1, ["att1", "att3"]);
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
			const [itemService, actionCreateLibrary, dbAccess] = mockItemService();
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
			const result: Promise<Item[]> = itemService.getByCollection(2, ["att1", "att3"]);
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
			const [itemService, actionCreateLibrary, dbAccess] = mockItemService();
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
			const result: Promise<Item[]> = itemService.getByCollection(2, ["att1", "att3"]);
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
			const [itemService, actionCreateLibrary, dbAccess] = mockItemService();
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
			const result: Promise<Item[]> = itemService.getByCollection(42, ["att1", "att3"]);
			// then
			await expect(result).rejects.toBeDefined();
		});


		test("get by id", async () => {
			// given
			const [itemService, actionCreateLibrary, dbAccess] = mockItemService();
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
			const result: Promise<Item | null> = itemService.getById(2);
			// then
			await expect(result).resolves.toEqual(item(2, "/path/to/file/2", "thumbnail2", "hash2", 1001, []));
		});


		test("get by invalid id", async () => {
			// given
			const [itemService, actionCreateLibrary, dbAccess] = mockItemService();
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
			const result: Promise<Item | null> = itemService.getById(42);
			// then
			await expect(result).resolves.toBeNull();
		});

	});


	describe("delete items", () => {

		test("delete item", async () => {
			// given
			const [itemService, actionCreateLibrary, dbAccess] = mockItemService();
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
			const result: Promise<void> = itemService.delete([2, 3]);
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
			const [itemService, actionCreateLibrary, dbAccess] = mockItemService();
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
			const result: Promise<void> = itemService.delete([2, 100]);
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
			const [itemService, actionCreateLibrary, dbAccess, fsWrapper] = mockItemService();
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3])
			]);
			// when
			const result: Promise<void> = itemService.openExternal([1, 3]);
			// then
			await expect(result).resolves.toBeUndefined();
			expect(fsWrapper.open).toHaveBeenCalledTimes(2);
			expect(fsWrapper.open).toBeCalledWith("/path/to/file/1");
			expect(fsWrapper.open).toBeCalledWith("/path/to/file/3");
		});


		test("open non existing items", async () => {
			// given
			const [itemService, actionCreateLibrary, dbAccess, fsWrapper] = mockItemService();
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3])
			]);
			// when
			const result: Promise<void> = itemService.openExternal([1, 3, 15]);
			// then
			await expect(result).resolves.toBeUndefined();
			expect(fsWrapper.open).toHaveBeenCalledTimes(2);
			expect(fsWrapper.open).toBeCalledWith("/path/to/file/1");
			expect(fsWrapper.open).toBeCalledWith("/path/to/file/3");
		});

		test("open non existing file", async () => {
			// given
			const [itemService, actionCreateLibrary, dbAccess, fsWrapper] = mockItemService();
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
			const result: Promise<void> = itemService.openExternal([1, 3]);
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
			const [itemService, actionCreateLibrary, dbAccess] = mockItemService();
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
			const result: Promise<Attribute[]> = itemService.getAttributes(2);
			// then
			await expect(result).resolves.toEqual([
				attribute("att1", "value1", "text"),
				attribute("att2", "value2", "text"),
				attribute("att3b", "false", "boolean")
			]);
		});


		test("get item attributes for non existing item", async () => {
			// given
			const [itemService, actionCreateLibrary, dbAccess] = mockItemService();
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
			const result: Promise<Attribute[]> = itemService.getAttributes(100);
			// then
			await expect(result).rejects.toBeDefined();
		});

	});


	describe("update attribute", () => {

		test("update attribute", async () => {
			// given
			const [itemService, actionCreateLibrary, dbAccess] = mockItemService();
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
			const result: Promise<Attribute> = itemService.updateAttribute(1, "att2", "new value");
			// then
			await expect(result).resolves.toEqual(attribute("att2", "new value", "text"));
			await expect(itemService.getAttributes(1)).resolves.toEqual([
				attribute("att1", "value1", "text"),
				attribute("att2", "new value", "text"),
				attribute("att3a", "3", "number")
			]);
		});


		test("update attributes for non existing item", async () => {
			// given
			const [itemService, actionCreateLibrary, dbAccess] = mockItemService();
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
			const result: Promise<Attribute> = itemService.updateAttribute(100, "att2", "new value");
			// then
			await expect(result).rejects.toBeDefined();
			await expect(itemService.getAttributes(1)).resolves.toEqual([
				attribute("att1", "value1", "text"),
				attribute("att2", "value2", "text"),
				attribute("att3a", "3", "number")
			]);
		});


		test("update non existing attributes", async () => {
			// given
			const [itemService, actionCreateLibrary, dbAccess] = mockItemService();
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
			const result: Promise<Attribute> = itemService.updateAttribute(1, "invalid", "new value");
			// then
			await expect(result).rejects.toBeDefined();
			await expect(itemService.getAttributes(1)).resolves.toEqual([
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

function mockItemService(): [ItemService, ActionCreateLibrary, DbAccess, FileSystemWrapper] {
	const dbAccess = new MemDbAccess();
	const fsWrapper = mockFileSystemWrapper();
	fsWrapper.existsFile = jest.fn().mockReturnValue(false) as any;
	const actionCreateLibrary = new ActionCreateLibrary(dbAccess, fsWrapper);
	const itemService = new ItemService(dbAccess, new ActionGetCollectionById(dbAccess), fsWrapper);
	return [itemService, actionCreateLibrary, dbAccess, fsWrapper];
}