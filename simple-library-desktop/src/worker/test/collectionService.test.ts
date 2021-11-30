import {mockAttributeMetadataProvider, mockFileSystemWrapper} from "./testUtils";
import {DbAccess} from "../persistence/dbAcces";
import {SQL} from "../persistence/sqlHandler";
import {MemDbAccess} from "./memDbAccess";
import {jest} from "@jest/globals";
import {ActionGetAllCollections} from "../service/collection/actionGetAllCollections";
import {ActionCreateCollection} from "../service/collection/actionCreateCollection";
import {ActionGetCollectionById} from "../service/collection/actionGetCollectionById";
import {ActionDeleteCollection} from "../service/collection/actionDeleteCollection";
import {ActionEditCollection} from "../service/collection/actionEditCollection";
import {ActionMoveItems} from "../service/collection/actionMoveItems";
import {ActionMoveCollection} from "../service/collection/actionMoveCollection";
import {ActionMoveAllCollections} from "../service/collection/actionMoveAllCollections";
import {ActionRemoveItems} from "../service/collection/actionRemoveItems";
import {ActionCreateLibrary} from "../service/library/actionCreateLibrary";
import {Collection} from "../service/collection/collectionCommons";
import {DataRepository} from "../service/dataRepository";
import {SQLiteDataRepository} from "../persistence/sqliteRepository";

