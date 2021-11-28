import {jest} from "@jest/globals";
import {DbAccess} from "../persistence/dbAcces";
import {FileSystemWrapper} from "../service/fileSystemWrapper";
import {ConfigAccess} from "../persistence/configAccess";
import {AttributeMetadataProvider} from "../persistence/attributeMetadata";
import {ExifHandler} from "../service/exifHandler";


export function mockFileSystemWrapper(): FileSystemWrapper {
	const fsWrapper = new FileSystemWrapper();
	fsWrapper["move"] = jest.fn().mockReturnValue(Promise.resolve(undefined)) as any;
	fsWrapper["copy"] = jest.fn().mockReturnValue(Promise.resolve(undefined)) as any;
	fsWrapper["createReadStream"] = jest.fn().mockReturnValue(undefined) as any;
	fsWrapper["existsFile"] = jest.fn().mockReturnValue(undefined) as any;
	fsWrapper["existsDir"] = jest.fn().mockReturnValue(undefined) as any;
	fsWrapper["open"] = jest.fn().mockReturnValue(Promise.resolve(undefined)) as any;
	// fsWrapper["readFile"] = jest.fn().mockReturnValue(undefined) as any; dont need to mock this
	return fsWrapper;
}

export function mockDbAccess(): DbAccess {
	const dbAccess = new DbAccess();
	dbAccess["createDbFile"] = jest.fn().mockReturnValue(Promise.resolve()) as any;
	dbAccess["getDatabase"] = jest.fn().mockReturnValue(Promise.resolve(undefined)) as any;
	dbAccess["executeRun"] = jest.fn().mockReturnValue(Promise.resolve(undefined)) as any;
	dbAccess["runMultipleSeq"] = jest.fn().mockReturnValue(Promise.resolve(undefined)) as any;
	dbAccess["executeQuerySingle"] = jest.fn().mockReturnValue(Promise.resolve(undefined)) as any;
	dbAccess["executeQueryAll"] = jest.fn().mockReturnValue(Promise.resolve(undefined)) as any;
	return dbAccess;
}

export function mockConfigAccess(): ConfigAccess {
	ConfigAccess.prototype["initStore"] = () => undefined;
	const configAccess = new ConfigAccess();
	configAccess["getStoreValue"] = jest.fn().mockReturnValue(undefined) as any;
	configAccess["setValue"] = jest.fn().mockReturnValue(undefined) as any;
	return configAccess;
}

export function mockDateNow(timestamp: number): number {
	Date.now = () => timestamp;
	return timestamp;
}

export interface QueryMockEntry {
	id: string,
	result: any
}

export function mockQueryAll(dbAccess: DbAccess, queryMocks: QueryMockEntry[]) {
	dbAccess["executeQueryAll"] = jest.fn().mockImplementation((db: any, sql: string) => {
		const mock = queryMocks.find(entry => entry.id.trim() === sql.trim());
		return mock ? Promise.resolve(mock.result) : undefined;
	}) as any;
}

export function mockQuerySingle(dbAccess: DbAccess, queryMocks: QueryMockEntry[]) {
	dbAccess["executeQuerySingle"] = jest.fn().mockImplementation((db: any, sql: string) => {
		const mock = queryMocks.find(entry => entry.id.trim() === sql.trim());
		return mock ? Promise.resolve(mock.result) : undefined;
	}) as any;
}

export function mockAttributeMetadataProvider(returnReal?: boolean) {
	const attribMetaProvider = new AttributeMetadataProvider(true, false);
	if (returnReal) {
		attribMetaProvider["getAttributeMetadataXml"] = jest.fn().mockImplementation(() => {
			return require("fs").readFileSync(require("path").join(__dirname, "../../resourcefiles/attributeMetadata.xml"), "utf8");
		}) as any;
	} else {
		attribMetaProvider["getAttributeMetadataXml"] = jest.fn().mockReturnValue("") as any;
	}
	return attribMetaProvider;
}

export function mockExiftoolProcess(readMetadataResult: any) {
	// @ts-ignore
	ExifHandler["createExiftoolProcess"] = jest.fn().mockReturnValue(
		{
			open: () => Promise.resolve(),
			readMetadata: (path: any, options: any) => ({data: [readMetadataResult]}),
			writeMetadata: (path: string, replaceAll: boolean, data: any) => {throw "todo";},
			close: () => Promise.resolve()
		}
	);
}

