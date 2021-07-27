import {jest} from "@jest/globals";
import {LibraryService} from "../service/libraryService";
import {mockDbAccess, mockFileSystemWrapper, mockQueryAll} from "./mockSetup";
import {DbAccess} from "../persistence/dbAcces";
import {FileSystemWrapper} from "../service/fileSystemWrapper";

test("create new valid library", async () => {
	const name = "My 1. Test Library!";
	const dir = "my/test/directory";
	const expectedFilePath = "my\\test\\directory\\My1TestLibrary.db";

	const [libraryService, dbAccess, fsWrapper] = mockLibraryService();
	mockExistsFile(fsWrapper, false);
	spyCreateDbFile(dbAccess);

	await expect(libraryService.create(name, dir)).resolves.toStrictEqual({path: expectedFilePath, name: name});
	expect(dbAccess.getDatabaseUrl()).toBe(expectedFilePath);
	expect(funCreateDbFile(dbAccess)).toHaveBeenCalledWith(expectedFilePath);
});


test("dont create new library when file already exists", async () => {
	const [libraryService, dbAccess, fsWrapper] = mockLibraryService();
	mockExistsFile(fsWrapper, true);
	spyCreateDbFile(dbAccess);

	await expect(libraryService.create("name", "dir")).rejects.toBeDefined();
	expect(dbAccess.getDatabaseUrl()).toBe(null);
	expect(funCreateDbFile(dbAccess)).toHaveBeenCalledTimes(0);
});


test("open existing library", async () => {
	const filePath = "my\\test\\directory\\TestLib.db";
	const libName = "MyLib";

	const [libraryService, dbAccess, fsWrapper] = mockLibraryService();
	mockExistsFile(fsWrapper, true);
	spyCreateDbFile(dbAccess);
	mockQueryAll(dbAccess, [
		{key: "library_name", value: libName},
		{key: "timestamp_created", value: 1234},
		{key: "timestamp_last_opened", value: 5678}
	]);

	await expect(libraryService.open(filePath)).resolves.toStrictEqual({path: filePath, name: libName});
	expect(dbAccess.getDatabaseUrl()).toBe(filePath);
	expect(funCreateDbFile(dbAccess)).toHaveBeenCalledTimes(0);
});

test("open non-existing library", async () => {
	const filePath = "my\\test\\directory\\NoLib.db";

	const [libraryService, dbAccess, fsWrapper] = mockLibraryService();
	mockExistsFile(fsWrapper, false);
	spyCreateDbFile(dbAccess);

	await expect(libraryService.open(filePath)).rejects.toBeDefined();
	expect(dbAccess.getDatabaseUrl()).toBe(null);
	expect(funCreateDbFile(dbAccess)).toHaveBeenCalledTimes(0);
});

test("close current library", async () => {
	const [libraryService, dbAccess] = mockLibraryService();
	await dbAccess.setDatabasePath("my/path/to/MyLib.db", false);

	await expect(libraryService.closeCurrent()).resolves.toBeUndefined();
	expect(dbAccess.getDatabaseUrl()).toBe(null);
});


function mockLibraryService(): [LibraryService, DbAccess, FileSystemWrapper] {
	const dbAccess = mockDbAccess();
	const fsWrapper = mockFileSystemWrapper();
	const libraryService: LibraryService = new LibraryService(dbAccess, fsWrapper);
	return [libraryService, dbAccess, fsWrapper];
}

function mockExistsFile(fsWrapper: FileSystemWrapper, exists: boolean) {
	fsWrapper.existsFile = jest.fn().mockReturnValue(exists) as any;
}

function spyCreateDbFile(dbAccess: DbAccess) {
	// @ts-ignore
	jest.spyOn(dbAccess, "createDbFile");
}

function funCreateDbFile(dbAccess: DbAccess): any {
	return dbAccess["createDbFile"];
}
