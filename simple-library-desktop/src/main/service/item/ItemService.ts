import { ItemDataAccess } from '../../persistence/itemDataAccess';
import { ImportProcessData, ImportResult, ItemData } from '../../../common/commonModels';
import { ImportService } from './importprocess/importService';

export class ItemService {

    itemDataAccess: ItemDataAccess;
    importService: ImportService;


    constructor(itemDataAccess: ItemDataAccess, importService: ImportService) {
        this.itemDataAccess = itemDataAccess;
        this.importService = importService;
    }

    public getAllItems(collectionId: number | undefined, includeCollections: boolean): Promise<ItemData[]> {
        return this.itemDataAccess.getAllItems(collectionId, includeCollections);
    }

    public async importFiles(data: ImportProcessData): Promise<ImportResult> {
        return this.importService.importFiles(data);
    }


}