import {CollectionDataAccess} from '../../persistence/collectionDataAccess';
import {Collection, Group, GroupDTO} from '../../../common/commonModels';
import {ItemService} from "../item/ItemService";

export class CollectionService {

    collectionDataAccess: CollectionDataAccess;
    itemService: ItemService;

    constructor(itemService: ItemService, collectionDataAccess: CollectionDataAccess) {
        this.collectionDataAccess = collectionDataAccess;
        this.itemService = itemService;
    }

    public getAllCollections(includeItemCount: boolean): Promise<Collection[]> {
        return this.collectionDataAccess.getCollections(includeItemCount)
            .then(async (collections: Collection[]) => {
                const allItemsCollection: Collection = {
                    id: undefined,
                    groupId: undefined,
                    itemCount: await this.itemService.getTotalItemCount(),
                    name: "All Items"
                }
                return [allItemsCollection, ...collections];
            });
    }

    public getGroups(includeCollections: boolean, includeItemCount: boolean): Promise<Group[]> {
        return this.collectionDataAccess.getGroups()
            .then(async (data) => {
                const collections: Collection[] | null = includeCollections
                    ? await this.getAllCollections(includeItemCount)
                    : null;
                return this.createGroupTree(data, collections)
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
                collections: collections ? collections.filter(c => c.groupId === dto.id) : []
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
                parent.children.push(current)
            }
        });

        if (collections) {
            const root: Group = {
                id: undefined,
                name: "root",
                children: rootGroups,
                collections: collections.filter(c => !c.groupId)
            }
            return [root]
        } else {
            return rootGroups;
        }

    }

    public createCollection(name: string): Promise<Collection> {
        return this.collectionDataAccess.createCollection(name);
    }

    public deleteCollection(collectionId: number): Promise<void> {
        return this.collectionDataAccess.deleteCollection(collectionId);
    }

    public renameCollection(collectionId: number, newCollectionName: string): Promise<void> {
        return this.collectionDataAccess.renameCollection(collectionId, newCollectionName);
    }

}
