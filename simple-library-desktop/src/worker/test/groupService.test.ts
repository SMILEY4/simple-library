import {DbAccess} from "../persistence/dbAcces";
import {MemDbAccess} from "./memDbAccess";
import {SQL} from "../persistence/sqlHandler";
import {mockFileSystemWrapper} from "./mockSetup";
import {jest} from "@jest/globals";
import {ActionGetAllCollections} from "../service/collection/actionGetAllCollections";
import {ActionCreateLibrary} from "../service/library/actionCreateLibrary";
import {ActionGetGroupById} from "../service/group/actionGetGroupById";
import {ActionGetAllGroups} from "../service/group/actionGetAllGroups";
import {ActionGetGroupTree} from "../service/group/actionGetGroupTree";
import {ActionMoveGroup} from "../service/group/actionMoveGroup";
import {ActionRenameGroup} from "../service/group/actionRenameGroup";
import {ActionDeleteGroup} from "../service/group/actionDeleteGroup";
import {ActionMoveAllGroups} from "../service/group/actionMoveAllGroups";
import {ActionMoveAllCollections} from "../service/collection/actionMoveAllCollections";
import {ActionCreateGroup} from "../service/group/actionCreateGroup";
import {Group} from "../service/group/groupCommons";
import {Collection, CollectionType} from "../service/collection/collectionCommons";


