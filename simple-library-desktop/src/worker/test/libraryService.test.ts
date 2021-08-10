import {jest} from "@jest/globals";
import {mockDateNow, mockFileSystemWrapper} from "./mockSetup";
import {DbAccess} from "../persistence/dbAcces";
import {FileSystemWrapper} from "../service/fileSystemWrapper";
import {MemDbAccess} from "./memDbAccess";
import {SQL} from "../persistence/sqlHandler";
import {ActionCreateLibrary} from "../service/library/actionCreateLibrary";
import {ActionGetLibraryInfo} from "../service/library/ActionGetLibraryInfo";
import {ActionOpenLibrary} from "../service/library/actionOpenLibrary";
import {ActionCloseLibrary} from "../service/library/actionCloseLibrary";
import {LibraryFileHandle} from "../service/library/libraryCommons";

describe("library-service", () => {

	describe("create", () => {

		test("create new valid library", async () => {
			// given
			const name = "My 1. Test Library!";
			const dir = "my/test/directory";
			const expectedFilePath = "my\\test\\directory\\My1TestLibrary.db";
			const expectedTimestamp = Date.now();
			const [dbAccess, fsWrapper] = mockLibraryService();
			const actionCreateLibrary = new ActionCreateLibrary(dbAccess, fsWrapper);
			const actionGetLibraryInfo = new ActionGetLibraryInfo(dbAccess);
			mockExistsFile(fsWrapper, false);
			mockDateNow(expectedTimestamp);
			// when
			const result: Promise<LibraryFileHandle> = actionCreateLibrary.perform(name, dir, true);
			// then
			await expect(result).resolves.toStrictEqual({path: expectedFilePath, name: name});
			await expect(actionGetLibraryInfo.perform()).resolves.toStrictEqual({
				"name": name,
				"timestampCreated": expectedTimestamp,
				"timestampLastOpened": expectedTimestamp
			});
			expect(dbAccess.getDatabaseUrl()).toBe(expectedFilePath);
		});


		test("dont create new library when file already exists", async () => {
			// given
			const [dbAccess, fsWrapper] = mockLibraryService();
			const actionCreateLibrary = new ActionCreateLibrary(dbAccess, fsWrapper);
			const actionGetLibraryInfo = new ActionGetLibraryInfo(dbAccess);
			mockExistsFile(fsWrapper, true);
			// when
			const result: Promise<LibraryFileHandle> = actionCreateLibrary.perform("name", "dir", true);
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetLibraryInfo.perform()).rejects.toBeDefined();
			expect(dbAccess.getDatabaseUrl()).toBe(null);
		});


		test("dont create new library when name is invalid", async () => {
			// given
			const [dbAccess, fsWrapper] = mockLibraryService();
			const actionCreateLibrary = new ActionCreateLibrary(dbAccess, fsWrapper);
			mockExistsFile(fsWrapper, true);
			// when
			const result: Promise<LibraryFileHandle> = actionCreateLibrary.perform("./_", "dir", true);
			// then
			await expect(result).rejects.toBeDefined();
			expect(dbAccess.getDatabaseUrl()).toBe(null);
		});

	});


	describe("create", () => {

		test("open existing library", async () => {
			// given
			const filePath = "my\\test\\directory\\TestLib.db";
			const libName = "MyLib";
			const tsNow = Date.now();
			const tsCreated = Date.now() - 2000;
			const [dbAccess, fsWrapper] = mockLibraryService();
			const actionGetLibraryInfo = new ActionGetLibraryInfo(dbAccess);
			const actionOpenLibrary = new ActionOpenLibrary(dbAccess, fsWrapper, actionGetLibraryInfo);
			mockExistsFile(fsWrapper, true);
			mockDateNow(tsNow);
			await dbAccess.setDatabasePath(filePath, false);
			await dbAccess.runMultipleSeq(SQL.initializeNewLibrary("MyLib", tsCreated));
			// when
			const result: Promise<LibraryFileHandle> = actionOpenLibrary.perform(filePath);
			// then
			await expect(result).resolves.toStrictEqual({path: filePath, name: libName});
			expect(dbAccess.getDatabaseUrl()).toBe(filePath);
			await expect(actionGetLibraryInfo.perform()).resolves.toStrictEqual({
				"name": libName,
				"timestampCreated": tsCreated,
				"timestampLastOpened": tsNow
			});
		});


		test("open non-existing library", async () => {
			// given
			const filePath = "my\\test\\directory\\NoLib.db";
			const [dbAccess, fsWrapper] = mockLibraryService();
			const actionGetLibraryInfo = new ActionGetLibraryInfo(dbAccess);
			const actionOpenLibrary = new ActionOpenLibrary(dbAccess, fsWrapper, actionGetLibraryInfo);
			mockExistsFile(fsWrapper, false);
			// when
			const result: Promise<LibraryFileHandle> = actionOpenLibrary.perform(filePath);
			// then
			await expect(result).rejects.toBeDefined();
			expect(dbAccess.getDatabaseUrl()).toBe(null);
			await expect(actionGetLibraryInfo.perform()).rejects.toBeDefined();
		});

	});


	describe("close", () => {

		test("close current library", async () => {
			// given
			const [dbAccess] = mockLibraryService();
			const actionCloseLibrary = new ActionCloseLibrary(dbAccess);
			await dbAccess.setDatabasePath("my/path/to/MyLib.db", false);
			// when
			actionCloseLibrary.perform();
			// then
			expect(dbAccess.getDatabaseUrl()).toBe(null);
		});

	});


});


function mockLibraryService(): [DbAccess, FileSystemWrapper] {
	const dbAccess = new MemDbAccess();
	const fsWrapper = mockFileSystemWrapper();
	return [dbAccess, fsWrapper];
}

function mockExistsFile(fsWrapper: FileSystemWrapper, exists: boolean) {
	fsWrapper.existsFile = jest.fn().mockReturnValue(exists) as any;
}