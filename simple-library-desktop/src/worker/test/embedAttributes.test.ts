import {ActionEmbedItemAttributes, EmbedReport} from "../service/item/actionEmbedItemAttributes";
import {ActionCreateLibrary} from "../service/library/actionCreateLibrary";
import {DbAccess} from "../persistence/dbAcces";
import {ExifHandler} from "../service/exifHandler";
import {FileSystemWrapper} from "../service/fileSystemWrapper";
import {mockAttributeMetadataProvider, mockConfigAccess, mockExiftoolProcess, mockFileSystemWrapper} from "./mockSetup";
import {MemDbAccess} from "./memDbAccess";
import {SQLiteDataRepository} from "../persistence/sqliteRepository";
import {ActionGetExiftoolInfo} from "../service/config/actionGetExiftoolInfo";
import {ActionReadItemAttributesFromFile} from "../service/item/actionReadItemAttributesFromFile";
import {ActionReloadItemAttributes} from "../service/item/actionReloadItemAttributes";
import {ActionGetItemById} from "../service/item/actionGetItemById";
import {ActionSetItemAttributes} from "../service/item/actionSetItemAttributes";
import {jest} from "@jest/globals";
import {SQL} from "../persistence/sqlHandler";

describe("embed attributes", () => {

	test("embed all attributes of empty library", async () => {
		// given
		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction();
		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
		// when
		const result: Promise<EmbedReport> = actionEmbed.perform(null, true);
		// then
		await expect(result).resolves.toEqual({
			amountProcessedItems: 0,
			errors: []
		});
		expect(funcWriteMetadata).toHaveBeenCalledTimes(0);
	});

	test("embed all attributes of all items", async () => {
		// given
		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction();
		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertHiddenAttributes([{ id: "Author", name: "Author", g0: "PNG", g1: "PNG", g2: "Author" }]),
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
			SQL.insertItemAttributes(1, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attFileModifyDate("2021:03:04 21:00:12+02:00", false),
				attFileAccessDate("2021:05:06 21:00:12+02:00", false),
				attComment("New Comment", true),
				attFileExtension("jpg", false),
				attMIMEType("image/jpeg", false),
				attAuthor("me", true)
			]),
			SQL.insertItemAttributes(2, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attFileModifyDate("2022:11:11 21:00:12+02:00", true),
				attFileAccessDate("2021:05:06 21:00:12+02:00", false),
				attComment("Some Comment", false),
				attFileExtension("jpg", false),
				attMIMEType("image/jpeg", false),
				attAuthor("me", true)
			]),
			SQL.insertItemAttributes(3, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attFileModifyDate("2021:03:04 21:00:12+02:00", false),
				attFileAccessDate("2021:05:06 21:00:12+02:00", false),
				attComment("Some Comment", false),
				attFileExtension("jpg", false),
				attMIMEType("image/jpeg", false),
				attAuthor("me", true)
			]),
		]);
		// when
		const result: Promise<EmbedReport> = actionEmbed.perform(null, true);
		// then
		await expect(result).resolves.toEqual({
			amountProcessedItems: 3,
			errors: []
		});
		expect(funcWriteMetadata).toHaveBeenCalledTimes(3);
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/1", {
			"File:System:Time:FileCreateDate": "2021:01:02 21:00:12+02:00",
			"File:System:Time:FileModifyDate": "2021:03:04 21:00:12+02:00",
			"File:File:Image:Comment": "New Comment",
		});
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(2, "/path/to/file/2", {
			"File:System:Time:FileCreateDate": "2021:01:02 21:00:12+02:00",
			"File:System:Time:FileModifyDate": "2022:11:11 21:00:12+02:00",
			"File:File:Image:Comment": "Some Comment",
		});
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(3, "/path/to/file/3", {
			"File:System:Time:FileCreateDate": "2021:01:02 21:00:12+02:00",
			"File:System:Time:FileModifyDate": "2021:03:04 21:00:12+02:00",
			"File:File:Image:Comment": "Some Comment",
		});
		await expect(dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(true)).then(attribs => attribs.length)).resolves.toEqual(0);
	});

	test("embed all attributes of selected items", async () => {
		// given
		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction();
		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertHiddenAttributes([{ id: "Author", name: "Author", g0: "PNG", g1: "PNG", g2: "Author" }]),
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
			SQL.insertItemAttributes(1, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attFileModifyDate("2021:03:04 21:00:12+02:00", false),
				attFileAccessDate("2021:05:06 21:00:12+02:00", false),
				attComment("New Comment", true),
				attFileExtension("jpg", false),
				attMIMEType("image/jpeg", false),
				attAuthor("me", true)
			]),
			SQL.insertItemAttributes(2, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attFileModifyDate("2022:11:11 21:00:12+02:00", true),
				attFileAccessDate("2021:05:06 21:00:12+02:00", false),
				attComment("Some Comment", false),
				attFileExtension("jpg", false),
				attMIMEType("image/jpeg", false),
				attAuthor("me", true)
			]),
			SQL.insertItemAttributes(3, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attFileModifyDate("2021:03:04 21:00:12+02:00", false),
				attFileAccessDate("2021:05:06 21:00:12+02:00", false),
				attComment("Some Comment", false),
				attFileExtension("jpg", false),
				attMIMEType("image/jpeg", false),
				attAuthor("me", true)
			])
		]);
		// when
		const result: Promise<EmbedReport> = actionEmbed.perform([2,3], true);
		// then
		await expect(result).resolves.toEqual({
			amountProcessedItems: 2,
			errors: []
		});
		expect(funcWriteMetadata).toHaveBeenCalledTimes(2);
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/2", {
			"File:System:Time:FileCreateDate": "2021:01:02 21:00:12+02:00",
			"File:System:Time:FileModifyDate": "2022:11:11 21:00:12+02:00",
			"File:File:Image:Comment": "Some Comment",
		});
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(2, "/path/to/file/3", {
			"File:System:Time:FileCreateDate": "2021:01:02 21:00:12+02:00",
			"File:System:Time:FileModifyDate": "2021:03:04 21:00:12+02:00",
			"File:File:Image:Comment": "Some Comment",
		});
		await expect(dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(true)).then(attribs => attribs.length)).resolves.toEqual(1);
	});

	test("embed modified attributes of selected items", async () => {
		// given
		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction();
		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertHiddenAttributes([{ id: "Author", name: "Author", g0: "PNG", g1: "PNG", g2: "Author" }]),
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
			SQL.insertItemAttributes(1, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attFileModifyDate("2021:03:04 21:00:12+02:00", false),
				attFileAccessDate("2021:05:06 21:00:12+02:00", false),
				attComment("New Comment", true),
				attFileExtension("jpg", false),
				attMIMEType("image/jpeg", false),
				attAuthor("me", true)
			]),
			SQL.insertItemAttributes(2, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attFileModifyDate("2022:11:11 21:00:12+02:00", true),
				attFileAccessDate("2021:05:06 21:00:12+02:00", false),
				attComment("Some Comment", false),
				attFileExtension("jpg", false),
				attMIMEType("image/jpeg", false),
				attAuthor("me", true)
			]),
			SQL.insertItemAttributes(3, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attFileModifyDate("2021:03:04 21:00:12+02:00", false),
				attFileAccessDate("2021:05:06 21:00:12+02:00", false),
				attComment("Some Comment", false),
				attFileExtension("jpg", false),
				attMIMEType("image/jpeg", false),
				attAuthor("me", true)
			])
		]);
		// when
		const result: Promise<EmbedReport> = actionEmbed.perform([2,3], false);
		// then
		await expect(result).resolves.toEqual({
			amountProcessedItems: 1,
			errors: []
		});
		expect(funcWriteMetadata).toHaveBeenCalledTimes(1);
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/2", {
			"File:System:Time:FileModifyDate": "2022:11:11 21:00:12+02:00",
		});
		await expect(dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(true)).then(attribs => attribs.length)).resolves.toEqual(1);
	});

	test("embed attribute refreshes value", async () => {
		// given
		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction({
			"File:File:Image:Comment": {
				id: "Comment",
				val: "Refreshed Comment",
			},
		});
		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItemAttributes(1, [
				attComment("New Comment", true),
			]),
		]);
		// when
		const result: Promise<EmbedReport> = actionEmbed.perform(null, true);
		// then
		await expect(result).resolves.toEqual({
			amountProcessedItems: 1,
			errors: []
		});
		expect(funcWriteMetadata).toHaveBeenCalledTimes(1);
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/1", {
			"File:File:Image:Comment": "New Comment",
		});
		await expect(dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(true)).then(attribs => attribs.length)).resolves.toEqual(0);
		await expect(dbAccess.querySingle(SQL.queryItemAttribute(1, ["Comment", "Comment", "File", "File", "Image"]))
			.then(attrib => attrib.value)).resolves.toEqual("Refreshed Comment");
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
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attFileModifyDate("2021:03:04 21:00:12+02:00", false),
				attFileAccessDate("2021:05:06 21:00:12+02:00", false),
				attComment("New Comment", true),
				attFileExtension("jpg", false),
				attMIMEType("image/jpeg", false),
			]),
			SQL.insertItemAttributes(2, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attFileModifyDate("2022:11:11 21:00:12+02:00", true),
				attFileAccessDate("2021:05:06 21:00:12+02:00", false),
				attComment("Some Comment", false),
				attFileExtension("jpg", false),
				attMIMEType("image/jpeg", false),
			]),
			SQL.insertItemAttributes(3, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attFileModifyDate("2021:03:04 21:00:12+02:00", false),
				attFileAccessDate("2021:05:06 21:00:12+02:00", false),
				attComment("Some Comment", false),
				attFileExtension("jpg", false),
				attMIMEType("image/jpeg", false),
			])
		]);
		fsWrapper.existsFile = jest.fn().mockImplementation(path => path !== "/path/to/file/missing") as any;

		// when
		const result: Promise<EmbedReport> = actionEmbed.perform(null, true);
		// then
		await expect(result).resolves.toEqual({
			amountProcessedItems: 3,
			errors: [{
				itemId: 2,
				filepath: "/path/to/file/missing",
				error: "File not found."
			}]
		});
		expect(funcWriteMetadata).toHaveBeenCalledTimes(2);
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/1", {
			"File:System:Time:FileCreateDate": "2021:01:02 21:00:12+02:00",
			"File:System:Time:FileModifyDate": "2021:03:04 21:00:12+02:00",
			"File:File:Image:Comment": "New Comment",
		});
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(2, "/path/to/file/3", {
			"File:System:Time:FileCreateDate": "2021:01:02 21:00:12+02:00",
			"File:System:Time:FileModifyDate": "2021:03:04 21:00:12+02:00",
			"File:File:Image:Comment": "Some Comment",
		});
		await expect(dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(true)).then(attribs => attribs.length)).resolves.toEqual(0);
	});

});