describe("group-service", () => {

	describe("get", () => {

		test("get by id", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetById = new ActionGetGroupById(dbAccess);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", 1),
				SQL.insertGroup("Group 3", null),
				SQL.insertCollection("Collection 1", "normal", 1, null),
				SQL.insertCollection("Collection 2", "smart", 0, "item_id <= 2")
			]);
			// when
			const result: Promise<Group | null> = actionGetById.perform(2);
			// then
			await expect(result).resolves.toEqual(group(2, "Group 2", 1, []));
		});


		test("get non-existing by id", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetById = new ActionGetGroupById(dbAccess);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null)
			]);
			// when
			const result: Promise<Group | null> = actionGetById.perform(42);
			// then
			await expect(result).resolves.toBeNull();
		});


		test("get all empty", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", 1, null),
				SQL.insertItem("/path/to/file/1", 1001, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1002, "hash2", "thumbnail2"),
				SQL.insertItemsIntoCollection(1, [1, 2])
			]);
			// when
			const result: Promise<Group[]> = actionGetAll.perform(false, false);
			// then
			await expect(result).resolves.toEqual([]);
		});


		test("get all empty with collections and count", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1001, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1002, "hash2", "thumbnail2"),
				SQL.insertItemsIntoCollection(1, [1, 2])
			]);
			// when
			const result: Promise<Group[]> = actionGetAll.perform(true, true);
			// then
			await expect(result).resolves.toEqual([groupTopLevel([], [
				collectionNormal(1, "Collection 1", null, 2)
			])]);
		});


		test("get all without collections", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", 1),
				SQL.insertGroup("Group 3", null),
				SQL.insertCollection("Collection 1", "normal", 0, null),
				SQL.insertCollection("Collection 2", "smart", 1, "item_id <= 2"),
				SQL.insertCollection("Collection 3", "normal", 1, null),
				SQL.insertCollection("Collection 4", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1001, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1002, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1003, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1004, "hash4", "thumbnail4"),
				SQL.insertItemsIntoCollection(1, [1, 2, 4]),
				SQL.insertItemsIntoCollection(4, [4])
			]);
			// when
			const result: Promise<Group[]> = actionGetAll.perform(false, false);
			// then
			await expect(result).resolves.toEqual([
				group(1, "Group 1", null, []),
				group(2, "Group 2", 1, []),
				group(3, "Group 3", null, [])
			]);
		});


		test("get all with collections no item counts", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", 1),
				SQL.insertGroup("Group 3", null),
				SQL.insertCollection("Collection 1", "normal", 1, null),
				SQL.insertCollection("Collection 2", "smart", 2, "item_id <= 2"),
				SQL.insertCollection("Collection 3", "normal", 2, null),
				SQL.insertCollection("Collection 4", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1001, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1002, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1003, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1004, "hash4", "thumbnail4"),
				SQL.insertItemsIntoCollection(1, [1, 2, 4]),
				SQL.insertItemsIntoCollection(4, [4])
			]);
			// when
			const result: Promise<Group[]> = actionGetAll.perform(true, false);
			// then
			await expect(result).resolves.toEqual([
				groupTopLevel([], [
					collectionNormal(4, "Collection 4", null, null)
				]),
				group(1, "Group 1", null, [
					collectionNormal(1, "Collection 1", 1, null)
				]),
				group(2, "Group 2", 1, [
					collectionSmart(2, "Collection 2", 2, "item_id <= 2", null),
					collectionNormal(3, "Collection 3", 2, null)
				]),
				group(3, "Group 3", null, [])
			]);
		});


		test("get all with collections and item counts", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", 1),
				SQL.insertGroup("Group 3", null),
				SQL.insertCollection("Collection 1", "normal", 1, null),
				SQL.insertCollection("Collection 2", "smart", 2, "item_id <= 2"),
				SQL.insertCollection("Collection 3", "normal", 2, null),
				SQL.insertCollection("Collection 4", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1001, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1002, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1003, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1004, "hash4", "thumbnail4"),
				SQL.insertItemsIntoCollection(1, [1, 2, 4]),
				SQL.insertItemsIntoCollection(4, [4])

			]);
			// when
			const result: Promise<Group[]> = actionGetAll.perform(true, true);
			// then
			await expect(result).resolves.toEqual([
				groupTopLevel([], [
					collectionNormal(4, "Collection 4", null, 1)
				]),
				group(1, "Group 1", null, [
					collectionNormal(1, "Collection 1", 1, 3)
				]),
				group(2, "Group 2", 1, [
					collectionSmart(2, "Collection 2", 2, "item_id <= 2", 2),
					collectionNormal(3, "Collection 3", 2, 0)
				]),
				group(3, "Group 3", null, [])
			]);
		});


		test("get tree empty", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetTree = new ActionGetGroupTree(dbAccess, new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess)))
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", 1, null),
				SQL.insertItem("/path/to/file/1", 1001, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1002, "hash2", "thumbnail2"),
				SQL.insertItemsIntoCollection(1, [1, 2])
			]);
			// when
			const result: Promise<Group> = actionGetTree.perform(false, false);
			// then
			await expect(result).resolves.toEqual(groupTopLevel([]));
		});


		test("get tree empty with collections", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetTree = new ActionGetGroupTree(dbAccess, new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess)))
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertCollection("Collection 1", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1001, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1002, "hash2", "thumbnail2"),
				SQL.insertItemsIntoCollection(1, [1, 2])
			]);
			// when
			const result: Promise<Group> = actionGetTree.perform(true, true);
			// then
			await expect(result).resolves.toEqual(groupTopLevel([], [
				collectionNormal(1, "Collection 1", null, 2)
			]));
		});


		test("get tree", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetTree = new ActionGetGroupTree(dbAccess, new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess)))
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", null),
				SQL.insertGroup("Group 3", 1),
				SQL.insertGroup("Group 4", 1),
				SQL.insertGroup("Group 5", 3),
				SQL.insertCollection("Collection 1", "normal", 1, null),
				SQL.insertCollection("Collection 2", "smart", 3, "item_id <= 2"),
				SQL.insertCollection("Collection 3", "normal", 3, null),
				SQL.insertCollection("Collection 4", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1001, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1002, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1003, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1004, "hash4", "thumbnail4"),
				SQL.insertItemsIntoCollection(1, [1, 2, 4]),
				SQL.insertItemsIntoCollection(4, [4])
			]);
			// when
			const result: Promise<Group> = actionGetTree.perform(false, false);
			// then
			await expect(result).resolves.toEqual(
				groupTopLevel([
					group(1, "Group 1", null, [], [
						group(3, "Group 3", 1, [], [
							group(5, "Group 5", 3, [])]),
						group(4, "Group 4", 1, [], [])]),
					group(2, "Group 2", null, [], [])
				])
			);
		});


		test("get tree with collections and item counts", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetTree = new ActionGetGroupTree(dbAccess, new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess)))
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", null),
				SQL.insertGroup("Group 3", 1),
				SQL.insertGroup("Group 4", 1),
				SQL.insertGroup("Group 5", 3),
				SQL.insertCollection("Collection 1", "normal", 1, null),
				SQL.insertCollection("Collection 2", "smart", 3, "item_id <= 2"),
				SQL.insertCollection("Collection 3", "normal", 3, null),
				SQL.insertCollection("Collection 4", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1001, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1002, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1003, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1004, "hash4", "thumbnail4"),
				SQL.insertItemsIntoCollection(1, [1, 2, 4]),
				SQL.insertItemsIntoCollection(4, [4])
			]);
			// when
			const result: Promise<Group> = actionGetTree.perform(true, true);
			// then
			await expect(result).resolves.toEqual(
				groupTopLevel([
					group(1, "Group 1", null, [
						collectionNormal(1, "Collection 1", 1, 3)], [
						group(3, "Group 3", 1, [
							collectionSmart(2, "Collection 2", 3, "item_id <= 2", 2),
							collectionNormal(3, "Collection 3", 3, 0)], [
							group(5, "Group 5", 3, [])]),
						group(4, "Group 4", 1, [], [])]),
					group(2, "Group 2", null, [], [])], [
					collectionNormal(4, "Collection 4", null, 1)
				])
			);
		});

	});


	describe("create", () => {

		test("create new top level group", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionCreate = new ActionCreateGroup(dbAccess)
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Existing Group", null)
			]);
			// when
			const result = actionCreate.perform("New Group", null);
			// then
			await expect(result).resolves.toEqual({
				id: 2,
				name: "New Group",
				parentGroupId: null,
				collections: [],
				children: []
			});
			await expect(actionGetAll.perform(false, false)).resolves.toEqual([
				{
					id: 1,
					name: "Existing Group",
					parentGroupId: null,
					children: [],
					collections: []
				},
				{
					id: 2,
					name: "New Group",
					parentGroupId: null,
					children: [],
					collections: []
				}
			]);
		});


		test("create new child-group", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionCreate = new ActionCreateGroup(dbAccess)
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Existing Group", null)
			]);
			// when
			const result = actionCreate.perform("New Group", 1);
			// then
			await expect(result).resolves.toEqual({
				id: 2,
				name: "New Group",
				parentGroupId: 1,
				collections: [],
				children: []
			});
			await expect(actionGetAll.perform(false, false)).resolves.toEqual([
				{
					id: 1,
					name: "Existing Group",
					parentGroupId: null,
					children: [],
					collections: []
				},
				{
					id: 2,
					name: "New Group",
					parentGroupId: 1,
					children: [],
					collections: []
				}
			]);
		});


		test("create new child-group of invalid parent", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionCreate = new ActionCreateGroup(dbAccess)
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Existing Group", null)
			]);
			// when
			const result = actionCreate.perform("New Group", 42);
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetAll.perform(false, false)).resolves.toEqual([{
				id: 1,
				name: "Existing Group",
				parentGroupId: null,
				children: [],
				collections: []
			}]);
		});

	});


	describe("delete", () => {

		test("delete top level group", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionDelete = new ActionDeleteGroup(dbAccess, new ActionGetGroupById(dbAccess), new ActionMoveAllCollections(dbAccess), new ActionMoveAllGroups(dbAccess))
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", null)

			]);
			// when
			const result = actionDelete.perform(2, false);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetAll.perform(false, false)).resolves.toEqual([
				group(1, "Group 1", null, [], [])
			]);
		});

		test("delete non-existing group", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionDelete = new ActionDeleteGroup(dbAccess, new ActionGetGroupById(dbAccess), new ActionMoveAllCollections(dbAccess), new ActionMoveAllGroups(dbAccess))
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", null)

			]);
			// when
			const result = actionDelete.perform(42, false);
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetAll.perform(false, false)).resolves.toEqual([
				group(1, "Group 1", null, [], []),
				group(2, "Group 2", null, [], [])

			]);
		});


		test("delete child group", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionDelete = new ActionDeleteGroup(dbAccess, new ActionGetGroupById(dbAccess), new ActionMoveAllCollections(dbAccess), new ActionMoveAllGroups(dbAccess))
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", 1)
			]);
			// when
			const result = actionDelete.perform(2, false);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetAll.perform(false, false)).resolves.toEqual([
				group(1, "Group 1", null, [], [])
			]);
		});


		test("delete group", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionDelete = new ActionDeleteGroup(dbAccess, new ActionGetGroupById(dbAccess), new ActionMoveAllCollections(dbAccess), new ActionMoveAllGroups(dbAccess))
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", 1),
				SQL.insertGroup("Group 3", 2)
			]);
			// when
			const result = actionDelete.perform(2, false);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetAll.perform(false, false)).resolves.toEqual([
				group(1, "Group 1", null, [], []),
				group(3, "Group 3", 1, [], [])

			]);
		});


		test("delete child group with children", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionDelete = new ActionDeleteGroup(dbAccess, new ActionGetGroupById(dbAccess), new ActionMoveAllCollections(dbAccess), new ActionMoveAllGroups(dbAccess))
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			const actionGetAllCollections = new ActionGetAllCollections(dbAccess);
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", 1),
				SQL.insertGroup("Group 3", 2),
				SQL.insertCollection("Collection 1", "normal", 1, null),
				SQL.insertCollection("Collection 2", "smart", 2, "item_id <= 2"),
				SQL.insertCollection("Collection 3", "normal", 2, null),
				SQL.insertCollection("Collection 4", "normal", 3, null),
				SQL.insertCollection("Collection 5", "normal", null, null),
				SQL.insertItem("/path/to/file/1", 1001, "hash1", "thumbnail1"),
				SQL.insertItem("/path/to/file/2", 1002, "hash2", "thumbnail2"),
				SQL.insertItem("/path/to/file/3", 1003, "hash3", "thumbnail3"),
				SQL.insertItem("/path/to/file/4", 1004, "hash4", "thumbnail4"),
				SQL.insertItemsIntoCollection(1, [2, 3]),
				SQL.insertItemsIntoCollection(3, [1, 2, 4])
			]);
			// when
			const result = actionDelete.perform(2, true);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetAll.perform(true, true)).resolves.toEqual([
				groupTopLevel([], [
					collectionNormal(5, "Collection 5", null, 0)
				]),
				group(1, "Group 1", null, [
					collectionNormal(1, "Collection 1", 1, 2)
				])
			]);
			await expect(actionGetAllCollections.perform(false).then(cl => cl.map(c => c.id))).resolves.toEqual([1, 5]);
		});

	});


	describe("edit", () => {

		test("rename group", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			const actionRename = new ActionRenameGroup(dbAccess, new ActionGetGroupById(dbAccess))
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", 1),
				SQL.insertGroup("Group 3", 2)
			]);
			// when
			const result = actionRename.perform(2, "Renamed Group");
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetAll.perform(false, false)).resolves.toEqual([
				group(1, "Group 1", null, [], []),
				group(2, "Renamed Group", 1, [], []),
				group(3, "Group 3", 2, [], [])
			]);
		});


		test("rename non-existing group", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			const actionRename = new ActionRenameGroup(dbAccess, new ActionGetGroupById(dbAccess))
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", 1),
				SQL.insertGroup("Group 3", 2)
			]);
			// when
			const result = actionRename.perform(123, "Renamed Group");
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetAll.perform(false, false)).resolves.toEqual([
				group(1, "Group 1", null, [], []),
				group(2, "Group 2", 1, [], []),
				group(3, "Group 3", 2, [], [])
			]);
		});


		test("rename to same name", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			const actionRename = new ActionRenameGroup(dbAccess, new ActionGetGroupById(dbAccess))
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", 1),
				SQL.insertGroup("Group 3", 2)
			]);
			// when
			const result = actionRename.perform(2, "Group 2");
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetAll.perform(false, false)).resolves.toEqual([
				group(1, "Group 1", null, [], []),
				group(2, "Group 2", 1, [], []),
				group(3, "Group 3", 2, [], [])
			]);
		});

	});


	describe("move", () => {

		test("move group with all children", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			const actionMove = new ActionMoveGroup(dbAccess, new ActionGetGroupById(dbAccess))
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", null),
				SQL.insertGroup("Group 3", 1),
				SQL.insertGroup("Group 4", 2),
				SQL.insertGroup("Group 5", 4),
				SQL.insertGroup("Group 6", 4)
			]);
			// when
			const result = actionMove.perform(4, 1);
			// then
			await expect(result).resolves.toBeUndefined();
			await expect(actionGetAll.perform(false, false)).resolves.toEqual([
				group(1, "Group 1", null, [], []),
				group(2, "Group 2", null, [], []),
				group(3, "Group 3", 1, [], []),
				group(4, "Group 4", 1, [], []),
				group(5, "Group 5", 4, [], []),
				group(6, "Group 6", 4, [], [])
			]);
		});


		test("move group invalid: group does not exist", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			const actionMove = new ActionMoveGroup(dbAccess, new ActionGetGroupById(dbAccess))
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", null),
				SQL.insertGroup("Group 3", 1),
				SQL.insertGroup("Group 4", 2),
				SQL.insertGroup("Group 5", 4),
				SQL.insertGroup("Group 6", 4)
			]);
			// when
			const result = actionMove.perform(42, 1);
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetAll.perform(false, false)).resolves.toEqual([
				group(1, "Group 1", null, [], []),
				group(2, "Group 2", null, [], []),
				group(3, "Group 3", 1, [], []),
				group(4, "Group 4", 2, [], []),
				group(5, "Group 5", 4, [], []),
				group(6, "Group 6", 4, [], [])
			]);
		});


		test("move group invalid: target does not exist", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			const actionMove = new ActionMoveGroup(dbAccess, new ActionGetGroupById(dbAccess))
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", null),
				SQL.insertGroup("Group 3", 1),
				SQL.insertGroup("Group 4", 2),
				SQL.insertGroup("Group 5", 4),
				SQL.insertGroup("Group 6", 4)
			]);
			// when
			const result = actionMove.perform(4, 42);
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetAll.perform(false, false)).resolves.toEqual([
				group(1, "Group 1", null, [], []),
				group(2, "Group 2", null, [], []),
				group(3, "Group 3", 1, [], []),
				group(4, "Group 4", 2, [], []),
				group(5, "Group 5", 4, [], []),
				group(6, "Group 6", 4, [], [])
			]);
		});


		test("move group invalid: group equals target", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			const actionMove = new ActionMoveGroup(dbAccess, new ActionGetGroupById(dbAccess))
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", null),
				SQL.insertGroup("Group 3", 1),
				SQL.insertGroup("Group 4", 2),
				SQL.insertGroup("Group 5", 4),
				SQL.insertGroup("Group 6", 4)
			]);
			// when
			const result = actionMove.perform(3, 3);
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetAll.perform(false, false)).resolves.toEqual([
				group(1, "Group 1", null, [], []),
				group(2, "Group 2", null, [], []),
				group(3, "Group 3", 1, [], []),
				group(4, "Group 4", 2, [], []),
				group(5, "Group 5", 4, [], []),
				group(6, "Group 6", 4, [], [])
			]);
		});


		test("move group invalid: target is in subtree of source", async () => {
			// given
			const [actionCreateLibrary, dbAccess] = mockGroupService();
			const actionGetAll = new ActionGetAllGroups(dbAccess, new ActionGetAllCollections(dbAccess));
			const actionMove = new ActionMoveGroup(dbAccess, new ActionGetGroupById(dbAccess))
			await actionCreateLibrary.perform("TestLib", "path/to/test", false);
			await dbAccess.runMultipleSeq([
				SQL.insertGroup("Group 1", null),
				SQL.insertGroup("Group 2", 1),
				SQL.insertGroup("Group 3", 1),
				SQL.insertGroup("Group 4", 2),
				SQL.insertGroup("Group 5", 4),
				SQL.insertGroup("Group 6", 4)
			]);
			// when
			const result = actionMove.perform(2, 5);
			// then
			await expect(result).rejects.toBeDefined();
			await expect(actionGetAll.perform(false, false)).resolves.toEqual([
				group(1, "Group 1", null, [], []),
				group(2, "Group 2", 1, [], []),
				group(3, "Group 3", 1, [], []),
				group(4, "Group 4", 2, [], []),
				group(5, "Group 5", 4, [], []),
				group(6, "Group 6", 4, [], [])
			]);
		});

	});

});