export function mockExiftoolProcessMultiFiles(readMetadataFileResults: any) {
	// @ts-ignore
	ExifHandler["createExiftoolProcess"] = jest.fn().mockReturnValue(
		{
			open: () => Promise.resolve(),
			readMetadata: (path: any, options: any) => {
				const fileData = readMetadataFileResults[path];
				return fileData ? {data: [fileData]} : undefined;
			},
			writeMetadata: (path: string, replaceAll: boolean, data: any) => {throw "todo";},
			close: () => Promise.resolve()
		}
	);
}


export const ATT_ID_FILE_CREATE_DATE = 7161;
export const ATT_ID_FILE_MODIFY_DATE = 7168;
export const ATT_ID_COMMENT = 7148;
export const ATT_ID_AUTHOR = 16472;
export const ATT_ID_FILE_ACCESS_DATE = 7157;
export const ATT_ID_FILE_EXTENSION = 7175;
export const ATT_ID_MIME_TYPE = 7190;
export const ATT_ID_FILE_TYPE = 7174;

export function sqlAttribute(attId: number, value: any, modified: boolean) {
	return {attId: attId, value: value, modified: modified};
}

export function attFileCreateDate(value: string, modified: boolean) { // WRITABLE
	return sqlAttribute(ATT_ID_FILE_CREATE_DATE, value, modified);
}

export function attFileModifyDate(value: string, modified: boolean) { // WRITABLE
	return sqlAttribute(ATT_ID_FILE_MODIFY_DATE, value, modified);
}

export function attComment(value: string, modified: boolean) { // WRITABLE
	return sqlAttribute(ATT_ID_COMMENT, value, modified);
}

export function attAuthor(value: string, modified: boolean) { // WRITABLE
	return sqlAttribute(ATT_ID_AUTHOR, value, modified);
}

export function attFileAccessDate(value: string, modified: boolean) { // read-only
	return sqlAttribute(ATT_ID_FILE_ACCESS_DATE, value, modified);
}

export function attFileExtension(value: string, modified: boolean) { // read-only
	return sqlAttribute(ATT_ID_FILE_EXTENSION, value, modified);
}

export function attMIMEType(value: string, modified: boolean) { // read-only
	return sqlAttribute(ATT_ID_MIME_TYPE, value, modified);
}

export function metaFileCreateDate(value: string): MetadataMockEntry {
	return fileMetadataEntry("File", "System", "Time", "FileCreateDate", "FileCreateDate", value);
}

export function metaFileModifyDate(value: string): MetadataMockEntry {
	return fileMetadataEntry("File", "System", "Time", "FileModifyDate", "FileModifyDate", value);
}

export function metaComment(value: string): MetadataMockEntry {
	return fileMetadataEntry("File", "File", "Image", "Comment", "Comment", value);
}

export function metaAuthor(value: string): MetadataMockEntry {
	return fileMetadataEntry("PNG", "PNG", "Author", "Author", "Author", value);
}

export function metaFileAccessDate(value: string): MetadataMockEntry {
	return fileMetadataEntry("File", "System", "Time", "FileAccessDate", "FileAccessDate", value);
}

export function metaFileExtension(value: string): MetadataMockEntry {
	return fileMetadataEntry("File", "File", "Other", "FileTypeExtension", "FileTypeExtension", value);
}

export function metaMIMEType(value: string): MetadataMockEntry {
	return fileMetadataEntry("File", "File", "Other", "MIMEType", "MIMEType", value);
}

export type MetadataMockEntry = [string, { "id": string, "val": string }];

export function fileMetadataEntry(g0: string, g1: string, g2: string, name: string, id: string, value: string): MetadataMockEntry {
	return [
		g0 + ":" + g1 + ":" + g2 + ":" + name,
		{
			"id": id,
			"val": value
		}
	];
}

export function buildFileMetadata(entries: MetadataMockEntry[]) {
	const data: any = {};
	entries.forEach(entry => {
		data[entry[0]] = entry[1];
	});
	return data;
}

export function buildMetadata(fileEntries: ({ path: string, entries: MetadataMockEntry[] })[]) {
	const data: any = {};
	fileEntries.forEach(fileEntry => {
		data[fileEntry.path] = buildFileMetadata(fileEntry.entries);
	});
	return data;
}
