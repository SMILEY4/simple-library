import {jest} from "@jest/globals";
import {DbAccess} from "../persistence/dbAcces";
import {FileSystemWrapper} from "../service/fileSystemWrapper";

export function mockFileSystemWrapper(): FileSystemWrapper {
	const fsWrapper = new FileSystemWrapper();
	fsWrapper["move"] = jest.fn().mockReturnValue(undefined) as any;
	fsWrapper["copy"] = jest.fn().mockReturnValue(undefined) as any;
	fsWrapper["createReadStream"] = jest.fn().mockReturnValue(undefined) as any;
	fsWrapper["existsFile"] = jest.fn().mockReturnValue(undefined) as any;
	fsWrapper["existsDir"] = jest.fn().mockReturnValue(undefined) as any;
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

export function mockQueryAll(dbAccess: DbAccess, result: any[]) {
	dbAccess["executeQueryAll"] = jest.fn().mockImplementation((db: any, sql: string) => result) as any;
}
