import { CollectionDataAccess } from '../../persistence/collectionDataAccess';
import { Collection, Group, GroupDTO } from '../../../common/commonModels';
import { ItemService } from "../item/ItemService";
import { CollectionService } from '../collection/collectionService';
import { GroupDataAccess } from '../../persistence/groupDataAccess';

export class GroupService {

    groupDataAccess: GroupDataAccess;
    itemService: ItemService;
    collectionService: CollectionService;


    constructor(itemService: ItemService,
                collectionService: CollectionService,
                groupDataAccess: GroupDataAccess) {
        this.itemService = itemService;
        this.collectionService = collectionService;
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
            .then(async (data:GroupDTO[]) => {
                const collections: Collection[] | null = includeCollections
                    ? await this.collectionService.getAllCollections(includeItemCount)
                    : null;
                return this.createGroupTree(data, collections);
            });
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