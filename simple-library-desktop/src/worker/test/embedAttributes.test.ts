// import {MemDbAccess} from "./memDbAccess";
// import {mockAttributeMetadataProvider, mockConfigAccess, mockExiftoolProcess, mockFileSystemWrapper} from "./mockSetup";
// import {ActionEmbedItemAttributes, EmbedReport} from "../service/item/actionEmbedItemAttributes";
// import {SQLiteDataRepository} from "../persistence/sqliteRepository";
// import {ActionGetExiftoolInfo} from "../service/config/actionGetExiftoolInfo";
// import {ActionCreateLibrary} from "../service/library/actionCreateLibrary";
// import {DbAccess} from "../persistence/dbAcces";
// import {SQL} from "../persistence/sqlHandler";
// import {jest} from "@jest/globals";
// import {ExifHandler} from "../service/exifHandler";
// import {FileSystemWrapper} from "../service/fileSystemWrapper";
// import {ActionReadItemAttributesFromFile} from "../service/item/actionReadItemAttributesFromFile";
// import {ActionUpdateItemAttribute} from "../service/item/actionUpdateItemAttribute";
//
// describe("embed attributes", () => {
//
// 	test("embed all attributes of all items", async () => {
// 		// given
// 		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction();
// 		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
// 		await dbAccess.runMultipleSeq([
// 			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
// 			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
// 			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
// 			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
// 			SQL.insertItemAttributes(1, [
// 				sqlAttribute(keyComment(), "Some Comment", "?", true),
// 				sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
// 				sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
// 			]),
// 			SQL.insertItemAttributes(2, [
// 				sqlAttribute(keyComment(), "Other Comment", "?", false),
// 				sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", true),
// 			]),
// 			SQL.insertItemAttributes(3, [
// 				sqlAttribute(keyComment(), "Test Comment", "?", false),
// 			])
// 		]);
// 		fsWrapper.existsFile = jest.fn().mockReturnValue(true) as any;
// 		// when
// 		const result: Promise<EmbedReport> = actionEmbed.perform(null, true);
// 		// then
// 		await expect(result).resolves.toEqual({
// 			amountProcessedItems: 3,
// 			errors: []
// 		});
// 		expect(funcWriteMetadata).toHaveBeenCalledTimes(3);
// 		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/1", {
// 			"File:File:Image:Comment": "Some Comment",
// 			"File:System:Time:FileModifyDate": "2021:10:11 21:00:12+02:00",
// 		});
// 		expect(funcWriteMetadata).toHaveBeenNthCalledWith(2, "/path/to/file/2", {
// 			"File:File:Image:Comment": "Other Comment",
// 			"File:System:Time:FileModifyDate": "2021:10:11 21:00:12+02:00",
// 		});
// 		expect(funcWriteMetadata).toHaveBeenNthCalledWith(3, "/path/to/file/3", {
// 			"File:File:Image:Comment": "Test Comment",
// 		});
// 		await expect(dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(true)).then(attribs => attribs.length)).resolves.toEqual(0)
// 	});
//
// 	test("embed modified attributes of all items", async () => {
// 		// given
// 		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction();
// 		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
// 		await dbAccess.runMultipleSeq([
// 			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
// 			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
// 			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
// 			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
// 			SQL.insertItemAttributes(1, [
// 				sqlAttribute(keyComment(), "Some Comment", "?", true),
// 				sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
// 				sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
// 			]),
// 			SQL.insertItemAttributes(2, [
// 				sqlAttribute(keyComment(), "Other Comment", "?", true),
// 				sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", true),
// 			]),
// 			SQL.insertItemAttributes(3, [
// 				sqlAttribute(keyComment(), "Test Comment", "?", false),
// 			])
// 		]);
// 		fsWrapper.existsFile = jest.fn().mockReturnValue(true) as any;
// 		// when
// 		const result: Promise<EmbedReport> = actionEmbed.perform(null, false);
// 		// then
// 		await expect(result).resolves.toEqual({
// 			amountProcessedItems: 2,
// 			errors: []
// 		});
// 		expect(funcWriteMetadata).toHaveBeenCalledTimes(2);
// 		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/1", {
// 			"File:File:Image:Comment": "Some Comment",
// 		});
// 		expect(funcWriteMetadata).toHaveBeenNthCalledWith(2, "/path/to/file/2", {
// 			"File:File:Image:Comment": "Other Comment",
// 			"File:System:Time:FileModifyDate": "2021:10:11 21:00:12+02:00",
// 		});
// 		await expect(dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(true)).then(attribs => attribs.length)).resolves.toEqual(0)
// 	});
//
// 	test("embed all attributes of given items", async () => {
// 		// given
// 		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction();
// 		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
// 		await dbAccess.runMultipleSeq([
// 			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
// 			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
// 			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
// 			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
// 			SQL.insertItemAttributes(1, [
// 				sqlAttribute(keyComment(), "Some Comment", "?", true),
// 				sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", true),
// 				sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
// 			]),
// 			SQL.insertItemAttributes(2, [
// 				sqlAttribute(keyComment(), "Other Comment", "?", true),
// 				sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
// 			]),
// 			SQL.insertItemAttributes(3, [
// 				sqlAttribute(keyComment(), "Test Comment", "?", true),
// 			])
// 		]);
// 		fsWrapper.existsFile = jest.fn().mockReturnValue(true) as any;
// 		// when
// 		const result: Promise<EmbedReport> = actionEmbed.perform([1, 2], true);
// 		// then
// 		await expect(result).resolves.toEqual({
// 			amountProcessedItems: 2,
// 			errors: []
// 		});
// 		expect(funcWriteMetadata).toHaveBeenCalledTimes(2);
// 		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/1", {
// 			"File:File:Image:Comment": "Some Comment",
// 			"File:System:Time:FileModifyDate": "2021:10:11 21:00:12+02:00",
// 		});
// 		expect(funcWriteMetadata).toHaveBeenNthCalledWith(2, "/path/to/file/2", {
// 			"File:File:Image:Comment": "Other Comment",
// 			"File:System:Time:FileModifyDate": "2021:10:11 21:00:12+02:00",
// 		});
// 		await expect(dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(true)).then(attribs => attribs.length)).resolves.toEqual(1)
// 	});
//
// 	test("embed modified attributes of given items", async () => {
// 		// given
// 		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction();
// 		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
// 		await dbAccess.runMultipleSeq([
// 			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
// 			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
// 			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
// 			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
// 			SQL.insertItemAttributes(1, [
// 				sqlAttribute(keyComment(), "Some Comment", "?", true),
// 				sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
// 				sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
// 			]),
// 			SQL.insertItemAttributes(2, [
// 				sqlAttribute(keyComment(), "Other Comment", "?", false),
// 				sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
// 			]),
// 			SQL.insertItemAttributes(3, [
// 				sqlAttribute(keyComment(), "Test Comment", "?", true),
// 			])
// 		]);
// 		fsWrapper.existsFile = jest.fn().mockReturnValue(true) as any;
// 		// when
// 		const result: Promise<EmbedReport> = actionEmbed.perform([1, 2], false);
// 		// then
// 		await expect(result).resolves.toEqual({
// 			amountProcessedItems: 1,
// 			errors: []
// 		});
// 		expect(funcWriteMetadata).toHaveBeenCalledTimes(1);
// 		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/1", {
// 			"File:File:Image:Comment": "Some Comment",
// 		});
// 		await expect(dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(true)).then(attribs => attribs.length)).resolves.toEqual(1)
// 	});
//
// 	test("embed attributes missing files", async () => {
// 		// given
// 		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction();
// 		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
// 		await dbAccess.runMultipleSeq([
// 			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
// 			SQL.insertItem("/path/to/file/missing", 1001, "hash2", "thumbnail2"),
// 			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
// 			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
// 			SQL.insertItemAttributes(1, [
// 				sqlAttribute(keyComment(), "Some Comment", "?", true),
// 				sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
// 				sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
// 			]),
// 			SQL.insertItemAttributes(2, [
// 				sqlAttribute(keyComment(), "Other Comment", "?", false),
// 				sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
// 			]),
// 			SQL.insertItemAttributes(3, [
// 				sqlAttribute(keyComment(), "Test Comment", "?", true),
// 			])
// 		]);
// 		fsWrapper.existsFile = jest.fn().mockImplementation(path => path !== "/path/to/file/missing") as any;
// 		// when
// 		const result: Promise<EmbedReport> = actionEmbed.perform(null, true);
// 		// then
// 		await expect(result).resolves.toEqual({
// 			amountProcessedItems: 3,
// 			errors: [{
// 				itemId: 2,
// 				filepath: "/path/to/file/missing",
// 				error: "File not found."
// 			}]
// 		});
// 		expect(funcWriteMetadata).toHaveBeenCalledTimes(2);
// 		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/1", {
// 			"File:File:Image:Comment": "Some Comment",
// 			"File:System:Time:FileModifyDate": "2021:10:11 21:00:12+02:00"
// 		});
// 		expect(funcWriteMetadata).toHaveBeenNthCalledWith(2, "/path/to/file/3", {
// 			"File:File:Image:Comment": "Test Comment",
// 		});
// 		await expect(dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(true)).then(attribs => attribs.length)).resolves.toEqual(0)
// 	});
//
// 	test("embed attributes exiftool exception", async () => {
// 		// given
// 		const [actionEmbed, actionCreateLibrary, dbAccess, , fsWrapper] = mockEmbedAction();
// 		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
// 		await dbAccess.runMultipleSeq([
// 			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
// 			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
// 			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
// 			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
// 			SQL.insertItemAttributes(1, [
// 				sqlAttribute(keyComment(), "Some Comment", "?", true),
// 				sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", false),
// 				sqlAttribute(keyMIMEType(), "image/jpeg", "?", false)
// 			]),
// 			SQL.insertItemAttributes(2, [
// 				sqlAttribute(keyComment(), "Other Comment", "?", false),
// 				sqlAttribute(keyFileModifyDate(), "2021:10:11 21:00:12+02:00", "?", true),
// 			]),
// 			SQL.insertItemAttributes(3, [
// 				sqlAttribute(keyComment(), "Test Comment", "?", false),
// 			])
// 		]);
// 		fsWrapper.existsFile = jest.fn().mockReturnValue(true) as any;
// 		const funcWriteMetadataException = jest.fn().mockRejectedValue("My Error") as any;
// 		actionEmbed["embedItem"] = funcWriteMetadataException;
// 		// when
// 		const result: Promise<EmbedReport> = actionEmbed.perform(null, true);
// 		// then
// 		await expect(result).resolves.toEqual({
// 			amountProcessedItems: 3,
// 			errors: [
// 				{
// 					itemId: 1,
// 					filepath: "/path/to/file/1",
// 					error: "Error: My Error"
// 				},
// 				{
// 					itemId: 2,
// 					filepath: "/path/to/file/2",
// 					error: "Error: My Error"
// 				},
// 				{
// 					itemId: 3,
// 					filepath: "/path/to/file/3",
// 					error: "Error: My Error"
// 				}]
// 		});
// 		expect(funcWriteMetadataException).toHaveBeenCalledTimes(3);
// 		expect(funcWriteMetadataException).toHaveBeenNthCalledWith(1, "/path/to/file/1", {
// 			"File:File:Image:Comment": "Some Comment",
// 			"File:System:Time:FileModifyDate": "2021:10:11 21:00:12+02:00",
// 		});
// 		expect(funcWriteMetadataException).toHaveBeenNthCalledWith(2, "/path/to/file/2", {
// 			"File:File:Image:Comment": "Other Comment",
// 			"File:System:Time:FileModifyDate": "2021:10:11 21:00:12+02:00",
// 		});
// 		expect(funcWriteMetadataException).toHaveBeenNthCalledWith(3, "/path/to/file/3", {
// 			"File:File:Image:Comment": "Test Comment",
// 		});
// 		await expect(dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(true)).then(attribs => attribs.length)).resolves.toEqual(0)
// 	});
//
// });
//
//
// function mockEmbedAction(): [ActionEmbedItemAttributes, ActionCreateLibrary, DbAccess, (filepath: string, metadata: object, exifHandler: ExifHandler) => Promise<void>, FileSystemWrapper] {
// 	const fsWrapper = mockFileSystemWrapper();
// 	const dbAccess = new MemDbAccess();
// 	const configAccess = mockConfigAccess();
//
// 	mockExiftoolProcess({});
//
// 	const embedAction = new ActionEmbedItemAttributes(
// 		new ActionGetExiftoolInfo(configAccess),
// 		new ActionReadItemAttributesFromFile(new ActionGetExiftoolInfo(configAccess)),
// 		new ActionUpdateItemAttribute(new SQLiteDataRepository(dbAccess)),
// 		fsWrapper,
// 		new SQLiteDataRepository(dbAccess),
// 		() => Promise.resolve());
// 	embedAction["embedItem"] = jest.fn().mockReturnValue(Promise.resolve(undefined)) as any;
//
// 	const actionCreateLibrary = new ActionCreateLibrary(new SQLiteDataRepository(dbAccess), fsWrapper, mockAttributeMetadataProvider(true));
//
// 	return [embedAction, actionCreateLibrary, dbAccess, embedAction["embedItem"], fsWrapper];
// }
//
// function sqlAttribute(key: [string, string, string, string, string], value: any, type: string, modified: boolean) {
// 	return {
// 		id: key[0],
// 		name: key[1],
// 		g0: key[2],
// 		g1: key[3],
// 		g2: key[4],
// 		value: value,
// 		type: type,
// 		modified: modified
// 	};
// }
//
//
// function keyFileCreateDate(): [string, string, string, string, string] { // WRITABLE
// 	return ["FileCreateDate", "FileCreateDate", "File", "System", "Time"];
// }
//
// function keyFileModifyDate(): [string, string, string, string, string] { // WRITABLE
// 	return ["FileModifyDate", "FileModifyDate", "File", "System", "Time"];
// }
//
// function keyComment(): [string, string, string, string, string] { // WRITABLE
// 	return ["Comment","Comment","File","File","Image"];
// }
//
// function keyFileAccessDate(): [string, string, string, string, string] { // read-only
// 	return ["FileAccessDate", "FileAccessDate", "File", "System", "Time"];
// }
//
// function keyFileType(): [string, string, string, string, string] { // read-only
// 	return ["FileType", "FileType", "File", "File", "Other"];
// }
//
// function keyFileExtension(): [string, string, string, string, string] { // read-only
// 	return ["FileTypeExtension", "FileTypeExtension", "File", "File", "Other"];
// }
//
// function keyMIMEType(): [string, string, string, string, string] {  // read-only
// 	return ["MIMEType", "MIMEType", "File", "File", "Other"];
// }
//
