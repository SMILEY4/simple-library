import {ActionEmbedItemAttributes, EmbedReport} from "../service/item/actionEmbedItemAttributes";
import {ActionCreateLibrary} from "../service/library/actionCreateLibrary";
import {DbAccess} from "../persistence/dbAcces";
import {ExifHandler} from "../service/exifHandler";
import {FileSystemWrapper} from "../service/fileSystemWrapper";
import {
	mockAttributeMetadataProvider,
	mockConfigAccess,
	mockExiftoolProcessMultiFiles,
	mockFileSystemWrapper
} from "./mockSetup";
import {MemDbAccess} from "./memDbAccess";
import {SQLiteDataRepository} from "../persistence/sqliteRepository";
import {ActionGetExiftoolInfo} from "../service/config/actionGetExiftoolInfo";
import {ActionReadItemAttributesFromFile} from "../service/item/actionReadItemAttributesFromFile";
import {ActionReloadItemAttributes} from "../service/item/actionReloadItemAttributes";
import {ActionGetItemById} from "../service/item/actionGetItemById";
import {ActionSetItemAttributes} from "../service/item/actionSetItemAttributes";
import {jest} from "@jest/globals";
import {SQL} from "../persistence/sqlHandler";
import {ActionGetLibraryAttributeMetaByKeys} from "../service/library/actionGetLibraryAttributeMetaByKeys";