function mockGroupService(): [ActionCreateLibrary, DbAccess] {
	const dbAccess = new MemDbAccess();
	const fsWrapper = mockFileSystemWrapper();
	fsWrapper.existsFile = jest.fn().mockReturnValue(false) as any;
	const actionCreateLibrary = new ActionCreateLibrary(dbAccess, fsWrapper);
	return [actionCreateLibrary, dbAccess];
}

function collectionNormal(id: number, name: string, group: number | null, itemCount: number | null): Collection {
	return {
		id: id,
		name: name,
		type: "normal",
		smartQuery: null,
		itemCount: itemCount,
		groupId: group
	};
}

function collectionSmart(id: number, name: string, group: number | null, query: string | null, itemCount: number | null): Collection {
	return {
		id: id,
		name: name,
		type: "smart",
		smartQuery: query,
		itemCount: itemCount,
		groupId: group
	};
}

function group(id: number, name: string, parent: number | null, collections: Collection[], children?: Group[]): Group {
	return {
		id: id,
		name: name,
		parentGroupId: parent,
		collections: collections,
		children: children ? children : []
	};
}

function groupTopLevel(children: Group[], collections?: Collection[]): Group {
	return {
		id: null,
		name: "",
		parentGroupId: null,
		children: children,
		collections: collections ? collections : []
	};
}