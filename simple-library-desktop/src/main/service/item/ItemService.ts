import { ItemDataAccess } from '../../persistence/itemDataAccess';
import { ImportProcessData, ImportResult, ItemData } from '../../../common/commonModels';
import { ImportService } from './importprocess/importService';
import { CollectionDataAccess } from '../../persistence/collectionDataAccess';

export class ItemService {

    importService: ImportService;
    itemDataAccess: ItemDataAccess;
    collectionDataAccess: CollectionDataAccess;

    constructor(importService: ImportService,
                itemDataAccess: ItemDataAccess,
                collectionDataAccess: CollectionDataAccess) {
        this.importService = importService;
        this.itemDataAccess = itemDataAccess;
        this.collectionDataAccess = collectionDataAccess;
    }

    public async importFiles(data: ImportProcessData): Promise<ImportResult> {
        return this.importService.importFiles(data);
    }

    public async getAllItems(collectionId: number | undefined): Promise<ItemData[]> {
        return this.itemDataAccess.getAllItems(collectionId);
    }

    public async getTotalItemCount(): Promise<number> {
        return this.itemDataAccess.getTotalItemCount();
    }

    public async moveItemsToCollection(srcCollectionId: number, tgtCollectionId: number, itemIds: number[], copyMode: boolean): Promise<void> {
        for (let i = 0; i < itemIds.length; i++) {
            const itemId: number = itemIds[i];
            if (copyMode) {
                await this.collectionDataAccess.copyItemToCollection(tgtCollectionId, itemId);
            } else {
                await this.collectionDataAccess.moveItemsToCollection(srcCollectionId, tgtCollectionId, itemId);
            }
        }
    }


}