describe("embed attributes", () => {

	test("embed all attributes of empty library", async () => {
		// given
		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction([]);

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

	test("embed all attributes of all items and hidden field", async () => {
		// given
		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction(
			buildMetadata([
				{
					path: "/path/to/file/1",
					entries: [
						metaFileCreateDate("2021:01:02 21:00:12+02:00"),
						metaComment("New Comment"),
						metaFileExtension("jpg"),
						metaAuthor("me")
					]
				},
				{
					path: "/path/to/file/2",
					entries: [
						metaFileCreateDate("2021:01:02 21:00:12+02:00"),
						metaComment("Some Comment"),
						metaFileExtension("jpg"),
						metaAuthor("me")
					]
				},
				{
					path: "/path/to/file/3",
					entries: [
						metaFileCreateDate("2021:01:02 21:00:12+02:00"),
						metaComment("Some Comment"),
						metaFileExtension("jpg"),
						metaAuthor("me")
					]
				}
			])
		);
		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
			SQL.insertItemAttributes(1, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attComment("New Comment", true),
				attFileExtension("jpg", false),
				attAuthor("me", true)
			]),
			SQL.insertItemAttributes(2, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attComment("Some Comment", false),
				attFileExtension("jpg", false),
				attAuthor("me", true)
			]),
			SQL.insertItemAttributes(3, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attComment("Some Comment", false),
				attFileExtension("jpg", false),
				attAuthor("me", true)
			]),
			SQL.insertHiddenAttributes([ATT_ID_AUTHOR])
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
			"File:File:Image:Comment": "New Comment",
			"File:System:Time:FileCreateDate": "2021:01:02 21:00:12+02:00"
		});
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(2, "/path/to/file/2", {
			"File:System:Time:FileCreateDate": "2021:01:02 21:00:12+02:00",
			"File:File:Image:Comment": "Some Comment"
		});
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(3, "/path/to/file/3", {
			"File:System:Time:FileCreateDate": "2021:01:02 21:00:12+02:00",
			"File:File:Image:Comment": "Some Comment"
		});
		await expect(dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(true)).then(attribs => attribs.length)).resolves.toEqual(0);
	});

	test("embed all attributes of selected items and hidden field", async () => {
		// given
		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction(
			buildMetadata([
				{
					path: "/path/to/file/1",
					entries: [
						metaFileCreateDate("2021:01:02 21:00:12+02:00"),
						metaComment("New Comment"),
						metaFileExtension("jpg"),
						metaAuthor("me")
					]
				},
				{
					path: "/path/to/file/2",
					entries: [
						metaFileCreateDate("2021:01:02 21:00:12+02:00"),
						metaComment("Some Comment"),
						metaFileExtension("jpg"),
						metaAuthor("me")
					]
				},
				{
					path: "/path/to/file/3",
					entries: [
						metaFileCreateDate("2021:01:02 21:00:12+02:00"),
						metaComment("Some Comment"),
						metaFileExtension("jpg"),
						metaAuthor("me")
					]
				}
			])
		);
		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
			SQL.insertItemAttributes(1, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attComment("New Comment", true),
				attFileExtension("jpg", false),
				attAuthor("me", true)
			]),
			SQL.insertItemAttributes(2, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attComment("Some Comment", false),
				attFileExtension("jpg", false),
				attAuthor("me", true)
			]),
			SQL.insertItemAttributes(3, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attComment("Some Comment", false),
				attFileExtension("jpg", false),
				attAuthor("me", true)
			]),
			SQL.insertHiddenAttributes([ATT_ID_AUTHOR])
		]);
		// when
		const result: Promise<EmbedReport> = actionEmbed.perform([2, 3], true);
		// then
		await expect(result).resolves.toEqual({
			amountProcessedItems: 2,
			errors: []
		});
		expect(funcWriteMetadata).toHaveBeenCalledTimes(2);
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/2", {
			"File:System:Time:FileCreateDate": "2021:01:02 21:00:12+02:00",
			"File:File:Image:Comment": "Some Comment"
		});
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(2, "/path/to/file/3", {
			"File:System:Time:FileCreateDate": "2021:01:02 21:00:12+02:00",
			"File:File:Image:Comment": "Some Comment"
		});
		await expect(dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(true)).then(attribs => attribs.length)).resolves.toEqual(1);
	});


	test("embed modified attributes of selected items and hidden field", async () => {
		// given
		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction(
			buildMetadata([
				{
					path: "/path/to/file/1",
					entries: [
						metaFileCreateDate("2021:01:02 21:00:12+02:00"),
						metaComment("New Comment"),
						metaFileExtension("jpg"),
						metaAuthor("me")
					]
				},
				{
					path: "/path/to/file/2",
					entries: [
						metaFileCreateDate("2021:01:02 21:00:12+02:00"),
						metaComment("New Comment"),
						metaFileExtension("jpg"),
						metaAuthor("me")
					]
				},
				{
					path: "/path/to/file/3",
					entries: [
						metaFileCreateDate("2021:01:02 21:00:12+02:00"),
						metaComment("Some Comment"),
						metaFileExtension("jpg"),
						metaAuthor("me")
					]
				}
			])
		);
		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
			SQL.insertItemAttributes(1, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attComment("New Comment", true),
				attFileExtension("jpg", false),
				attAuthor("me", true)
			]),
			SQL.insertItemAttributes(2, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attComment("New Comment", true),
				attFileExtension("jpg", false),
				attAuthor("me", true)
			]),
			SQL.insertItemAttributes(3, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attComment("Some Comment", false),
				attFileExtension("jpg", false),
				attAuthor("me", true)
			]),
			SQL.insertHiddenAttributes([ATT_ID_AUTHOR])
		]);
		// when
		const result: Promise<EmbedReport> = actionEmbed.perform([2, 3], false);
		// then
		await expect(result).resolves.toEqual({
			amountProcessedItems: 1,
			errors: []
		});
		expect(funcWriteMetadata).toHaveBeenCalledTimes(1);
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(1, "/path/to/file/2", {
			"File:File:Image:Comment": "New Comment"
		});
		await expect(dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(true)).then(attribs => attribs.length)).resolves.toEqual(1);
	});

	test("embed attribute refreshes value", async () => {
		// given
		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction(
			buildMetadata([{
				path: "/path/to/file/1",
				entries: [metaComment("Refreshed Comment")]
			}])
		);
		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItemAttributes(1, [
				attComment("New Comment", true)
			])
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
			"File:File:Image:Comment": "New Comment"
		});
		await expect(dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(true)).then(attribs => attribs.length)).resolves.toEqual(0);
		await expect(dbAccess.querySingle(SQL.queryItemAttribute(1, ATT_ID_COMMENT)).then(a => a.value)).resolves.toEqual("Refreshed Comment");
	});


	test("embed attributes missing files", async () => {
		// given
		const [actionEmbed, actionCreateLibrary, dbAccess, funcWriteMetadata, fsWrapper] = mockEmbedAction(
			buildMetadata([
				{
					path: "/path/to/file/1",
					entries: [
						metaFileCreateDate("2021:01:02 21:00:12+02:00"),
						metaFileAccessDate("2021:05:06 21:00:12+02:00"),
						metaComment("New Comment")
					]
				},
				{
					path: "/path/to/file/3",
					entries: [
						metaFileCreateDate("2021:01:02 21:00:12+02:00"),
						metaFileAccessDate("2021:05:06 21:00:12+02:00"),
						metaComment("New Comment")
					]
				}
			])
		);
		await actionCreateLibrary.perform("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItem("/path/to/file/missing", 1001, "hash2", "thumbnail2"),
			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
			SQL.insertItemAttributes(1, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attFileAccessDate("2021:05:06 21:00:12+02:00", false),
				attComment("New Comment", true)
			]),
			SQL.insertItemAttributes(2, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attFileAccessDate("2021:05:06 21:00:12+02:00", false),
				attComment("New Comment", true)
			]),
			SQL.insertItemAttributes(3, [
				attFileCreateDate("2021:01:02 21:00:12+02:00", false),
				attFileAccessDate("2021:05:06 21:00:12+02:00", false),
				attComment("New Comment", true)
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
			"File:File:Image:Comment": "New Comment"
		});
		expect(funcWriteMetadata).toHaveBeenNthCalledWith(2, "/path/to/file/3", {
			"File:System:Time:FileCreateDate": "2021:01:02 21:00:12+02:00",
			"File:File:Image:Comment": "New Comment"
		});
		await expect(dbAccess.queryAll(SQL.queryExtendedItemAttributesAll(true)).then(attribs => attribs.length)).resolves.toEqual(0);
	});

});


