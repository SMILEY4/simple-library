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

    public async getAllItems(collectionId: number | undefined, includeCollections: boolean): Promise<ItemData[]> {
        return this.itemDataAccess.getAllItems(collectionId, includeCollections);
    }

    public async getTotalItemCount(): Promise<number> {
        return this.itemDataAccess.getTotalItemCount();
    }

    public async moveItemsToCollection(sourceCollectionId: number, collectionId: number, itemIds: number[], copyMode: boolean): Promise<void> {
        console.log("moveItemsToCollection: " + sourceCollectionId + " > " + collectionId + "  " + itemIds + " (" + copyMode + ")")
        if (collectionId) {
            for (let i = 0; i < itemIds.length; i++) {
                const itemId: number = itemIds[i];
                if (copyMode) {
                    await this.collectionDataAccess.addItemToCollection(collectionId, itemId);
                } else {
                    await this.collectionDataAccess.moveItemsToCollection(sourceCollectionId, collectionId, itemId);
                }
            }
        }
    }


}