function mockEmbedAction(metadata?: any): [ActionEmbedItemAttributes, ActionCreateLibrary, DbAccess, (filepath: string, metadata: object, exifHandler: ExifHandler) => Promise<void>, FileSystemWrapper] {
	const fsWrapper = mockFileSystemWrapper();
	const dbAccess = new MemDbAccess();
	const configAccess = mockConfigAccess();
	const sqlRepo = new SQLiteDataRepository(dbAccess);

	fsWrapper["existsFile"] = jest.fn().mockImplementation((path: string) => !path.endsWith(".db")) as any;

	mockExiftoolProcess(metadata ? metadata : {
		"File:System:Time:FileCreateDate": {
			id: "FileCreateDate",
			val: "2021:01:02 21:00:12+02:00",
		},
		"File:System:Time:FileModifyDate": {
			id: "FileModifyDate",
			val: "2021:02:03 21:00:12+02:00",
		},
		"File:System:Time:FileAccessDate": {
			id: "FileAccessDate",
			val: "2021:04:05 21:00:12+02:00",
		},
		"File:File:Image:Comment": {
			id: "Comment",
			val: "Some Comment",
		},
		"File:File:Other:FileTypeExtension": {
			id: "FileTypeExtension",
			val: "jpg",
		},
		"File:File:Other:MIMEType": {
			id: "MIMEType",
			val: "image/jpeg",
		}
	});

	const embedAction = new ActionEmbedItemAttributes(
		new ActionGetExiftoolInfo(configAccess),
		new ActionReadItemAttributesFromFile(new ActionGetExiftoolInfo(configAccess)),
		new ActionReloadItemAttributes(
			new ActionGetItemById(sqlRepo),
			new ActionGetExiftoolInfo(configAccess),
			new ActionReadItemAttributesFromFile(new ActionGetExiftoolInfo(configAccess)),
			new ActionSetItemAttributes(sqlRepo)
		),
		fsWrapper,
		sqlRepo,
		() => Promise.resolve());
	embedAction["embedItem"] = jest.fn().mockImplementation((filepath: string, metadata: object) => {
		console.log("EMBED: ", filepath, metadata)
		return Promise.resolve(undefined)
	}) as any;

	const actionCreateLibrary = new ActionCreateLibrary(new SQLiteDataRepository(dbAccess), fsWrapper, mockAttributeMetadataProvider(true));

	return [embedAction, actionCreateLibrary, dbAccess, embedAction["embedItem"], fsWrapper];
}

