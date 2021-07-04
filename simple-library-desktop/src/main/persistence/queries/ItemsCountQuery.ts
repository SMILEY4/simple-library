import {sqlGetItemsCountTotal} from "../sql/sql";
import {QuerySingle} from "./base/QuerySingle";


export class ItemsCountQuery extends QuerySingle<number> {

    constructor() {
        super(sqlGetItemsCountTotal());
    }

    convertRow(row: any): number {
        return row.count;
    }

}
