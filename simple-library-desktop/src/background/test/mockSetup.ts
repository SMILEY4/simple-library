import {jest} from "@jest/globals";
import {DbAccess} from "../persistence/dbAcces";
import {FileSystemWrapper} from "../service/fileSystemWrapper";
import {ConfigAccess} from "../persistence/configAccess";
import {SQL} from "../persistence/sqlHandler";
import {Channel} from "../../common/messaging/core/channel";
import {ItemsImportStatusChannel} from "../../common/messaging/channels/channels";

export function mockSqlReturnQueryName() {
	Object.getOwnPropertyNames(SQL).forEach(item => {
		// @ts-ignore
		if (typeof SQL[item] === "function") {
			// @ts-ignore
			SQL[item] = () => item as any;
			// @ts-ignore
			Object.defineProperty(SQL[item], "name", {value: item});
		}
	});
	SQL.queryItemCountByQuery = (query: string) => "queryItemCountByQuery(" + query + ")";
	Object.defineProperty(SQL.queryItemCountByQuery, "name", {value: "queryItemCountByQuery"});
}


export function mockFileSystemWrapper(): FileSystemWrapper {
	const fsWrapper = new FileSystemWrapper();
	fsWrapper["move"] = jest.fn().mockReturnValue(Promise.resolve(undefined)) as any;
	fsWrapper["copy"] = jest.fn().mockReturnValue(Promise.resolve(undefined)) as any;
	fsWrapper["createReadStream"] = jest.fn().mockReturnValue(undefined) as any;
	fsWrapper["existsFile"] = jest.fn().mockReturnValue(undefined) as any;
	fsWrapper["existsDir"] = jest.fn().mockReturnValue(undefined) as any;
	fsWrapper["open"] = jest.fn().mockReturnValue(Promise.resolve(undefined)) as any;
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