function sqlAttribute(key: [string, string, string, string, string], value: any, modified: boolean) {
	return {
		id: key[0],
		name: key[1],
		g0: key[2],
		g1: key[3],
		g2: key[4],
		value: value,
		modified: modified
	};
}


function attFileCreateDate(value: string, modified: boolean) { // WRITABLE
	return sqlAttribute(["FileCreateDate", "FileCreateDate", "File", "System", "Time"], value, modified);
}

function attFileModifyDate(value: string, modified: boolean) { // WRITABLE
	return  sqlAttribute(["FileModifyDate", "FileModifyDate", "File", "System", "Time"], value, modified);
}

function attComment(value: string, modified: boolean) { // WRITABLE
	return  sqlAttribute(["Comment", "Comment", "File", "File", "Image"], value, modified);
}

function attAuthor(value: string, modified: boolean) { // WRITABLE
	return  sqlAttribute(["Author", "Author", "PNG", "PNG", "Author"], value, modified);
}

function attFileAccessDate(value: string, modified: boolean) { // read-only
	return  sqlAttribute(["FileAccessDate", "FileAccessDate", "File", "System", "Time"], value, modified);
}

function attFileExtension(value: string, modified: boolean) { // read-only
	return  sqlAttribute(["FileTypeExtension", "FileTypeExtension", "File", "File", "Other"], value, modified);
}

function attMIMEType(value: string, modified: boolean) { // read-only
	return sqlAttribute(["MIMEType", "MIMEType", "File", "File", "Other"], value, modified);
}
