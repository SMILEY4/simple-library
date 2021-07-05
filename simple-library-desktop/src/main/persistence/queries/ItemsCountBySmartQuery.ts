import {sqlCountItemsWithCustomFilter, sqlGetItemsCountTotal} from "../sql/sql";
import {QuerySingle} from "./base/QuerySingle";


export class ItemsCountBySmartQuery extends QuerySingle<number> {

    constructor(smartQuery: string | null) {
        super(smartQuery && smartQuery.trim().length > 0
            ? sqlCountItemsWithCustomFilter(smartQuery.trim())
            : sqlGetItemsCountTotal());
    }

    convertRow(row: any): number {
        return row.count;
    }

}
