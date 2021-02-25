import { ItemDataAccess } from '../../persistence/itemDataAccess';
import { ImportProcessData, ItemData } from '../../../common/commonModels';
import { ImportService } from './importprocess/importService';

export class ItemService {

    itemDataAccess: ItemDataAccess;
    importService: ImportService;


    constructor(itemDataAccess: ItemDataAccess, importService: ImportService) {
        this.itemDataAccess = itemDataAccess;
        this.importService = importService;
    }

    public getAllItems(): Promise<ItemData[]> {
        return this.itemDataAccess.getAllItems();
    }

    public async importFiles(data: ImportProcessData): Promise<void> {
        return this.importService.importFiles(data);
    }


}