describe("collection-service", () => {

	describe("get collections", () => {

		test("get all without item count when empty", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetAll = new ActionGetAllCollections(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			// when
			const result: Promise<Collection[]> = actionGetAll.perform(false);
			// then
			await expect(result).resolves.toHaveLength(0);
		});


		test("get all without item count", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetAll = new ActionGetAllCollections(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group", null),
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "smart", 1, null),
				SQL.insertCollection("Collection 3", "smart", null, "item_id <= 2"),
				SQL.insertCollection("Collection 4", "smart", null, "   "),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
				SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6"),
				SQL.insertItemsIntoCollection(1, [2, 3, 4])
			]);
			// when
			const result: Promise<Collection[]> = actionGetAll.perform(false);
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
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetAll = new ActionGetAllCollections(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group", null),
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "smart", 1, null),
				SQL.insertCollection("Collection 3", "smart", null, "item_id <= 2"),
				SQL.insertCollection("Collection 4", "smart", null, "   "),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
				SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6"),
				SQL.insertItemsIntoCollection(1, [2, 3, 4])
			]);
			// when
			const result: Promise<Collection[]> = actionGetAll.perform(true);
			// then
			await expect(result.then((r: any) => [...r])).resolves.toStrictEqual([
				normalCollection(1, null, 3),
				smartCollection(2, 1, null, 6),
				smartCollection(3, null, "item_id <= 2", 2),
				smartCollection(4, null, null, 6)
			]);
		});

	});


	describe("create collections", () => {

		test("create normal collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetAll = new ActionGetAllCollections(repository);
			const actionCreate = new ActionCreateCollection(repository);
			const actionGetById = new ActionGetCollectionById(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group", null)
			]);
			// when
			const result: Promise<Collection> = actionCreate.perform("normal", "   My Collection", 1, "some query");
			// then
			await expect(result).resolves.toStrictEqual({
				id: 1,
				name: "My Collection",
				type: "normal",
				smartQuery: null,
				itemCount: null,
				groupId: 1
			});
			await expect(actionGetAll.perform(false)).resolves.toHaveLength(1);
			await expect(actionGetById.perform(1)).resolves.toBeDefined();
		});


		test("create smart collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetAll = new ActionGetAllCollections(repository);
			const actionCreate = new ActionCreateCollection(repository);
			const actionGetById = new ActionGetCollectionById(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group", null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
				SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6")
			]);
			// when
			const result: Promise<Collection> = actionCreate.perform("smart", "   My Collection", 1, "item_id <= 2");
			// then
			await expect(result).resolves.toStrictEqual({
				id: 1,
				name: "My Collection",
				type: "smart",
				smartQuery: "item_id <= 2",
				itemCount: null,
				groupId: 1
			});
			await expect(actionGetAll.perform(true).then(c => c[0])).resolves.toStrictEqual({
				id: 1,
				name: "My Collection",
				type: "smart",
				smartQuery: "item_id <= 2",
				itemCount: 2,
				groupId: 1
			});
			await expect(actionGetById.perform(1)).resolves.toBeDefined();
		});


		test("create smart collection with invalid query", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetAll = new ActionGetAllCollections(repository);
			const actionCreate = new ActionCreateCollection(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group", null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4")
			]);
			// when
			const result: Promise<Collection> = actionCreate.perform("smart", "   My Collection", 1, "invalid <= 2");
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetAll.perform(false)).resolves.toHaveLength(0);
		});

	});

	describe("delete collections", () => {

		test("delete existing normal collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionDelete = new ActionDeleteCollection(repository);
			const actionGetAll = new ActionGetAllCollections(repository);
			const actionGetById = new ActionGetCollectionById(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group", null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
				SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6"),
				SQL.insertCollection("Collection 1", "normal", 1, null),
				SQL.insertCollection("Collection 2", "normal", null, null),
				SQL.insertItemsIntoCollection(1, [2, 3, 4]),
				SQL.insertItemsIntoCollection(2, [3, 4, 5])
			]);
			// when
			const result: Promise<void> = actionDelete.perform(1);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetAll.perform(true).then(r => [...r])).resolves.toStrictEqual([{
				id: 2,
				name: "Collection 2",
				type: "normal",
				itemCount: 3,
				groupId: null,
				smartQuery: null
			}]);
			await expect(dbAccess.queryAll(SQL.queryItemsAll([], 0, 999))).resolves.toHaveLength(6);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [], 0, 999))).resolves.toHaveLength(0);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(2, [], 0, 999))).resolves.toHaveLength(3);
			await expect(dbAccess.queryAll(SQL.queryAllGroups())).resolves.toHaveLength(1);
			await expect(actionGetById.perform(1)).resolves.toBeNull();
		});

		test("delete existing smart collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionDelete = new ActionDeleteCollection(repository);
			const actionGetAll = new ActionGetAllCollections(repository);
			const actionGetById = new ActionGetCollectionById(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group", null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
				SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6"),
				SQL.insertCollection("Collection 1", "smart", 1, "item_id <= 2"),
				SQL.insertCollection("Collection 2", "normal", null, null),
				SQL.insertItemsIntoCollection(2, [3, 4, 5])
			]);
			// when
			const result: Promise<void> = actionDelete.perform(1);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetAll.perform(true).then(r => [...r])).resolves.toStrictEqual([{
				id: 2,
				name: "Collection 2",
				type: "normal",
				itemCount: 3,
				groupId: null,
				smartQuery: null
			}]);
			await expect(dbAccess.queryAll(SQL.queryItemsAll([], 0, 999))).resolves.toHaveLength(6);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [], 0, 999))).resolves.toHaveLength(0);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(2, [], 0, 999))).resolves.toHaveLength(3);
			await expect(dbAccess.queryAll(SQL.queryAllGroups())).resolves.toHaveLength(1);
			await expect(actionGetById.perform(1)).resolves.toBeNull();
		});

		test("delete non-existing collection expect no change", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionDelete = new ActionDeleteCollection(repository);
			const actionGetAll = new ActionGetAllCollections(repository);
			const actionGetById = new ActionGetCollectionById(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group", null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1003, "hash3", "thumbnail3"),
				SQL.insertCollection("Collection 1", "smart", 1, "item_id <= 2"),
				SQL.insertCollection("Collection 2", "normal", null, null),
				SQL.insertItemsIntoCollection(2, [1, 2])
			]);
			// when
			const result: Promise<void> = actionDelete.perform(42);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetAll.perform(true)).resolves.toHaveLength(2);
			await expect(dbAccess.queryAll(SQL.queryItemsAll([], 0, 999))).resolves.toHaveLength(3);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(2, [], 0, 999))).resolves.toHaveLength(2);
			await expect(dbAccess.queryAll(SQL.queryAllGroups())).resolves.toHaveLength(1);
			await expect(actionGetById.perform(1)).resolves.toBeDefined();
			await expect(actionGetById.perform(2)).resolves.toBeDefined();
		});

	});

	describe("edit collections", () => {

		test("edit collection (name and query) expect updated", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionEdit = new ActionEditCollection(repository, actionGetById);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group", null),
				SQL.insertCollection("Collection 1", "smart", 1, null)
			]);
			// when
			const result = actionEdit.perform(1, "New Name", "item_id <= 2");
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetById.perform(1)).resolves.toStrictEqual({
				id: 1,
				name: "New Name",
				type: "smart",
				groupId: 1,
				smartQuery: "item_id <= 2",
				itemCount: null
			});
		});

		test("edit normal collection query expect no change", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionEdit = new ActionEditCollection(repository, actionGetById);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group", null),
				SQL.insertCollection("Collection 1", "normal", 1, null)
			]);
			// when
			const result = actionEdit.perform(1, "Collection 1", "item_id <= 2");
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetById.perform(1)).resolves.toStrictEqual({
				id: 1,
				name: "Collection 1",
				type: "normal",
				groupId: 1,
				smartQuery: null,
				itemCount: null
			});
		});

		test("edit collection set fields null", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionEdit = new ActionEditCollection(repository, actionGetById);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group", null),
				SQL.insertCollection("Collection 1", "smart", 1, "item_id <= 2")
			]);
			// when
			const result = actionEdit.perform(1, null, null);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetById.perform(1)).resolves.toStrictEqual({
				id: 1,
				name: "Collection 1",
				type: "smart",
				groupId: 1,
				smartQuery: null,
				itemCount: null
			});
		});

		test("edit non-existing collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionEdit = new ActionEditCollection(repository, actionGetById);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group", null),
				SQL.insertCollection("Collection 1", "smart", 1, null)
			]);
			// when
			const result = actionEdit.perform(42, "New Name", "item_id <= 2");
			// then
			await expect(result).rejects.toBeDefined();
		});

		test("edit smart collection set invalid query", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionEdit = new ActionEditCollection(repository, actionGetById);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group", null),
				SQL.insertCollection("Collection 1", "smart", 1, "item_id <= 2")
			]);
			// when
			const result = actionEdit.perform(1, "New Name", "invalid > 2");
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetById.perform(1)).resolves.toStrictEqual({
				id: 1,
				name: "Collection 1",
				type: "smart",
				groupId: 1,
				smartQuery: "item_id <= 2",
				itemCount: null
			});
		});


	});

	describe("move collections", () => {


		test("move collection into sub-group", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionMove = new ActionMoveCollection(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", 1),
				SQL.insertCollection("Collection 1", "normal", 1, null)
			]);
			// when
			const result = actionMove.perform(1, 2);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetById.perform(1)).resolves.toStrictEqual({
				id: 1,
				name: "Collection 1",
				type: "normal",
				groupId: 2,
				smartQuery: null,
				itemCount: null
			});
		});

		test("move top-level collection into sub-group", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionMove = new ActionMoveCollection(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", 1),
				SQL.insertCollection("Collection 1", "normal", null, null)
			]);
			// when
			const result = actionMove.perform(1, 2);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetById.perform(1).then(c => c.groupId)).resolves.toBe(2);
		});

		test("move collection to top-level", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionMove = new ActionMoveCollection(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertCollection("Collection 1", "normal", 1, null)
			]);
			// when
			const result = actionMove.perform(1, null);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetById.perform(1).then(c => c.groupId)).resolves.toBe(null);
		});

		test("move all top level collections into group", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionMoveAll = new ActionMoveAllCollections(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", null),
				SQL.insertGroup("Group 3", 1),
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "normal", null, null),
				SQL.insertCollection("Collection 3", "normal", 2, null),
				SQL.insertCollection("Collection 4", "normal", 3, null)
			]);
			// when
			const result = actionMoveAll.perform(null, 2);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetById.perform(1).then(c => c.groupId)).resolves.toBe(2);
			await expect(actionGetById.perform(2).then(c => c.groupId)).resolves.toBe(2);
			await expect(actionGetById.perform(3).then(c => c.groupId)).resolves.toBe(2);
			await expect(actionGetById.perform(4).then(c => c.groupId)).resolves.toBe(3);
		});

		test("move all collections into different group", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionMoveAll = new ActionMoveAllCollections(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", null),
				SQL.insertGroup("Group 3", 1),
				SQL.insertCollection("Collection 1", "normal", 1, null),
				SQL.insertCollection("Collection 2", "normal", 1, null),
				SQL.insertCollection("Collection 3", "normal", 2, null),
				SQL.insertCollection("Collection 4", "normal", 3, null)
			]);
			// when
			const result = actionMoveAll.perform(1, 2);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetById.perform(1).then(c => c.groupId)).resolves.toBe(2);
			await expect(actionGetById.perform(2).then(c => c.groupId)).resolves.toBe(2);
			await expect(actionGetById.perform(3).then(c => c.groupId)).resolves.toBe(2);
			await expect(actionGetById.perform(4).then(c => c.groupId)).resolves.toBe(3);
		});

		test("move no collections into different group", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionMoveAll = new ActionMoveAllCollections(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", null),
				SQL.insertGroup("Group 3", 1),
				SQL.insertCollection("Collection 1", "normal", 1, null),
				SQL.insertCollection("Collection 2", "normal", 1, null),
				SQL.insertCollection("Collection 3", "normal", 2, null),
				SQL.insertCollection("Collection 4", "normal", 3, null)
			]);
			// when
			const result = actionMoveAll.perform(42, 2);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetById.perform(1).then(c => c.groupId)).resolves.toBe(1);
			await expect(actionGetById.perform(2).then(c => c.groupId)).resolves.toBe(1);
			await expect(actionGetById.perform(3).then(c => c.groupId)).resolves.toBe(2);
			await expect(actionGetById.perform(4).then(c => c.groupId)).resolves.toBe(3);
		});

		test("move collections into original group", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionMoveAll = new ActionMoveAllCollections(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", null),
				SQL.insertGroup("Group 3", 1),
				SQL.insertCollection("Collection 1", "normal", 1, null),
				SQL.insertCollection("Collection 2", "normal", 1, null),
				SQL.insertCollection("Collection 3", "normal", 2, null),
				SQL.insertCollection("Collection 4", "normal", 3, null)
			]);
			// when
			const result = actionMoveAll.perform(1, 1);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetById.perform(1).then(c => c.groupId)).resolves.toBe(1);
			await expect(actionGetById.perform(2).then(c => c.groupId)).resolves.toBe(1);
			await expect(actionGetById.perform(3).then(c => c.groupId)).resolves.toBe(2);
			await expect(actionGetById.perform(4).then(c => c.groupId)).resolves.toBe(3);
		});

		test("move collections into non-existing group", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionMoveAll = new ActionMoveAllCollections(repository);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", null),
				SQL.insertGroup("Group 3", 1),
				SQL.insertCollection("Collection 1", "normal", 1, null),
				SQL.insertCollection("Collection 2", "normal", 1, null),
				SQL.insertCollection("Collection 3", "normal", 2, null),
				SQL.insertCollection("Collection 4", "normal", 3, null)
			]);
			// when
			const result = actionMoveAll.perform(1, 42);
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetById.perform(1).then(c => c.groupId)).resolves.toBe(1);
			await expect(actionGetById.perform(2).then(c => c.groupId)).resolves.toBe(1);
			await expect(actionGetById.perform(3).then(c => c.groupId)).resolves.toBe(2);
			await expect(actionGetById.perform(4).then(c => c.groupId)).resolves.toBe(3);
		});

	});


	describe("move items to collections", () => {

		test("move some items to collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionMoveItems = new ActionMoveItems(repository, actionGetById);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "normal", null, null),
				SQL.insertCollection("Collection 3", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
				SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3]),
				SQL.insertItemsIntoCollection(2, [3, 4, 5]),
				SQL.insertItemsIntoCollection(3, [1, 6])
			]);
			const mapToItemIds = (rows: any[]) => [...rows.map(r => r.item_id)];
			// when
			const result = actionMoveItems.perform(1, 2, [2, 3], false);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([1]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(2, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([2, 3, 4, 5]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(3, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([1, 6]);
		});

		test("copy items to collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionMoveItems = new ActionMoveItems(repository, actionGetById);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "normal", null, null),
				SQL.insertCollection("Collection 3", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
				SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3]),
				SQL.insertItemsIntoCollection(2, [3, 4, 5]),
				SQL.insertItemsIntoCollection(3, [1, 6])
			]);
			const mapToItemIds = (rows: any[]) => [...rows.map(r => r.item_id)];
			// when
			const result = actionMoveItems.perform(1, 2, [2, 3], true);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([1, 2, 3]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(2, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([2, 3, 4, 5]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(3, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([1, 6]);
		});

		test("move items to non-existing collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionMoveItems = new ActionMoveItems(repository, actionGetById);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "normal", null, null),
				SQL.insertCollection("Collection 3", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
				SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3])
			]);
			const mapToItemIds = (rows: any[]) => [...rows.map(r => r.item_id)];
			// when
			const result = actionMoveItems.perform(1, 42, [2, 3], false);
			// then
			await expect(result).rejects.toBeDefined();
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([1, 2, 3]);
		});

		test("move items from non-existing collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionMoveItems = new ActionMoveItems(repository, actionGetById);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "normal", null, null),
				SQL.insertCollection("Collection 3", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
				SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3])
			]);
			const mapToItemIds = (rows: any[]) => [...rows.map(r => r.item_id)];
			// when
			const result = actionMoveItems.perform(42, 1, [4, 5], false);
			// then
			await expect(result).rejects.toBeDefined();
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([1, 2, 3]);
		});

		test("move items same collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionMoveItems = new ActionMoveItems(repository, actionGetById);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "normal", null, null),
				SQL.insertCollection("Collection 3", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
				SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3])
			]);
			const mapToItemIds = (rows: any[]) => [...rows.map(r => r.item_id)];
			// when
			const result = actionMoveItems.perform(1, 1, [2, 3], false);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([1, 2, 3]);
		});

		test("move non-existing items to collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionMoveItems = new ActionMoveItems(repository, actionGetById);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "normal", null, null),
				SQL.insertCollection("Collection 3", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
				SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3]),
				SQL.insertItemsIntoCollection(2, [3, 4, 5])
			]);
			const mapToItemIds = (rows: any[]) => [...rows.map(r => r.item_id)];
			// when
			const result = actionMoveItems.perform(1, 2, [10, 11], false);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([1, 2, 3]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(2, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([3, 4, 5]);
		});

		test("move items to smart collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionMoveItems = new ActionMoveItems(repository, actionGetById);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "smart", null, "item_id > 2"),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
				SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3]),
				SQL.insertItemsIntoCollection(2, [3, 4, 5])
			]);
			const mapToItemIds = (rows: any[]) => [...rows.map(r => r.item_id)];
			// when
			const result = actionMoveItems.perform(1, 2, [10, 11], false);
			// then
			await expect(result).rejects.toBeDefined();
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([1, 2, 3]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(2, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([3, 4, 5]);
		});

		test("move items from smart collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionMoveItems = new ActionMoveItems(repository, actionGetById);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "smart", null, "item_id > 2"),
				SQL.insertCollection("Collection 2", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
				SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6"),
				SQL.insertItemsIntoCollection(2, [1, 2, 3])
			]);
			const mapToItemIds = (rows: any[]) => [...rows.map(r => r.item_id)];
			// when
			const result = actionMoveItems.perform(1, 2, [3, 4, 5], false);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(2, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([1, 2, 3, 4, 5]);
		});

	});


	describe("remove items from collections", () => {

		test("remove some items from collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionRemoveItems = new ActionRemoveItems(repository, actionGetById);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertCollection("Collection 2", "normal", null, null),
				SQL.insertCollection("Collection 3", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
				SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3]),
				SQL.insertItemsIntoCollection(2, [1, 6])
			]);
			const mapToItemIds = (rows: any[]) => [...rows.map(r => r.item_id)];
			// when
			const result = actionRemoveItems.perform(1, [2, 3, 4]);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([1]);
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(2, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([1, 6]);
		});

		test("remove some items from non-existing collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionRemoveItems = new ActionRemoveItems(repository, actionGetById);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
				SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6"),
				SQL.insertItemsIntoCollection(1, [1, 2, 3])
			]);
			const mapToItemIds = (rows: any[]) => [...rows.map(r => r.item_id)];
			// when
			const result = actionRemoveItems.perform(42, [2, 3, 4]);
			// then
			await expect(result).rejects.toBeDefined();
			await expect(dbAccess.queryAll(SQL.queryItemsByCollection(1, [], 0, 999)).then(mapToItemIds)).resolves.toStrictEqual([1, 2, 3]);
		});

		test("remove some items from smart collection", async () => {
			// given
			const [actionCreateLibrary, repository, dbAccess] = mockCollectionService();
			const actionGetById = new ActionGetCollectionById(repository);
			const actionRemoveItems = new ActionRemoveItems(repository, actionGetById);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "smart", null, "item_id > 2"),
				SQL.insertItem("/path/to/file/1", 1000, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1001, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1002, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1003, "hash4", "thumbnail4"),
				SQL.insertItem("/path/to/file/5", 1004, "hash5", "thumbnail5"),
				SQL.insertItem("/path/to/file/6", 1005, "hash6", "thumbnail6")
			]);
			// when
			const result = actionRemoveItems.perform(1, [2, 3, 4]);
			// then
			await expect(result).rejects.toBeDefined();
		});

	});
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

function mockCollectionService(): [ActionCreateLibrary, DataRepository, DbAccess] {
	const dbAccess = new MemDbAccess();
	const fsWrapper = mockFileSystemWrapper();
	fsWrapper.existsFile = jest.fn().mockReturnValue(false) as any;
	const actionCreateLibrary = new ActionCreateLibrary(new SQLiteDataRepository(dbAccess), fsWrapper, mockAttributeMetadataProvider());
	return [actionCreateLibrary, new SQLiteDataRepository(dbAccess), dbAccess];
}
