import { Collection, Group, GroupDTO } from '../../../common/commonModels';
import { ItemService } from "../item/ItemService";
import { CollectionService } from '../collection/collectionService';
import { GroupDataAccess } from '../../persistence/groupDataAccess';
import { CollectionDataAccess } from '../../persistence/collectionDataAccess';
import { failAsync } from '../../../common/AsyncCommon';

export class GroupService {

    groupDataAccess: GroupDataAccess;
    itemService: ItemService;
    collectionService: CollectionService;
    collectionDataAccess: CollectionDataAccess;


    constructor(itemService: ItemService,
                collectionService: CollectionService,
                collectionDataAccess: CollectionDataAccess,
                groupDataAccess: GroupDataAccess) {
        this.itemService = itemService;
        this.collectionService = collectionService;
        this.collectionDataAccess = collectionDataAccess;
        this.groupDataAccess = groupDataAccess;
    }


    /**
     * Get all groups. If collections should be included, a dummy root-group will be created containing all top-level groups and collections
     * @param includeCollections whether to include the child-collections of the groups (collections are 'null' if false)
     * @param includeItemCount whether to include the item count of the child-collections
     * @return a promise that resolves with the array of {@link Group}s (or an array with a single dummy root-group)
     */
    public getGroups(includeCollections: boolean, includeItemCount: boolean): Promise<Group[]> {
        return this.groupDataAccess.getGroups()
            .then(async (data: GroupDTO[]) => {
                const collections: Collection[] | null = includeCollections
                    ? await this.collectionService.getAllCollections(includeItemCount)
                    : null;
                return this.createGroupTree(data, collections);
            });
    }


    /**
     * Creates a new group with the given name
     * @param name the name of the group
     * @param parentGroupId the id of the parent group or null
     * @return a promise that resolves with the created group
     */
    public async createGroup(name: string, parentGroupId: number | undefined): Promise<Group> {
        return this.groupDataAccess.createGroup(name, parentGroupId)
            .then((groupDTO: GroupDTO) => ({
                id: groupDTO.id,
                name: groupDTO.name,
                children: [],
                collections: [],
            }));
    }


    /**
     * Deletes the given group
     * @param groupId the id of the group
     * @param deleteChildren whether to also delete all of its children (collections,groups,...)
     * @return a promise that resolves when the group was deleted
     */
    public deleteGroup(groupId: number, deleteChildren: boolean): Promise<void> {
        if (!deleteChildren) {
            return this.groupDataAccess.findGroupById(groupId)
                .then((group: GroupDTO) => {
                    if (group) {
                        const groupId: number = group.id;
                        const parentId: number | null = group.parentId ? group.parentId : null;
                        return Promise.all([
                            this.groupDataAccess.moveGroups(groupId, parentId),
                            this.collectionDataAccess.moveCollections(groupId, parentId),
                        ]);
                    }
                })
                .then(() => this.groupDataAccess.deleteGroup(groupId));
        } else {
            return this.groupDataAccess.deleteGroup(groupId);
        }
    }


    /**
     * Renames the given group
     * @param groupId the id of the group
     * @param newName the new name of the group
     * @return a promise that resolves when the group was renamed
     */
    public renameGroup(groupId: number, newName: string): Promise<void> {
        return this.groupDataAccess.renameGroup(groupId, newName.trim());
    }


    /**
     * Renames the given group into the given parent group
     * @param groupId the id of the group
     * @param targetGroupId the id of the new parent group
     * @return a promise that resolves when the group was moved
     */
    public async moveGroup(groupId: number, targetGroupId: number | undefined): Promise<void> {
        if (await this.validateGroupMovement(groupId, targetGroupId)) {
            return this.groupDataAccess.setParentGroup(groupId, targetGroupId ? targetGroupId : null);
        } else {
            return failAsync("Group movement is invalid.");
        }
    }


    private async validateGroupMovement(groupId: number, targetGroupId: number | undefined): Promise<boolean> {
        // group exists
        // group =!= targetGroupId
        // group can not be moved into a group of the subtree with itself as the root
        if (groupId === targetGroupId) {
            return false;
        }

        const group: GroupDTO | undefined = await this.groupDataAccess.findGroupById(groupId);
        if (group === undefined) {
            return false;
        }

        if (targetGroupId !== undefined) {
            const targetGroup: GroupDTO | undefined = await this.groupDataAccess.findGroupById(targetGroupId);
            if (targetGroup === undefined) {
                return false;
            }

            let counter: number = 0;
            let openGroupId: number | null = targetGroupId;
            while (openGroupId !== null && openGroupId !== groupId && counter < 100) {
                counter++;
                const openGroup: GroupDTO = await this.groupDataAccess.findGroupById(openGroupId);
                if (openGroup) {
                    openGroupId = openGroup.parentId ? openGroup.parentId : null;
                } else {
                    openGroupId = null;
                }
            }
            if (counter >= 100 || openGroupId === groupId) {
                return false;
            }
        }

        return true;
    }


    private createGroupTree(groupDTOs: GroupDTO[], collections: Collection[] | null): Group[] {
        const rootGroups: Group[] = [];
        const groupMap: Map<number, Group> = new Map();
        groupDTOs.forEach((dto: GroupDTO) => {
            const group: Group = {
                id: dto.id,
                name: dto.name,
                children: [],
                collections: collections ? collections.filter(c => c.groupId === dto.id) : [],
            };
            groupMap.set(group.id, group);
            if (!dto.parentId) {
                rootGroups.push(group);
            }
        });
        groupDTOs.forEach((dto: GroupDTO) => {
            if (dto.parentId) {
                const current: Group = groupMap.get(dto.id);
                const parent: Group = groupMap.get(dto.parentId);
                parent.children.push(current);
            }
        });

        if (collections) {
            const root: Group = {
                id: undefined,
                name: "root",
                children: rootGroups,
                collections: collections.filter(c => !c.groupId),
            };
            return [root];
        } else {
            return rootGroups;
        }
    }

}
