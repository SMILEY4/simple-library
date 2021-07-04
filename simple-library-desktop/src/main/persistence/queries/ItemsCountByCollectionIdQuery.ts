import {sqlCountItemsWithCollectionId, sqlGetItemsCountTotal} from "../sql/sql";
import {QuerySingle} from "./base/QuerySingle";


export class ItemsCountByCollectionIdQuery extends QuerySingle<number> {

    constructor(collectionId: number) {
        super(sqlCountItemsWithCollectionId(collectionId));
    }

    convertRow(row: any): number {
        return row.count;
    }

}