function mockEmbedAction(metadata: any): [ActionEmbedItemAttributes, ActionCreateLibrary, DbAccess, (filepath: string, metadata: object, exifHandler: ExifHandler) => Promise<void>, FileSystemWrapper] {
	const fsWrapper = mockFileSystemWrapper();
	const dbAccess = new MemDbAccess();
	const configAccess = mockConfigAccess();
	const sqlRepo = new SQLiteDataRepository(dbAccess);

	fsWrapper["existsFile"] = jest.fn().mockImplementation((path: string) => !path.endsWith(".db")) as any;

	mockExiftoolProcessMultiFiles(metadata);

	const embedAction = new ActionEmbedItemAttributes(
		new ActionGetExiftoolInfo(configAccess),
		new ActionReadItemAttributesFromFile(new ActionGetExiftoolInfo(configAccess)),
		new ActionReloadItemAttributes(
			new ActionGetItemById(sqlRepo),
			new ActionGetExiftoolInfo(configAccess),
			new ActionReadItemAttributesFromFile(new ActionGetExiftoolInfo(configAccess)),
			new ActionGetLibraryAttributeMetaByKeys(sqlRepo),
			new ActionSetItemAttributes(sqlRepo)
		),
		fsWrapper,
		sqlRepo,
		() => Promise.resolve());

	embedAction["embedItem"] = jest.fn().mockImplementation((filepath: string, metadata: object) => {
		console.log("EMBED: ", filepath, metadata);
		return Promise.resolve(undefined);
	}) as any;

	const actionCreateLibrary = new ActionCreateLibrary(new SQLiteDataRepository(dbAccess), fsWrapper, mockAttributeMetadataProvider(true));

	return [embedAction, actionCreateLibrary, dbAccess, embedAction["embedItem"], fsWrapper];
}

