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

