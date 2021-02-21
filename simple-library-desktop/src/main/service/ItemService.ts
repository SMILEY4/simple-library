import { ItemDataAccess } from '../persistence/itemDataAccess';


export interface ItemData {
    timestamp: number,
    filepath: string,
    hash: string,
    thumbnail: string,
}

export class ItemService {

    itemDataAccess: ItemDataAccess;


    constructor(itemDataAccess: ItemDataAccess) {
        this.itemDataAccess = itemDataAccess;
    }

    public getAllItems(): Promise<ItemData[]> {
        return this.itemDataAccess.getAllItems();
    }

}