function sqlAttribute(attId: number, value: any, modified: boolean) {
	return {attId: attId, value: value, modified: modified};
}


const ATT_ID_FILE_CREATE_DATE = 7161;
const ATT_ID_FILE_MODIFY_DATE = 7168;
const ATT_ID_COMMENT = 7148;
const ATT_ID_AUTHOR = 16472;
const ATT_ID_FILE_ACCESS_DATE = 7157;
const ATT_ID_FILE_EXTENSION = 7175;
const ATT_ID_MIME_TYPE = 7190;

function attFileCreateDate(value: string, modified: boolean) { // WRITABLE
	return sqlAttribute(ATT_ID_FILE_CREATE_DATE, value, modified);
}

function attFileModifyDate(value: string, modified: boolean) { // WRITABLE
	return sqlAttribute(ATT_ID_FILE_MODIFY_DATE, value, modified);
}

function attComment(value: string, modified: boolean) { // WRITABLE
	return sqlAttribute(ATT_ID_COMMENT, value, modified);
}

function attAuthor(value: string, modified: boolean) { // WRITABLE
	return sqlAttribute(ATT_ID_AUTHOR, value, modified);
}

function attFileAccessDate(value: string, modified: boolean) { // read-only
	return sqlAttribute(ATT_ID_FILE_ACCESS_DATE, value, modified);
}

function attFileExtension(value: string, modified: boolean) { // read-only
	return sqlAttribute(ATT_ID_FILE_EXTENSION, value, modified);
}

function attMIMEType(value: string, modified: boolean) { // read-only
	return sqlAttribute(ATT_ID_MIME_TYPE, value, modified);
}

function metaFileCreateDate(value: string): MetadataMockEntry {
	return fileMetadataEntry("File", "System", "Time", "FileCreateDate", "FileCreateDate", value);
}

function metaFileModifyDate(value: string): MetadataMockEntry {
	return fileMetadataEntry("File", "System", "Time", "FileModifyDate", "FileModifyDate", value);
}

function metaComment(value: string): MetadataMockEntry {
	return fileMetadataEntry("File", "File", "Image", "Comment", "Comment", value);
}

function metaAuthor(value: string): MetadataMockEntry {
	return fileMetadataEntry("PNG", "PNG", "Author", "Author", "Author", value);
}

function metaFileAccessDate(value: string): MetadataMockEntry {
	return fileMetadataEntry("File", "System", "Time", "FileAccessDate", "FileAccessDate", value);
}

function metaFileExtension(value: string): MetadataMockEntry {
	return fileMetadataEntry("File", "File", "Other", "FileTypeExtension", "FileTypeExtension", value);
}

function metaMIMEType(value: string): MetadataMockEntry {
	return fileMetadataEntry("File", "File", "Other", "MIMEType", "MIMEType", value);
}


type MetadataMockEntry = [string, { "id": string, "val": string }];

function fileMetadataEntry(g0: string, g1: string, g2: string, name: string, id: string, value: string): MetadataMockEntry {
	return [
		g0 + ":" + g1 + ":" + g2 + ":" + name,
		{
			"id": id,
			"val": value
		}
	];
}

function buildFileMetadata(entries: MetadataMockEntry[]) {
	const data: any = {};
	entries.forEach(entry => {
		data[entry[0]] = entry[1];
	});
	return data;
}


function buildMetadata(fileEntries: ({ path: string, entries: MetadataMockEntry[] })[]) {
	const data: any = {};
	fileEntries.forEach(fileEntry => {
		const fileData = buildFileMetadata(fileEntry.entries);
		data[fileEntry.path] = fileData;
	});
	return data;
}
