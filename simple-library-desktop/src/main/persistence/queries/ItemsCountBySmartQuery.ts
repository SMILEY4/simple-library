import {
    sqlCountItemsWithCollectionId,
    sqlCountItemsWithCustomFilter,
    sqlGetItemsCountTotal
} from "../sql/sql";
import {QuerySingle} from "./base/QuerySingle";


export class ItemsCountBySmartQuery extends QuerySingle<number> {

    constructor(smartQuery: string) {
        super(sqlCountItemsWithCustomFilter(smartQuery.trim()));
    }

    convertRow(row: any): number {
        return row.count;
    }

}
