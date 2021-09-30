import {MemDbAccess} from "./memDbAccess";
import {mockConfigAccess, mockExiftoolProcess, mockFileSystemWrapper} from "./mockSetup";
import {ActionEmbedItemAttributes} from "../service/item/actionEmbedItemAttributes";
import {SQLiteDataRepository} from "../persistence/sqliteRepository";
import {ActionGetExiftoolInfo} from "../service/config/actionGetExiftoolInfo";
import {ActionCreateLibrary} from "../service/library/actionCreateLibrary";
import {DbAccess} from "../persistence/dbAcces";
import {SQL} from "../persistence/sqlHandler";
import {jest} from "@jest/globals";
import {ExifHandler} from "../service/exifHandler";
import {FileSystemWrapper} from "../service/fileSystemWrapper";

describe("embed attributes", () => {

	test("embed all attributes of all items", async () => {
		// given
		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction();
		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
			SQL.insertItemAttributes(1, [
				{key: "att1", value: "value1", type: "text", modified: false},
				{key: "att2", value: "value2", type: "text", modified: true},
				{key: "att3", value: "3", type: "number", modified: true}
			]),
			SQL.insertItemAttributes(2, [
				{key: "att1", value: "e1;e2;e3", type: "list", modified: false},
				{key: "att2", value: "value2", type: "text", modified: false}
			]),
			SQL.insertItemAttributes(3, [
				{key: "att4", value: "true", type: "boolean", modified: true}
			])
		]);
		fsWrapper.existsFile = jest.fn().mockReturnValue(true) as any;
		// when
		const result: Promise<void> = actionEmbed.perform(null, true);
		// then
		await expect(result).resolves.toBeUndefined();
		expect(funcWriteMetadata).toHaveBeenCalledTimes(3);
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/1", {
			att1: "value1",
			att2: "value2",
			att3: 3
		}, expect.anything());
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(2, "/path/to/file/2", {
			att1: ["e1", "e2", "e3"],
			att2: "value2"
		}, expect.anything());
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(3, "/path/to/file/3", {
			att4: true
		}, expect.anything());
	});

	test("embed modified attributes of all items", async () => {
		// given
		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction();
		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
			SQL.insertItemAttributes(1, [
				{key: "att1", value: "value1", type: "text", modified: false},
				{key: "att2", value: "value2", type: "text", modified: true},
				{key: "att3", value: "3", type: "number", modified: true}
			]),
			SQL.insertItemAttributes(2, [
				{key: "att1", value: "e1;e2;e3", type: "list", modified: false},
				{key: "att2", value: "value2", type: "text", modified: false}
			]),
			SQL.insertItemAttributes(3, [
				{key: "att4", value: "true", type: "boolean", modified: true}
			])
		]);
		fsWrapper.existsFile = jest.fn().mockReturnValue(true) as any;
		// when
		const result: Promise<void> = actionEmbed.perform(null, false);
		// then
		await expect(result).resolves.toBeUndefined();
		expect(funcWriteMetadata).toHaveBeenCalledTimes(2);
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/1", {
			att2: "value2",
			att3: 3
		}, expect.anything());
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(2, "/path/to/file/3", {
			att4: true
		}, expect.anything());
	});

	test("embed all attributes of given items", async () => {
		// given
		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction();
		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
			SQL.insertItemAttributes(1, [
				{key: "att1", value: "value1", type: "text", modified: false},
				{key: "att2", value: "value2", type: "text", modified: true},
				{key: "att3", value: "3", type: "number", modified: true}
			]),
			SQL.insertItemAttributes(2, [
				{key: "att1", value: "e1;e2;e3", type: "list", modified: false},
				{key: "att2", value: "value2", type: "text", modified: false}
			]),
			SQL.insertItemAttributes(3, [
				{key: "att4", value: "true", type: "boolean", modified: true}
			])
		]);
		fsWrapper.existsFile = jest.fn().mockReturnValue(true) as any;
		// when
		const result: Promise<void> = actionEmbed.perform([1, 2], true);
		// then
		await expect(result).resolves.toBeUndefined();
		expect(funcWriteMetadata).toHaveBeenCalledTimes(2);
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/1", {
			att1: "value1",
			att2: "value2",
			att3: 3
		}, expect.anything());
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(2, "/path/to/file/2", {
			att1: ["e1", "e2", "e3"],
			att2: "value2"
		}, expect.anything());
	});

	test("embed modified attributes of given items", async () => {
		// given
		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction();
		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
			SQL.insertItemAttributes(1, [
				{key: "att1", value: "value1", type: "text", modified: false},
				{key: "att2", value: "value2", type: "text", modified: true},
				{key: "att3", value: "3", type: "number", modified: true}
			]),
			SQL.insertItemAttributes(2, [
				{key: "att1", value: "e1;e2;e3", type: "list", modified: false},
				{key: "att2", value: "value2", type: "text", modified: false}
			]),
			SQL.insertItemAttributes(3, [
				{key: "att4", value: "true", type: "boolean", modified: true}
			])
		]);
		fsWrapper.existsFile = jest.fn().mockReturnValue(true) as any;
		// when
		const result: Promise<void> = actionEmbed.perform([1, 2], false);
		// then
		await expect(result).resolves.toBeUndefined();
		expect(funcWriteMetadata).toHaveBeenCalledTimes(1);
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/1", {
			att2: "value2",
			att3: 3
		}, expect.anything());
	});

	test("embed attributes missing files", async () => {
		// given
		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction();
		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItem("/path/to/file/missing", 1001, "hash2", "thumbnail2"),
			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
			SQL.insertItemAttributes(1, [
				{key: "att1", value: "value1", type: "text", modified: false},
				{key: "att2", value: "value2", type: "text", modified: true},
				{key: "att3", value: "3", type: "number", modified: true}
			]),
			SQL.insertItemAttributes(2, [
				{key: "att1", value: "e1;e2;e3", type: "list", modified: false},
				{key: "att2", value: "value2", type: "text", modified: false}
			]),
			SQL.insertItemAttributes(3, [
				{key: "att4", value: "true", type: "boolean", modified: true}
			])
		]);
		fsWrapper.existsFile = jest.fn().mockImplementation(path => path !== "/path/to/file/missing") as any;
		// when
		const result: Promise<void> = actionEmbed.perform(null, true);
		// then
		await expect(result).resolves.toBeUndefined();
		expect(funcWriteMetadata).toHaveBeenCalledTimes(2);
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/1", {
			att1: "value1",
			att2: "value2",
			att3: 3
		}, expect.anything());
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(2, "/path/to/file/3", {
			att4: true
		}, expect.anything());
	});

});


function mockEmbedAction(): [ActionEmbedItemAttributes, ActionCreateLibrary, DbAccess, (filepath: string, metadata: object, exifHandler: ExifHandler) => Promise<void>, FileSystemWrapper] {
	const fsWrapper = mockFileSystemWrapper();
	const dbAccess = new MemDbAccess();
	const configAccess = mockConfigAccess();

	mockExiftoolProcess({});

	const embedAction = new ActionEmbedItemAttributes(
		new ActionGetExiftoolInfo(configAccess),
		fsWrapper,
		new SQLiteDataRepository(dbAccess));
	embedAction["embedItem"] = jest.fn().mockReturnValue(Promise.resolve(undefined)) as any;

	const actionCreateLibrary = new ActionCreateLibrary(new SQLiteDataRepository(dbAccess), fsWrapper);

	return [embedAction, actionCreateLibrary, dbAccess, embedAction["embedItem"], fsWrapper];
}