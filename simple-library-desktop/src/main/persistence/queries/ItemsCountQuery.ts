import {sqlGetItemsCountTotal} from "../sql/sql";
import {QuerySingle} from "./base/QuerySingle";
import DataAccess from "../dataAccess";


export class ItemsCountQuery extends QuerySingle<number> {

    static run(dataAccess: DataAccess): Promise<number> {
        return new ItemsCountQuery().run(dataAccess);
    }

    constructor() {
        super(sqlGetItemsCountTotal());
    }

    convertRow(row: any): number {
        return row.count;
    }

}
