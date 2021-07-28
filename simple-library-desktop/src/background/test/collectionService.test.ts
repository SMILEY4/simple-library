import {mockFileSystemWrapper} from "./mockSetup";
import {Collection, CollectionService, CollectionType} from "../service/collectionService";
import {DbAccess} from "../persistence/dbAcces";
import {SQL} from "../persistence/sqlHandler";
import {MemDbAccess} from "./memDbAccess";
import {LibraryService} from "../service/libraryService";
import {jest} from "@jest/globals";

describe("collection-service", () => {


	test("get all without item count when empty", async () => {
		// given
		const [collectionService, libraryService, dbAccess] = mockCollectionService();
		await libraryService.create("TestLib", "path/to/test", false);
		// when
		const result: Promise<Collection[]> = collectionService.getAll(false);
		// then
		await expect(result).resolves.toHaveLength(0);
	});


	test("get all without item count", async () => {
		// given
		const [collectionService, libraryService, dbAccess] = mockCollectionService();
		await libraryService.create("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertGroup("Group", null)
		]);
		await dbAccess.runMultipleSeq([
			SQL.insertCollection("Collection 1", "normal", null, null),
			SQL.insertCollection("Collection 2", "smart", 1, null),
			SQL.insertCollection("Collection 3", "smart", null, "item_id <= 2"),
			SQL.insertCollection("Collection 4", "smart", null, "   ")
		]);
		await dbAccess.runMultipleSeq([
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
			SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
			SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6")
		]);
		await dbAccess.runMultipleSeq([
			SQL.insertItemsToCollection(1, [2, 3, 4])
		]);
		// when
		const result: Promise<Collection[]> = collectionService.getAll(false);
		// then
		await expect(result.then((r: any) => [...r])).resolves.toStrictEqual([
			normalCollection(1, null, null),
			smartCollection(2, 1, null, null),
			smartCollection(3, null, "item_id <= 2", null),
			smartCollection(4, null, null, null)
		]);
	});


	test("get all with item count", async () => {
		// given
		const [collectionService, libraryService, dbAccess] = mockCollectionService();
		await libraryService.create("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertGroup("Group", null)
		]);
		await dbAccess.runMultipleSeq([
			SQL.insertCollection("Collection 1", "normal", null, null),
			SQL.insertCollection("Collection 2", "smart", 1, null),
			SQL.insertCollection("Collection 3", "smart", null, "item_id <= 2"),
			SQL.insertCollection("Collection 4", "smart", null, "   ")
		]);
		await dbAccess.runMultipleSeq([
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
			SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
			SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6")
		]);
		await dbAccess.runMultipleSeq([
			SQL.insertItemsToCollection(1, [2, 3, 4])
		]);
		// when
		const result: Promise<Collection[]> = collectionService.getAll(true);
		// then
		await expect(result.then((r: any) => [...r])).resolves.toStrictEqual([
			normalCollection(1, null, 3),
			smartCollection(2, 1, null, 6),
			smartCollection(3, null, "item_id <= 2", 2),
			smartCollection(4, null, null, 6)
		]);
	});

	test("create normal collection", async () => {
		// given
		const [collectionService, libraryService, dbAccess] = mockCollectionService();
		await libraryService.create("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertGroup("Group", null)
		]);
		// when
		const result: Promise<Collection> = collectionService.create("   My Collection", CollectionType.NORMAL, 1, "some query");
		// then
		await expect(result).resolves.toStrictEqual({
			id: 1,
			name: "My Collection",
			type: CollectionType.NORMAL,
			smartQuery: null,
			itemCount: null,
			groupId: 1
		});
		await expect(collectionService.getAll(false)).resolves.toHaveLength(1)
	});

	test("create smart collection", async () => {
		// given
		const [collectionService, libraryService, dbAccess] = mockCollectionService();
		await libraryService.create("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertGroup("Group", null)
		]);
		await dbAccess.runMultipleSeq([
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
			SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
			SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6")
		]);
		// when
		const result: Promise<Collection> = collectionService.create("   My Collection", CollectionType.SMART, 1, "item_id <= 2");
		// then
		await expect(result).resolves.toStrictEqual({
			id: 1,
			name: "My Collection",
			type: CollectionType.SMART,
			smartQuery: "item_id <= 2",
			itemCount: null,
			groupId: 1
		});
		await expect(collectionService.getAll(false)).resolves.toHaveLength(1)
	});

	test("create smart collection with invalid query", async () => {
		// given
		const [collectionService, libraryService, dbAccess] = mockCollectionService();
		await libraryService.create("TestLib", "path/to/test", false);
		await dbAccess.runMultipleSeq([
			SQL.insertGroup("Group", null)
		]);
		await dbAccess.runMultipleSeq([
			SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
			SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
			SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
			SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
			SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
			SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6")
		]);
		// when
		const result: Promise<Collection> = collectionService.create("   My Collection", CollectionType.SMART, 1, "invalid <= 2");
		// then
		await expect(result).rejects.toBeDefined();
		await expect(collectionService.getAll(false)).resolves.toHaveLength(0)
	});

	// todo
	//  - delete
	//  - edit
	//  - move
	//  - move all of parent
	//  - move items
	//  - remove items

});

function normalCollection(id: number, groupId: number | null, itemCount: number | null): any {
	return {
		id: id,
		name: "Collection " + id,
		type: "normal",
		smartQuery: null,
		groupId: groupId,
		itemCount: itemCount
	};
}

function smartCollection(id: number, groupId: number | null, smartQuery: string | null | undefined, itemCount: number | null): any {
	return {
		id: id,
		name: "Collection " + id,
		type: "smart",
		smartQuery: smartQuery,
		groupId: groupId,
		itemCount: itemCount
	};
}

function mockCollectionService(): [CollectionService, LibraryService, DbAccess] {
	const dbAccess = new MemDbAccess();
	const fsWrapper = mockFileSystemWrapper();
	fsWrapper.existsFile = jest.fn().mockReturnValue(false) as any;
	const collectionService: CollectionService = new CollectionService(dbAccess);
	const libraryService = new LibraryService(dbAccess, fsWrapper);
	return [collectionService, libraryService, dbAccess];
}