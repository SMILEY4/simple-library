import {jest} from "@jest/globals";
import {LibraryFileHandle, LibraryService} from "../service/libraryService";
import {mockDateNow, mockFileSystemWrapper} from "./mockSetup";
import {DbAccess} from "../persistence/dbAcces";
import {FileSystemWrapper} from "../service/fileSystemWrapper";
import {MemDbAccess} from "./memDbAccess";
import {SQL} from "../persistence/sqlHandler";

describe("library-service", () => {

	test("create new valid library", async () => {
		// given
		const name = "My 1. Test Library!";
		const dir = "my/test/directory";
		const expectedFilePath = "my\\test\\directory\\My1TestLibrary.db";
		const expectedTimestamp = Date.now();
		const [libraryService, dbAccess, fsWrapper] = mockLibraryService();
		mockExistsFile(fsWrapper, false);
		mockDateNow(expectedTimestamp);
		// when
		const result: Promise<LibraryFileHandle> = libraryService.create(name, dir, true);
		// then
		await expect(result).resolves.toStrictEqual({path: expectedFilePath, name: name});
		await expect(libraryService.getCurrentInformation()).resolves.toStrictEqual({
			"name": name,
			"timestampCreated": expectedTimestamp,
			"timestampLastOpened": expectedTimestamp
		});
		expect(dbAccess.getDatabaseUrl()).toBe(expectedFilePath);
	});


	test("dont create new library when file already exists", async () => {
		// given
		const [libraryService, dbAccess, fsWrapper] = mockLibraryService();
		mockExistsFile(fsWrapper, true);
		// when
		const result: Promise<LibraryFileHandle> = libraryService.create("name", "dir", true);
		// then
		await expect(result).rejects.toBeDefined();
		await expect(libraryService.getCurrentInformation()).rejects.toBeDefined();
		expect(dbAccess.getDatabaseUrl()).toBe(null);
	});

	test("dont create new library when name is invalid", async () => {
		// given
		const [libraryService, dbAccess, fsWrapper] = mockLibraryService();
		mockExistsFile(fsWrapper, true);
		// when
		const result: Promise<LibraryFileHandle> = libraryService.create("./_", "dir", true);
		// then
		await expect(result).rejects.toBeDefined();
		expect(dbAccess.getDatabaseUrl()).toBe(null);
	});


	test("open existing library", async () => {
		// given
		const filePath = "my\\test\\directory\\TestLib.db";
		const libName = "MyLib";
		const tsNow = Date.now();
		const tsCreated = Date.now() - 2000;
		const [libraryService, dbAccess, fsWrapper] = mockLibraryService();
		mockExistsFile(fsWrapper, true);
		mockDateNow(tsNow);
		await dbAccess.setDatabasePath(filePath, false);
		await dbAccess.runMultipleSeq(SQL.initializeNewLibrary("MyLib", tsCreated));
		// when
		const result: Promise<LibraryFileHandle> = libraryService.open(filePath);
		// then
		await expect(result).resolves.toStrictEqual({path: filePath, name: libName});
		expect(dbAccess.getDatabaseUrl()).toBe(filePath);
		await expect(libraryService.getCurrentInformation()).resolves.toStrictEqual({
			"name": libName,
			"timestampCreated": tsCreated,
			"timestampLastOpened": tsNow
		});
	});

	test("open non-existing library", async () => {
		// given
		const filePath = "my\\test\\directory\\NoLib.db";
		const [libraryService, dbAccess, fsWrapper] = mockLibraryService();
		mockExistsFile(fsWrapper, false);
		// when
		const result: Promise<LibraryFileHandle> = libraryService.open(filePath);
		// then
		await expect(result).rejects.toBeDefined();
		expect(dbAccess.getDatabaseUrl()).toBe(null);
		await expect(libraryService.getCurrentInformation()).rejects.toBeDefined();
	});

	test("close current library", async () => {
		// given
		const [libraryService, dbAccess] = mockLibraryService();
		await dbAccess.setDatabasePath("my/path/to/MyLib.db", false);
		// when
		const result: Promise<void> = libraryService.closeCurrent();
		// then
		await expect(result).resolves.toBeUndefined();
		expect(dbAccess.getDatabaseUrl()).toBe(null);
	});
});


function mockLibraryService(): [LibraryService, DbAccess, FileSystemWrapper] {
	const dbAccess = new MemDbAccess();
	const fsWrapper = mockFileSystemWrapper();
	const libraryService: LibraryService = new LibraryService(dbAccess, fsWrapper);
	return [libraryService, dbAccess, fsWrapper];
}

function mockExistsFile(fsWrapper: FileSystemWrapper, exists: boolean) {
	fsWrapper.existsFile = jest.fn().mockReturnValue(exists) as any;
}