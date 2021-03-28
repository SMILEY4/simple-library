import { Test } from "./testutils/test";
import { startAsync, startAsyncWithValue } from "../common/AsyncCommon";
import { CollectionService } from "../main/service/collection/collectionService";
import { CollectionDataAccess } from "../main/persistence/collectionDataAccess";
import { Collection, CollectionType, Group, GroupDTO } from "../common/commonModels";
import { allTrue, assertEqual } from "./testutils/testAssertions";
import { ItemService } from "../main/service/item/ItemService";
import { GroupDataAccess } from '../main/persistence/groupDataAccess';
import { GroupService } from '../main/service/group/groupService';

export class GroupTest {

    public static async testGetGroupsWithoutCollections() {
        await Test.runTest("get groups without collections", async () => {
            const collectionService: CollectionService = new CollectionService(new ItemServiceMock(), this.collectionDataAccessMock());
            const groupService: GroupService = new GroupService(new ItemServiceMock(), collectionService, null, this.groupDataAccessMock());

            const groups: Group[] = await groupService.getGroups(false, false);

            return allTrue([
                assertEqual(groups.length, 2),
                this.assertGroup(" A", groups[0], 1, 2, 0),
                this.assertGroup(" 1", groups[0].children[0], 2, 0, 0),
                this.assertGroup(" 2", groups[0].children[1], 3, 2, 0),
                this.assertGroup("2a", groups[0].children[1].children[0], 4, 0, 0),
                this.assertGroup("2B", groups[0].children[1].children[1], 5, 0, 0),
                this.assertGroup(" B", groups[1], 6, 1, 0),
                this.assertGroup(" 3", groups[1].children[0], 7, 0, 0),
            ]);
        });
    }


    public static async testGetGroupsWithCollections() {
        await Test.runTest("get groups with collections", async () => {
            const collectionService: CollectionService = new CollectionService(new ItemServiceMock(), this.collectionDataAccessMock());
            const groupService: GroupService = new GroupService(new ItemServiceMock(), collectionService, null, this.groupDataAccessMock());

            const groups: Group[] = await groupService.getGroups(true, true);

            return allTrue([
                assertEqual(groups.length, 1),
                this.assertGroup(" A", groups[0].children[0], 1, 2, 1),
                this.assertGroup(" 1", groups[0].children[0].children[0], 2, 0, 2),
                this.assertGroup(" 2", groups[0].children[0].children[1], 3, 2, 1),
                this.assertGroup("2a", groups[0].children[0].children[1].children[0], 4, 0, 0),
                this.assertGroup("2B", groups[0].children[0].children[1].children[1], 5, 0, 0),
                this.assertGroup(" B", groups[0].children[1], 6, 1, 1),
                this.assertGroup(" 3", groups[0].children[1].children[0], 7, 0, 0),
            ]);
        });
    }

    public static async testMoveGroupToTopLevel() {
        await Test.runTest("move group to top level", async () => {
            const groupService: GroupService = new GroupService(new ItemServiceMock(), null, null, this.groupDataAccessMock());
            return groupService.moveGroup(3, undefined)
                .then(() => true)
                .catch(() => false);
        });
    }

    public static async testMoveGroupIntoValid() {
        await Test.runTest("move group into valid group", async () => {
            const groupService: GroupService = new GroupService(new ItemServiceMock(), null, null, this.groupDataAccessMock());
            return groupService.moveGroup(3, 2)
                .then(() => true)
                .catch(() => false);
        });
    }

    public static async testMoveGroupIntoInvalid() {
        await Test.runTest("move group into invalid group", async () => {
            const groupService: GroupService = new GroupService(new ItemServiceMock(), null, null, this.groupDataAccessMock());
            return groupService.moveGroup(3, 5)
                .then(() => false)
                .catch(() => true);
        });
    }

    public static async testMoveGroupIntoNonExisting() {
        await Test.runTest("move group into non-existing group", async () => {
            const groupService: GroupService = new GroupService(new ItemServiceMock(), null, null, this.groupDataAccessMock());
            return groupService.moveGroup(3, 99)
                .then(() => false)
                .catch(() => true);
        });
    }

    private static collectionDataAccessMock(): CollectionDataAccess {
        return new CollectionDataAccessMock([
            this.collection(1, "Collection TL 1", 40, undefined),
            this.collection(2, "Collection TL 2", 30, undefined),
            this.collection(3, "Collection A", 10, 1),
            this.collection(4, "Collection 1.1", 110, 2),
            this.collection(4, "Collection 1.2", 111, 2),
            this.collection(4, "Collection 2a", 20, 3),
            this.collection(4, "Collection B", 30, 6),
        ]);
    }

    private static groupDataAccessMock(): GroupDataAccess {
        /*
              A      B
             / \     |
            1   2    3
               / \
              2a 2b
        */
        return new GroupDataAccessMock([
            this.groupDto(1, "Group A", undefined),
            this.groupDto(2, "Group 1", 1),
            this.groupDto(3, "Group 2", 1),
            this.groupDto(4, "Group 2a", 3),
            this.groupDto(5, "Group 2b", 3),
            this.groupDto(6, "Group B", undefined),
            this.groupDto(7, "Group 3", 6),
        ]);
    }

    private static groupDto(id: number, name: string, parentId: number | undefined): GroupDTO {
        return {
            id: id,
            name: name,
            parentId: parentId,
        };
    }

    private static collection(id: number, name: string, itemCount: number, groupId: number | undefined): Collection {
        return {
            id: id,
            name: name,
            type: CollectionType.NORMAL,
            smartQuery: null,
            itemCount: itemCount,
            groupId: groupId,
        };
    }

    private static assertGroup(msg: string, group: Group, expectedId: number, expectedNChildren: number, expectedNCollections: number): boolean {
        const valid = group.id === expectedId
            && group.children.length === expectedNChildren
            && group.collections.length === expectedNCollections;
        //console.log("  - " + msg + ": " + valid)
        return valid;
    }

}

class ItemServiceMock extends ItemService {

    constructor() {
        super(undefined, undefined, undefined);
    }

    async getTotalItemCount(): Promise<number> {
        return 42;
    }
}


class CollectionDataAccessMock extends CollectionDataAccess {

    collections: Collection[];

    constructor(collections: Collection[]) {
        super(undefined);
        this.collections = collections;
    }

    getCollections(includeItemCount: boolean): Promise<Collection[]> {
        return startAsyncWithValue(
            includeItemCount
                ? this.collections
                : this.collections.map(c => {
                    return {
                        id: c.id,
                        name: c.name,
                        type: CollectionType.NORMAL,
                        smartQuery: null,
                        itemCount: undefined,
                        groupId: c.groupId,
                    };
                }),
        );
    }
}


class GroupDataAccessMock extends GroupDataAccess {

    groupDTOs: GroupDTO[];

    constructor(groups: GroupDTO[]) {
        super(undefined);
        this.groupDTOs = groups;
    }

    getGroups(): Promise<GroupDTO[]> {
        return startAsyncWithValue(this.groupDTOs);
    }


    findGroupById(groupId: number): Promise<GroupDTO | undefined> {
        if(groupId === undefined) {
        } else {
        return this.getGroups()
            .then((groups: GroupDTO[]) => groups.find(group => group.id === groupId));
        }
    }

    setParentGroup(groupId: number, parentGroupId: number | null): Promise<void> {
        return startAsync();
    }
}

