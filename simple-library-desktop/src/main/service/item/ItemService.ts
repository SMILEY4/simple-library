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

    /**
     * Imports file(s) as specified in the given import process data
     * @param data the data specifying what and how to import
     * @return a promise that resolves with the result of the import process
     */
    public importFiles(data: ImportProcessData): Promise<ImportResult> {
        return this.importService.importFiles(data);
    }


    /**
     * Get all items (in the given collection)
     * @param collectionId the id of the collection. Set to undefined to get all items.
     * @return a promise that resolves with the items
     */
    public getAllItems(collectionId: number | undefined): Promise<ItemData[]> {
        return this.itemDataAccess.getAllItems(collectionId);
    }


    /**
     * Get the amount of all items of the library
     * @return a promise that resolves with the count of all items
     */
    public getTotalItemCount(): Promise<number> {
        return this.itemDataAccess.getTotalItemCount();
    }

}